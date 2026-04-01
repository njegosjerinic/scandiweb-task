export default function Header({ category, setCategory, setShowCart }) {
  const categories = ["tech", "clothes"];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
      }}
    >
      <div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            data-testid={
              category === cat ? "active-category-link" : "category-link"
            }
            style={{
              marginRight: "10px",
              fontWeight: category === cat ? "bold" : "normal",
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div
        onClick={() => setShowCart((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        🛒
      </div>
    </div>
  );
}
