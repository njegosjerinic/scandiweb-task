import { useEffect, useState } from "react";
import parse from "html-react-parser";

const fetchGraphQL = async (query) => {
  const res = await fetch("/api/index.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  return data.data;
};

export default function PDP({ id, addToCart }) {
  const [product, setProduct] = useState(null);
  const [selected, setSelected] = useState({});
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    fetchGraphQL(`
      {
        product(id: "${id}") {
          id
          name
          inStock
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

  const nextImage = () => {
    setImageIndex((prev) =>
      prev === product.gallery.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setImageIndex((prev) =>
      prev === 0 ? product.gallery.length - 1 : prev - 1,
    );
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="pdp">
      {/* LEFT */}
      <div className="pdp__gallery" data-testid="product-gallery">
        {product.gallery.map((img, i) => (
          <img
            key={i}
            src={img}
            className="pdp__thumb"
            onClick={() => setImageIndex(i)}
          />
        ))}
      </div>

      {/* CENTER */}
      <div className="pdp__image">
        <img src={product.gallery[imageIndex]} alt="" />

        <button onClick={prevImage} className="arrow left">
          {"<"}
        </button>
        <button onClick={nextImage} className="arrow right">
          {">"}
        </button>
      </div>

      {/* RIGHT */}
      <div className="pdp__info">
        <h2 className="pdp__title">{product.name}</h2>

        {product.attributes.map((attr) => (
          <div
            key={attr.name}
            className="pdp__attr"
            data-testid={`product-attribute-${attr.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <p className="pdp__attr-name">{attr.name}:</p>

            <div className="pdp__attr-items">
              {attr.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectAttr(attr.name, item.value)}
                  className={`pdp__attr-btn ${
                    selected[attr.name] === item.value ? "active" : ""
                  }`}
                  style={
                    attr.name.toLowerCase() === "color"
                      ? {
                          background: item.value,
                          width: "32px",
                          height: "32px",
                          border:
                            selected[attr.name] === item.value
                              ? "2px solid #5ECE7B"
                              : "1px solid #ccc",
                        }
                      : {}
                  }
                >
                  {attr.name.toLowerCase() === "color" ? "" : item.displayValue}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pdp__price">
          <p>PRICE:</p>
          <h3>
            {product.prices[0].currency.symbol}
            {product.prices[0].amount.toFixed(2)}
          </h3>
        </div>

        <button
          className="pdp__cart-btn"
          data-testid="add-to-cart"
          disabled={
            !product.inStock || // 🔥 DODAJ
            Object.keys(selected).length !== product.attributes.length
          }
          onClick={() => addToCart(product, { ...selected })}
        >
          ADD TO CART
        </button>

        <div className="pdp__desc" data-testid="product-description">
          {parse(product.description)}
        </div>
      </div>
    </div>
  );
}
