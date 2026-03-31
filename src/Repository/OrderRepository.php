<?php

namespace App\Repository;

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
            INSERT INTO orders (total_amount, currency_label, currency_symbol)
            VALUES (?, ?, ?)
        ");

            $stmt->execute([
                $input['totalAmount'],
                $input['currencyLabel'],
                $input['currencySymbol']
            ]);

            $orderId = $this->pdo->lastInsertId();

            foreach ($input['items'] as $item) {

                $stmt = $this->pdo->prepare("
                INSERT INTO order_items 
                (order_id, product_id, product_name, quantity, unit_price, attributes)
                VALUES (?, ?, ?, ?, ?, ?)
            ");

                $stmt->execute([
                    $orderId,
                    $item['productId'],
                    $item['name'],
                    $item['quantity'],
                    $item['price'],
                    json_encode($item['attributes'])
                ]);
            }

            $this->pdo->commit();

            return $orderId;

        } catch (\Exception $e) {
            $this->pdo->rollBack();
            die($e->getMessage()); // 🔥 ovo će ti reći tačno šta puca
        }
    }
}