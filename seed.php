<?php

$json = file_get_contents('data.json');
$data = json_decode($json, true);

$pdo = new PDO('mysql:host=localhost;dbname=scandiweb', 'root', 'root');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

$pdo->exec("TRUNCATE TABLE product_images");
$pdo->exec("TRUNCATE TABLE prices");
$pdo->exec("TRUNCATE TABLE attribute_items");
$pdo->exec("TRUNCATE TABLE product_attributes");
$pdo->exec("TRUNCATE TABLE attributes");
$pdo->exec("TRUNCATE TABLE currencies");
$pdo->exec("TRUNCATE TABLE products");
$pdo->exec("TRUNCATE TABLE categories");
$pdo->exec("TRUNCATE TABLE order_items");
$pdo->exec("TRUNCATE TABLE orders");

$pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

foreach ($data['data']['categories'] as $category) {
    $stmt = $pdo->prepare("
        INSERT IGNORE INTO categories (name)
        VALUES (?)
    ");

    $stmt->execute([$category['name']]);
}

foreach ($data['data']['products'] as $product) {

    $stmt = $pdo->prepare("
        INSERT INTO products (id, name, in_stock, description, category_id, brand)
        VALUES (?, ?, ?, ?, ?, ?) 
    ");

    $catStmt = $pdo->prepare("SELECT id FROM categories WHERE name = ?");
    $catStmt->execute([$product['category']]);
    $categoryId = $catStmt->fetchColumn();

    $stmt->execute([
        $product['id'],
        $product['name'],
        $product['inStock'] ? 1 : 0,
        $product['description'],
        $categoryId,
        $product['brand']
    ]);

    foreach ($product['gallery'] as $image) {
        $imgStmt = $pdo->prepare("
            INSERT INTO product_images (product_id, url)
            VALUES (?, ?)
        ");

        $imgStmt->execute([$product['id'], $image]);
    }

    foreach ($product['prices'] as $price) {

        $curStmt = $pdo->prepare("
            INSERT IGNORE INTO currencies (label, symbol)
            VALUES (?, ?)
        ");
        $curStmt->execute([
            $price['currency']['label'],
            $price['currency']['symbol']
        ]);

        $getCur = $pdo->prepare("
            SELECT id FROM currencies WHERE label = ?
        ");
        $getCur->execute([$price['currency']['label']]);
        $currencyId = $getCur->fetchColumn();

        $priceStmt = $pdo->prepare("
            INSERT INTO prices (product_id, currency_id, amount)
            VALUES (?, ?, ?)
        ");

        $priceStmt->execute([
            $product['id'],
            $currencyId,
            $price['amount']
        ]);
    }

    foreach ($product['attributes'] as $attribute) {

        $attrStmt = $pdo->prepare("
            INSERT IGNORE INTO attributes (name, type)
            VALUES (?, ?)
        ");
        $attrStmt->execute([
            $attribute['name'],
            $attribute['type']
        ]);

        $getAttr = $pdo->prepare("
            SELECT id FROM attributes WHERE name = ?
        ");
        $getAttr->execute([$attribute['name']]);
        $attributeId = $getAttr->fetchColumn();

        $linkStmt = $pdo->prepare("
            INSERT INTO product_attributes (product_id, attribute_id)
            VALUES (?, ?)
        ");
        $linkStmt->execute([
            $product['id'],
            $attributeId
        ]);

        foreach ($attribute['items'] as $item) {
            $itemStmt = $pdo->prepare("
                INSERT INTO attribute_items (attribute_id, display_value, value, item_id)
                VALUES (?, ?, ?, ?)
            ");

            $itemStmt->execute([
                $attributeId,
                $item['displayValue'],
                $item['value'],
                $item['id']
            ]);
        }
    }
}


echo "Seeding done";