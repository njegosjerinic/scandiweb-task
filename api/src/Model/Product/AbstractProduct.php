<?php

namespace App\Model\Product;

abstract class AbstractProduct
{
    protected array $gallery = [];
    protected array $prices = [];
    protected array $attributes = [];

    public function __construct(
        protected string $id,
        protected string $name,
        protected bool $inStock,
        protected string $description,
        protected string $category,
        protected string $brand
    ) {
    }

    abstract public function getType(): string;

    public function setGallery(array $gallery): void
    {
        $this->gallery = $gallery;
    }

    public function setPrices(array $prices): void
    {
        $this->prices = $prices;
    }

    public function setAttributes(array $attributes): void
    {
        $this->attributes = $attributes;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'inStock' => $this->inStock,
            'description' => $this->description,
            'category' => $this->category,
            'brand' => $this->brand,
            'gallery' => $this->gallery,
            'prices' => $this->prices,
            'attributes' => $this->attributes,
        ];
    }
}