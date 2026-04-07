import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Products from "./pages/Products";
import Header from "./components/Header";
import Product from "./pages/Product";

function App() {
  const [cart, setCart] = useState([]);
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
  };

  return (
    <BrowserRouter>
      <Header
        cart={cart}
        setCart={setCart}
        showCart={showCart}
        setShowCart={setShowCart}
      />

      <Routes>
        <Route path="/" element={<Products addToCart={addToCartGlobal} />} />

        <Route
          path="/:category"
          element={<Products addToCart={addToCartGlobal} />}
        />

        <Route
          path="/:category/:id"
          element={<Product addToCart={addToCartGlobal} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
