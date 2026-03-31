<?php

namespace App\Factory;

use App\Model\Product\ClothesProduct;
use App\Model\Product\TechProduct;
use App\Model\Product\AbstractProduct;

class ProductFactory
{
    public static function create(array $data): AbstractProduct
    {


        return match ($data['category']) {
            'clothes' => new ClothesProduct(
                $data['id'],
                $data['name'],
                (bool) $data['in_stock'],
                $data['description'],
                $data['category'],
                $data['brand']
            ),

            'tech' => new TechProduct(
                $data['id'],
                $data['name'],
                (bool) $data['in_stock'],
                $data['description'],
                $data['category'],
                $data['brand']
            )
        };
    }
}