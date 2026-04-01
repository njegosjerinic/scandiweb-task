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

export default function Products({ setSelectedProductId, category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchGraphQL(`
    {
      products(category: "${category}") {
        id
        name
        gallery
        prices {
          amount
          currency { symbol }
        }
        inStock
      }
    }
  `).then((data) => setProducts(data.products));
  }, [category]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-capitalize">{category}</h2>

      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-4 mb-4">
            <div
              className="card h-100 product-card"
              onClick={() => setSelectedProductId(p.id)}
              data-testid={`product-${p.name.toLowerCase().replaceAll(" ", "-")}`}
            >
              <div className="position-relative">
                <img src={p.gallery[0]} className="card-img-top" />

                {!p.inStock && <div className="out-of-stock">OUT OF STOCK</div>}

                {p.inStock && <div className="cart-icon">🛒</div>}
              </div>

              <div className="card-body">
                <h6 className="card-title">{p.name}</h6>
                <p className="card-text fw-bold">
                  {p.prices[0].currency.symbol}
                  {p.prices[0].amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
