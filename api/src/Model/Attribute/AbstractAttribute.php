<?php

namespace App\Model\Attribute;

abstract class AbstractAttribute
{

    protected array $items = [];

    public function __construct(
        protected string $id,
        protected string $name,
        protected string $type
    ) {

    }

    abstract public function getType(): string;

    public function setItems(array $items): void
    {
        $this->items = $items;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'items' => $this->items,
        ];
    }
}