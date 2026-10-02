# Q7 - Shopping Cart (MERN) with Admin site and User site

**Stack:** MongoDB + Express + React + Node. Login with JWT.

### 2 level categories
`Category` has a `parent` field. `parent = null` means main category (Electronics), otherwise it's a
sub category (Mobiles under Electronics). Products belong to a sub category.

### Admin site (login as admin)
- Categories: add main / sub category, rename, delete
- Products: add / edit / delete with image upload (multer), choose sub category
- Orders: see all orders placed by users

### User site
- Register / Login
- Shop: category tree on the left (click main or sub category to filter), Add to Cart
- Cart: + / - quantity, remove, total, Checkout (creates an order and empties cart)
- My Orders

Admin account is created automatically on first run: **admin@shop.com / admin123**

## Setup
Backend:
```
cd backend
copy .env.example .env     (cp on linux/mac)
npm install
npm start                   -> http://localhost:5000
```
`.env`: `MONGO_URI=mongodb://127.0.0.1:27017/shopdb`, `JWT_SECRET=any_secret`, `PORT=5000`

Frontend (new terminal):
```
cd frontend
npm install
npm run dev                 -> http://localhost:3000
```
First login as admin, add categories (e.g. Electronics > Mobiles, Laptops; Clothing > Men, Women) and
some products, then register a normal user and shop.
