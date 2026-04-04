import { useState } from "react";
import Products from "./pages/Products";
import PDP from "./pages/PDP";
import Cart from "./components/Cart";
import Header from "./components/Header";

function App() {
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [category, setCategory] = useState("");
  const [showCart, setShowCart] = useState(false);

  const getCartKey = (id, selected) => {
    return (
      id +
      "-" +
      Object.entries(selected)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join("|")
    );
  };

  const addToCartGlobal = (product, selected) => {
    const newKey = getCartKey(product.id, selected);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => getCartKey(item.id, item.selected) === newKey,
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          prices: product.prices,
          gallery: product.gallery,
          selected: { ...selected },
          attributes: product.attributes || [],
          quantity: 1,
        },
      ];
    });

    setShowCart(true);
  };

  return (
    <div>
      {showCart && (
        <>
          <div
            onClick={() => setShowCart(false)}
            style={{
              position: "fixed",
              top: "68px",
              left: 0,
              width: "100%",
              height: "calc(100% - 68px)",
              background: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: "68px",
              right: "300px",
              width: "350px",
              background: "white",
              padding: "20px",
              zIndex: 1000,
            }}
          >
            <Cart cart={cart} setCart={setCart} />
          </div>
        </>
      )}
      <Header
        category={category}
        setCategory={setCategory}
        setShowCart={setShowCart}
        setSelectedProductId={setSelectedProductId}
        cart={cart}
      />
      {selectedProductId ? (
        <PDP id={selectedProductId} addToCart={addToCartGlobal} />
      ) : (
        <Products
          setSelectedProductId={setSelectedProductId}
          category={category}
          addToCart={addToCartGlobal}
        />
      )}
    </div>
  );
}

export default App;
