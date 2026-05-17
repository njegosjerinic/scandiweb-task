<?php

namespace App\Repository;

use App\Factory\ProductFactory;

class ProductRepository
{
    private $pdo;
    private $attributeRepository;

    public function __construct($pdo, $attributeRepository)
    {
        $this->pdo = $pdo;
        $this->attributeRepository = $attributeRepository;
    }

    public function getAll()
    {
        $stmt = $this->pdo->query("
        SELECT p.*, c.name as category
        FROM products p
        JOIN categories c ON p.category_id = c.id
    ");

        $products = [];

        foreach ($stmt->fetchAll(\PDO::FETCH_ASSOC) as $product) {

            $productObj = ProductFactory::create($product);

            $productObj->setGallery($this->getGallery($product['id']));
            $productObj->setPrices($this->getPrices($product['id']));
            $productObj->setAttributes(
                $this->attributeRepository->getByProductId($product['id'])
            );

            $products[] = $productObj;
        }

        return $products;
    }

    public function getByCategory($category)
    {
        $stmt = $this->pdo->prepare("
        SELECT p.*, c.name as category
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE c.name = ?
    ");

        $stmt->execute([$category]);

        $products = [];

        foreach ($stmt->fetchAll(\PDO::FETCH_ASSOC) as $product) {

            $productObj = ProductFactory::create($product);

            $productObj->setGallery($this->getGallery($product['id']));
            $productObj->setPrices($this->getPrices($product['id']));
            $productObj->setAttributes(
                $this->attributeRepository->getByProductId($product['id'])
            );

            $products[] = $productObj;
        }

        return $products;
    }

    public function getGallery($productId)
    {
        $stmt = $this->pdo->prepare("SELECT url FROM product_images WHERE product_id = ?");

        $stmt->execute([$productId]);

        $imgArray = [];

        foreach ($stmt->fetchAll(\PDO::FETCH_ASSOC) as $row) {
            $imgArray[] = $row['url'];
        }

        return $imgArray;
    }

    public function getById($id)
    {
        $stmt = $this->pdo->prepare("
        SELECT p.*, c.name as category
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    ");

        $stmt->execute([$id]);

        $product = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$product) {
            return null;
        }

        $productObj = ProductFactory::create($product);

        $productObj->setGallery($this->getGallery($product['id']));
        $productObj->setPrices($this->getPrices($product['id']));
        $productObj->setAttributes(
            $this->attributeRepository->getByProductId($product['id'])
        );

        return $productObj;
    }

    public function getPrices($productId)
    {
        $stmt = $this->pdo->prepare("SELECT amount, label, symbol
                                    FROM prices 
                                    JOIN currencies 
                                    ON prices.currency_id = currencies.id
                                    WHERE product_id = ?"
        );

        $stmt->execute([$productId]);

        $pricesArray = [];

        foreach ($stmt->fetchAll(\PDO::FETCH_ASSOC) as $price) {
            $pricesArray[] = [
                'amount' => $price['amount'],
                'currency' => [
                    'label' => $price['label'],
                    'symbol' => $price['symbol']
                ]
            ];
        }

        return $pricesArray;
    }
}

