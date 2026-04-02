import { useState } from "react";
import Products from "./pages/Products";
import PDP from "./pages/PDP";
import Cart from "./components/Cart";
import Header from "./components/Header";

function App() {
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [category, setCategory] = useState("clothes");
  const [showCart, setShowCart] = useState(false);

  return (
    <div>
      {showCart && (
        <>
          <div
            onClick={() => setShowCart(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
            }}
          />

          <div
            style={{
              position: "fixed",
              top: "80px",
              right: "20px",
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
      />
      {selectedProductId ? (
        <PDP id={selectedProductId} cart={cart} setCart={setCart} />
      ) : (
        <Products
          setSelectedProductId={setSelectedProductId}
          category={category}
        />
      )}
    </div>
  );
}

export default App;
