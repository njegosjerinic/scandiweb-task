import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Cart from "./Cart";

function Header({ cart, setCart, showCart, setShowCart }) {
  const DEFAULT_CATEGORIES = [
    { name: "all" },
    { name: "clothes" },
    { name: "tech" },
  ];

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const location = useLocation();
  const currentCategory = location.pathname.split("/")[1] || "all";
  const cartRef = useRef(null);

  useEffect(() => {
    fetch("/api/index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          categories {
            name
          }
        }
      `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const cats = data?.data?.categories || [];

        if (cats.length > 0) {
          setCategories(cats);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!showCart) return;

      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setShowCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCart]);

  return (
    <div className="header container">
      <div style={{ display: "flex", gap: "30px" }}>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/${cat.name}`}
            data-testid={
              currentCategory === cat.name
                ? "active-category-link"
                : "category-link"
            }
            className={`menu-button ${currentCategory === cat.name ? "active" : ""}`}
          >
            {cat.name.toUpperCase()}
          </Link>
        ))}
      </div>

      <Link to="/" className="logo">
        <svg
          width="32"
          height="30"
          viewBox="0 0 32 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.1022 23.2525C29.1295 23.5709 28.881 23.8445 28.5647 23.8445H2.54932C2.23381 23.8445 1.98561 23.5722 2.01164 23.2544L3.87598 0.50016C3.89918 0.217508 4.13295 0 4.4138 0H26.6227C26.9027 0 27.1362 0.216418 27.1602 0.498252L29.1022 23.2525Z"
            fill="#1DCF65"
          />
          <path
            d="M31.1789 29.1893C31.2114 29.5864 30.9011 29.9268 30.5069 29.9268H0.67446C0.280981 29.9268 -0.0290002 29.588 0.00215983 29.1916L2.14384 1.93507C2.17176 1.58059 2.46434 1.30762 2.81614 1.30762H28.2759C28.6269 1.30762 28.9192 1.5795 28.948 1.93289L31.1789 29.1893Z"
            fill="url(#paint0_linear_150_362)"
          />
          <path
            d="M15.0033 21.2832C11.1203 21.2832 7.96143 17.451 7.96143 12.7407C7.96143 12.4954 8.15823 12.2964 8.40117 12.2964C8.64411 12.2964 8.84092 12.4952 8.84092 12.7407C8.84092 16.9611 11.6054 20.3946 15.0035 20.3946C18.4015 20.3946 21.166 16.9611 21.166 12.7407C21.166 12.4954 21.3628 12.2964 21.6057 12.2964C21.8487 12.2964 22.0455 12.4952 22.0455 12.7407C22.0453 17.451 18.8863 21.2832 15.0033 21.2832Z"
            fill="white"
          />
          <path
            d="M19.3382 12.6216C19.2257 12.6216 19.1132 12.5783 19.0272 12.4915C18.8555 12.318 18.8555 12.0367 19.0272 11.8632L21.3061 9.56081C21.3885 9.47755 21.5003 9.43066 21.617 9.43066C21.7337 9.43066 21.8455 9.47741 21.9279 9.56081L24.1845 11.8408C24.3563 12.0143 24.3563 12.2956 24.1845 12.4691C24.0128 12.6425 23.7344 12.6426 23.5627 12.4691L21.6169 10.5034L19.6491 12.4915C19.5632 12.5783 19.4507 12.6216 19.3382 12.6216Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_150_362"
              x1="24.9534"
              y1="25.9216"
              x2="6.59333"
              y2="4.48869"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#52D67A" />
              <stop offset="1" stop-color="#5AEE87" />
            </linearGradient>
          </defs>
        </svg>
      </Link>

      <div
        data-testid="cart-btn"
        onClick={() => setShowCart((prev) => !prev)}
        style={{ cursor: "pointer", position: "relative" }}
      >
        {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-8px",
              right: "-10px",
              background: "black",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </div>
        )}
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.5613 3.70464C19.1822 3.24136 18.5924 2.95978 17.9821 2.95978H5.15889L4.75914 1.47007C4.52718 0.604071 3.72769 0 2.80069 0H0.653099C0.295301 0 0 0.281577 0 0.624528C0 0.966674 0.294459 1.24906 0.653099 1.24906H2.80069C3.11654 1.24906 3.39045 1.45041 3.47434 1.75245L6.04306 11.5388C6.27502 12.4048 7.07451 13.0089 8.00152 13.0089H16.4028C17.3289 13.0089 18.1507 12.4048 18.3612 11.5388L19.9405 5.3368C20.0877 4.77206 19.9619 4.16799 19.5613 3.7047L19.5613 3.70464ZM18.6566 5.05357L17.0773 11.2556C16.9934 11.5576 16.7195 11.759 16.4036 11.759H8.00154C7.68569 11.759 7.41178 11.5576 7.32789 11.2556L5.49611 4.22861H17.983C18.1936 4.22861 18.4042 4.32929 18.5308 4.49054C18.6567 4.651 18.7192 4.85236 18.6567 5.05371L18.6566 5.05357Z"
            fill="#43464E"
          />
          <path
            d="M8.44437 13.8125C7.2443 13.8125 6.25488 14.7587 6.25488 15.9062C6.25488 17.0537 7.24439 17.9999 8.44437 17.9999C9.64445 18.0007 10.6339 17.0544 10.6339 15.9068C10.6339 14.7591 9.64436 13.8123 8.44437 13.8123V13.8125ZM8.44437 16.7321C7.9599 16.7321 7.58071 16.3695 7.58071 15.9062C7.58071 15.443 7.9599 15.0804 8.44437 15.0804C8.92885 15.0804 9.30804 15.443 9.30804 15.9062C9.30722 16.3499 8.90748 16.7321 8.44437 16.7321Z"
            fill="#43464E"
          />
          <path
            d="M15.6875 13.8125C14.4875 13.8125 13.498 14.7587 13.498 15.9062C13.498 17.0537 14.4876 17.9999 15.6875 17.9999C16.8875 17.9999 17.877 17.0537 17.877 15.9062C17.8565 14.7594 16.8875 13.8125 15.6875 13.8125ZM15.6875 16.7322C15.2031 16.7322 14.8239 16.3696 14.8239 15.9063C14.8239 15.443 15.2031 15.0804 15.6875 15.0804C16.172 15.0804 16.5512 15.443 16.5512 15.9063C16.5512 16.3499 16.1506 16.7322 15.6875 16.7322Z"
            fill="#43464E"
          />
        </svg>
        {showCart && (
          <>
            <div className="cart-overlay"></div>

            <div className="cart" ref={cartRef}>
              <Cart cart={cart} setCart={setCart} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
