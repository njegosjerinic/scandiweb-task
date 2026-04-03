# Scandiweb Full-Stack Test Assignment

## Overview

This project is a simple eCommerce web application built as part of the Scandiweb Full-Stack Developer test assignment.

It includes:

- Product listing by category
- Product details page (PDP)
- Cart overlay with full functionality
- Order placement via GraphQL

---

## Tech Stack

### Frontend

- React (Vite)
- CSS (custom styling)
- GraphQL (fetch API)

### Backend

- PHP (OOP, no frameworks)
- MySQL
- GraphQL (webonyx implementation)

---

## Features

### Product Listing

- Displays products by category
- Shows product name, image, and price
- Out-of-stock products are visually indicated and cannot be added to cart
- Quick Shop button adds product with default attributes

### Product Details Page (PDP)

- Image gallery with navigation arrows
- Selectable attributes (size, color, etc.)
- Color attributes displayed as swatches
- Add to cart disabled until all attributes are selected
- Product description rendered from HTML

### Cart Overlay

- Accessible from header
- Displays selected products with attributes
- Supports quantity increase/decrease
- Removes item when quantity reaches zero
- Displays total price
- Order placement via GraphQL mutation
- Cart resets after successful order
- Background overlay blocks interaction with page content

---

## Backend Architecture

- Implemented using OOP principles
- Repository pattern used for data access
- Factory pattern used for model instantiation
- Attributes resolved via separate repository and type
- GraphQL schema includes:
  - Products
  - Categories
  - Attributes

- GraphQL mutation implemented for order creation

---

## Installation (Local Setup)

### Backend

1. Create a MySQL database
2. Import data using provided `data.json`
3. Configure database connection
4. Run PHP server:

```bash
php -S localhost:8000
```

---

### Frontend

1. Navigate to frontend directory
2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

---

## Production Build

To build frontend for production:

```bash
npm run build
```

Upload contents of `dist/` to server.

---

## Deployment

The application is deployed and accessible at:

👉 [LIVE URL HERE]

Backend GraphQL endpoint:

👉 `/api/graphql`

---

## Notes

- Cart state is managed on frontend (no persistence required)
- All required `data-testid` attributes are implemented
- Application follows provided design and functional requirements

---

## Author

NJEGOŠ
