export default function Cart({ cart, setCart }) {
  const increase = (index) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity += 1;
      return updated;
    });
  };

  const decrease = (index) => {
    setCart((prev) => {
      const updated = [...prev];

      if (updated[index].quantity === 1) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity -= 1;
      }

      return updated;
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.prices[0].amount,
    0,
  );

  const currency = cart[0]?.prices[0]?.currency.symbol || "$";

  const placeOrder = async () => {
    await fetch("/api/index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation ($input: String!) {
          placeOrder(input: $input)
        }
      `,
        variables: {
          input: JSON.stringify({
            items: cart,
            totalAmount: total,
            currencyLabel: "USD",
            currencySymbol: "$",
          }),
        },
      }),
    });

    setCart([]);
  };

  return (
    <div className="cart-container" data-testid="cart-overlay">
      <h5>
        <strong>My Bag,</strong>{" "}
        {cart.length === 1 ? "1 Item" : `${cart.length} Items`}
      </h5>

      {cart.map((item, index) => (
        <div
          key={item.id + JSON.stringify(item.selected)}
          className="cart-item"
          data-testid="cart-item"
        >
          <div className="cart-left">
            <h6>{item.name}</h6>

            <p className="price">
              {item.prices[0].currency.symbol}
              {item.prices[0].amount.toFixed(2)}
            </p>

            {item.attributes.map((attr) => (
              <div
                key={attr.name}
                data-testid={`cart-item-attribute-${attr.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <small>{attr.name}:</small>

                <div className="attr-row">
                  {attr.items.map((a) => {
                    const selected = item.selected[attr.name] === a.value;

                    return (
                      <span
                        key={a.id}
                        className={`attr-box ${selected ? "active" : ""}`}
                        data-testid={`cart-item-attribute-${attr.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}-${a.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")}${selected ? "-selected" : ""}`}
                      >
                        {a.displayValue}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-middle">
            <button
              data-testid="cart-item-amount-increase"
              onClick={() => increase(index)}
            >
              +
            </button>

            <span data-testid="cart-item-amount">{item.quantity}</span>

            <button
              data-testid="cart-item-amount-decrease"
              onClick={() => decrease(index)}
            >
              -
            </button>
          </div>

          <div className="cart-right">
            <img src={item.gallery[0]} alt="" />
          </div>
        </div>
      ))}

      <div className="cart-total">
        <span>Total</span>
        <strong data-testid="cart-total">
          {currency}
          {total.toFixed(2)}
        </strong>
      </div>

      <button
        className="order-btn"
        onClick={placeOrder}
        disabled={cart.length === 0}
      >
        PLACE ORDER
      </button>
    </div>
  );
}
