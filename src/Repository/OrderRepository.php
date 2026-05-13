<?php

namespace App\Repository;
use PDO;

class OrderRepository
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function createOrder(array $input)
    {
        try {

            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare("
                SELECT p.amount, p.currency_id, c.label, c.symbol
                FROM prices p
                JOIN currencies c
                 ON p.currency_id = c.id
                WHERE product_id = ?
            ");

            $total = 0;

            foreach ($input as $item) {

                $stmt->execute([$item['productId']]);

                $product = $stmt->fetch();

                $total += $product['amount'] * $item['quantity'];


            }

            $stmt = $this->pdo->prepare("
                INSERT INTO orders (total_amount, currency_label, currency_symbol)
                VALUES (?, ?, ?)
            ");

            $stmt->execute([
                $total,
                $product['label'],
                $product['symbol']
            ]);

            $orderId = $this->pdo->lastInsertId();

            foreach ($input as $item) {

                $stmt = $this->pdo->prepare("
                    INSERT INTO order_items 
                    (order_id, product_id, product_name, quantity, unit_price, attributes)
                    VALUES (?, ?, ?, ?, ?, ?)
                ");

                $nameStmt = $this->pdo->prepare("
                    SELECT p.name, p.id, pr.amount
                    FROM products p
                    JOIN prices pr
                    ON p.id = pr.product_id
                    WHERE p.id = ?
                ");

                $nameStmt->execute([$item['productId']]);

                $product = $nameStmt->fetch();

                $stmt->execute([
                    $orderId,
                    $item['productId'],
                    $product['name'],
                    $item['quantity'],
                    $product['amount'],
                    $item['attributes'],
                ]);
            }

            $this->pdo->commit();

            return $orderId;

        } catch (\Exception $e) {
            $this->pdo->rollBack();

            error_log($e->getMessage());

            throw new \Exception('Failed to create order');
        }
    }
}