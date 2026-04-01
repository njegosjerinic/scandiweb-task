<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use App\Repository\AttributeRepository;
use App\Repository\OrderRepository;
use App\GraphQL\Types\ProductType;
use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;

class GraphQL
{
    static public function handle()
    {

        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Allow-Methods: POST, OPTIONS");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        try {

            $pdo = new \PDO('mysql:host=localhost;dbname=scandiweb', 'root', 'root');
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

            $productType = new ProductType();

            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [

                    // PRODUCTS LIST
                    'products' => [
                        'type' => Type::listOf($productType),
                        'args' => [
                            'category' => ['type' => Type::string()]
                        ],
                        'resolve' => function ($root, $args) use ($pdo) {
                            $attributeRepo = new AttributeRepository($pdo);
                            $repo = new ProductRepository($pdo, $attributeRepo);

                            if (isset($args['category'])) {
                                return array_map(fn($p) => $p->toArray(), $repo->getByCategory($args['category']));
                            }

                            return array_map(fn($p) => $p->toArray(), $repo->getAll());
                        },
                    ],

                    // SINGLE PRODUCT
                    'product' => [
                        'type' => $productType,
                        'args' => [
                            'id' => ['type' => Type::string()]
                        ],
                        'resolve' => function ($root, $args) use ($pdo) {
                            $attributeRepo = new AttributeRepository($pdo);
                            $repo = new ProductRepository($pdo, $attributeRepo);

                            $product = $repo->getById($args['id']);

                            if (!$product) {
                                return null;
                            }

                            return $product->toArray();
                        },
                    ],

                ],
            ]);

            // MUTATION
            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [

                    'placeOrder' => [
                        'type' => Type::string(),
                        'args' => [
                            'input' => Type::string()
                        ],
                        'resolve' => function ($root, $args) use ($pdo) {

                            $input = json_decode($args['input'], true);

                            $repo = new OrderRepository($pdo);

                            $orderId = $repo->createOrder($input);

                            return "Order created with ID: " . $orderId;
                        }
                    ],

                ],
            ]);

            // See docs on schema options:
            // https://webonyx.github.io/graphql-php/schema-definition/#configuration-options
            $schema = new Schema(
                (new SchemaConfig())
                    ->setQuery($queryType)
                    ->setMutation($mutationType)
            );

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();

        } catch (Throwable $e) {
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        return json_encode($output);
    }
}