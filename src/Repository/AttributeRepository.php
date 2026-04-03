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
            $attribute->setItems(
                $this->getItemsByAttributeId($row['id'], $productId)
            );
            $attributes[] = $attribute->toArray();
        }

        return $attributes;
    }

    private function getItemsByAttributeId(string $attributeId, string $productId): array
    {
        $stmt = $this->pdo->prepare("
        SELECT ai.display_value, ai.value, ai.item_id
        FROM attribute_items ai
        JOIN product_attribute_items pai 
            ON ai.item_id = pai.attribute_item_id
        WHERE ai.attribute_id = ?
        AND pai.product_id = ?
    ");

        $stmt->execute([$attributeId, $productId]);

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $items = [];

        foreach ($rows as $row) {
            // 🔥 ključ: dedupe po item_id
            $items[$row['item_id']] = [
                'displayValue' => $row['display_value'],
                'value' => $row['value'],
                'id' => $row['item_id'],
            ];
        }

        return array_values($items);
    }

}