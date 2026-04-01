import { useEffect, useState } from "react";

const fetchGraphQL = async (query) => {
  const res = await fetch("http://localhost:8000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  return data.data;
};

export default function PDP({ id, cart, setCart }) {
  const [product, setProduct] = useState(null);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    fetchGraphQL(`
      {
        product(id: "${id}") {
          id
          name
          gallery
          description
          prices {
            amount
            currency { symbol }
          }
          attributes {
            name
            items {
              id
              value
              displayValue
            }
          }
        }
      }
    `).then((data) => setProduct(data.product));
  }, [id]);

  const selectAttr = (attrName, value) => {
    setSelected((prev) => ({
      ...prev,
      [attrName]: value,
    }));
  };

  const addToCart = () => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        JSON.stringify(item.selected) === JSON.stringify(selected),
    );

    if (existingIndex !== -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          prices: product.prices,
          gallery: product.gallery,
          selected: selected,
          attributes: product.attributes,
          quantity: 1,
        },
      ]);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>PDP</h1>
      <h2>{product.name}</h2>

      {product.attributes.map((attr) => (
        <div key={attr.name}>
          <h4>{attr.name}</h4>

          <div data-testid={`product-attribute-${attr.name.toLowerCase()}`}>
            {attr.items.map((item) => (
              <button
                key={item.id}
                onClick={() => selectAttr(attr.name, item.value)}
                style={{
                  margin: "5px",
                  padding: "10px",
                  border:
                    selected[attr.name] === item.value
                      ? "2px solid green"
                      : "1px solid gray",
                }}
              >
                {item.displayValue}
              </button>
            ))}
          </div>
        </div>
      ))}

      <p>
        {product.prices[0].currency.symbol}
        {product.prices[0].amount.toFixed(2)}
      </p>

      <button
        data-testid="add-to-cart"
        disabled={Object.keys(selected).length !== product.attributes.length}
        onClick={addToCart}
      >
        Add to cart
      </button>
    </div>
  );
}
