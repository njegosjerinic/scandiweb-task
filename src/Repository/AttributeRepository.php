<?php

namespace App\Repository;

use App\Factory\AttributeFactory;
use PDO;

class AttributeRepository
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getByProductId(string $productId): array
    {
        $stmt = $this->pdo->prepare("
        SELECT a.id, a.name, a.type
        FROM attributes a
        JOIN product_attributes pa ON a.id = pa.attribute_id
        WHERE pa.product_id = ?
    ");

        $stmt->execute([$productId]);

        $attributes = [];

        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $attribute = AttributeFactory::create($row);
            $attribute->setItems($this->getItemsByAttributeId($row['id']));
            $attributes[] = $attribute->toArray();
        }

        return $attributes;
    }

    private function getItemsByAttributeId(string $attributeId): array
    {
        $stmt = $this->pdo->prepare("
            SELECT display_value, value, item_id
            FROM attribute_items
            WHERE attribute_id = ?
        ");

        $stmt->execute([$attributeId]);

        $items = [];

        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $items[] = [
                'displayValue' => $row['display_value'],
                'value' => $row['value'],
                'id' => $row['item_id'],
            ];
        }

        return $items;
    }

}