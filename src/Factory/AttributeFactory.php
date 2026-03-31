<?php

namespace App\Factory;

use App\Model\Attribute\AbstractAttribute;
use App\Model\Attribute\SwatchAttribute;
use App\Model\Attribute\TextAttribute;

class AttributeFactory
{
    public static function create(array $data): AbstractAttribute
    {
        return match ($data['type']) {
            'text' => new TextAttribute(
                $data['id'],
                $data['name'],
                $data['type']
            ),
            'swatch' => new SwatchAttribute(
                $data['id'],
                $data['name'],
                $data['type']
            )
        };
    }
}