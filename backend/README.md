# MEAN Backend

This backend is a production-ready Express API that integrates:

- MongoDB via Mongoose for `Product` and `Order` data
- MySQL via Sequelize for `User` authentication
- JWT authentication for protected API routes
- MVC-style controllers and route structure

## Setup

1. Copy `.env.example` to `.env` and configure database credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend:
   ```bash
   npm run dev
   ```

## Required environment variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/atdrive_mean_db
MYSQL_DB=atdrive_auth_db
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_HOST=localhost
MYSQL_PORT=3306
JWT_SECRET=your_jwt_secret_key
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products
- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Orders (JWT protected)
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id`
- `DELETE /api/orders/:id`

## Example API Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SecurePass123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SecurePass123"}'
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999.99,"description":"High performance"}'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"productIds":["<PRODUCT_ID>"]}'
```
