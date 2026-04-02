export default function Cart({ cart, setCart }) {
  const increase = (index) => {
    const updated = [...cart];
    updated[index].quantity += 1;
    setCart(updated);
  };

  const decrease = (index) => {
    const updated = [...cart];

    if (updated[index].quantity === 1) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity -= 1;
    }

    setCart(updated);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.prices[0].amount,
    0,
  );

  const placeOrder = async () => {
    await fetch("http://localhost:8000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation {
            placeOrder(input: "${JSON.stringify({
              items: cart,
              totalAmount: total,
              currencyLabel: "USD",
              currencySymbol: "$",
            }).replace(/"/g, '\\"')}")
          }
        `,
      }),
    });

    setCart([]);
  };

  return (
    <div className="cart-container">
      <h5>
        <strong>My Bag,</strong> {cart.length} items
      </h5>

      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <div className="cart-left">
            <h6>{item.name}</h6>

            <p className="price">
              {item.prices[0].currency.symbol}
              {item.prices[0].amount.toFixed(2)}
            </p>

            {item.attributes.map((attr) => (
              <div key={attr.name}>
                <small>{attr.name}:</small>

                <div className="attr-row">
                  {attr.items.map((a) => {
                    const selected = item.selected[attr.name] === a.value;

                    return (
                      <span
                        key={a.id}
                        className={`attr-box ${selected ? "active" : ""}`}
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
            <button onClick={() => increase(index)}>+</button>
            <span>{item.quantity}</span>
            <button onClick={() => decrease(index)}>-</button>
          </div>

          <div className="cart-right">
            <img src={item.gallery[0]} />
          </div>
        </div>
      ))}

      <div className="cart-total">
        <span>Total</span>
        <strong>${total.toFixed(2)}</strong>
      </div>

      <button className="order-btn" onClick={placeOrder}>
        PLACE ORDER
      </button>
    </div>
  );
}
