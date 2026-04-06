import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

function Products({ addToCart }) {
  const { category } = useParams();
  const currentCategory = category || "all";
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchGraphQL(`
    {
      products(category: "${currentCategory}") {
        id
        name
        gallery
        inStock
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
    `).then((data) => setProducts(data?.products || []));
  }, [currentCategory]);

  const quickAdd = (product) => {
    const defaultSelected = {};

    product.attributes?.forEach((attr) => {
      defaultSelected[attr.name] = String(attr.items[0].value);
    });

    addToCart(product, defaultSelected);
  };

  return (
    <div className="container mt-5" style={{ paddingTop: "50px" }}>
      <h2 className="title text-capitalize">{currentCategory}</h2>

      <div className="row g-4">
        {products.map((p) => (
          <div key={p.id} className="col-md-4 mb-4">
            <div
              className="card h-100 product-card"
              onClick={(e) => {
                if (e.target.closest(".cart-icon")) return;
                navigate(`/product/${p.id}`);
              }}
              data-testid={`product-${p.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="position-relative">
                <img src={p.gallery[0]} className="card-img-top" />

                {!p.inStock && (
                  <div className="out-of-stock">
                    <label>OUT OF STOCK</label>
                  </div>
                )}

                {p.inStock && (
                  <button
                    className="cart-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      quickAdd(p);
                    }}
                  >
                    <svg
                      width="20"
                      height="18"
                      viewBox="0 0 20 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5613 3.70464C19.1822 3.24136 18.5924 2.95978 17.9821 2.95978H5.15889L4.75914 1.47007C4.52718 0.604071 3.72769 0 2.80069 0H0.653099C0.295301 0 0 0.281577 0 0.624528C0 0.966674 0.294459 1.24906 0.653099 1.24906H2.80069C3.11654 1.24906 3.39045 1.45041 3.47434 1.75245L6.04306 11.5388C6.27502 12.4048 7.07451 13.0089 8.00152 13.0089H16.4028C17.3289 13.0089 18.1507 12.4048 18.3612 11.5388L19.9405 5.3368C20.0877 4.77206 19.9619 4.16799 19.5613 3.7047ZM18.6566 5.05357L17.0773 11.2556C16.9934 11.5576 16.7195 11.759 16.4036 11.759H8.00154C7.68569 11.759 7.41178 11.5576 7.32789 11.2556L5.49611 4.22861H17.983C18.1936 4.22861 18.4042 4.32929 18.5308 4.49054C18.6567 4.651 18.7192 4.85236 18.6567 5.05371Z"
                        fill="white"
                      />
                      <path
                        d="M8.44437 13.8125C7.2443 13.8125 6.25488 14.7587 6.25488 15.9062C6.25488 17.0537 7.24439 17.9999 8.44437 17.9999C9.64445 18.0007 10.6339 17.0544 10.6339 15.9068C10.6339 14.7591 9.64436 13.8123 8.44437 13.8123ZM8.44437 16.7321C7.9599 16.7321 7.58071 16.3695 7.58071 15.9062C7.58071 15.443 7.9599 15.0804 8.44437 15.0804C8.92885 15.0804 9.30804 15.443 9.30804 15.9062C9.30722 16.3499 8.90748 16.7321 8.44437 16.7321Z"
                        fill="white"
                      />
                      <path
                        d="M15.6875 13.8125C14.4875 13.8125 13.498 14.7587 13.498 15.9062C13.498 17.0537 14.4876 17.9999 15.6875 17.9999C16.8875 17.9999 17.877 17.0537 17.877 15.9062C17.8565 14.7594 16.8875 13.8125 15.6875 13.8125ZM15.6875 16.7322C15.2031 16.7322 14.8239 16.3696 14.8239 15.9063C14.8239 15.443 15.2031 15.0804 15.6875 15.0804C16.172 15.0804 16.5512 15.443 16.5512 15.9063C16.5512 16.3499 16.1506 16.7322 15.6875 16.7322Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                )}
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

export default Products;
