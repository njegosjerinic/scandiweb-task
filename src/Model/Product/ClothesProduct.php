<?php

namespace App\Model\Product;

class ClothesProduct extends AbstractProduct
{
    public function getType(): string
    {
        return 'clothes';
    }
}