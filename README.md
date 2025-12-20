# GV Natural Frontend

Modern e-commerce frontend for GV Natural organic products with complete admin panel.

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create environment file:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

Or manually create `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note:** Backend runs on port 8000 by default. Update the URL if your backend is on a different port.

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/              # User login
│   │   ├── verify-otp/         # OTP verification
│   │   ├── products/           # Products listing & detail
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout page
│   │   ├── orders/             # User orders
│   │   ├── profile/            # User profile
│   │   └── admin/              # Admin panel
│   ├── modules/                # Feature modules
│   │   ├── auth/               # Authentication module
│   │   ├── products/           # Products module
│   │   ├── cart/               # Cart module
│   │   ├── checkout/           # Checkout module
│   │   ├── orders/             # Orders module
│   │   ├── profile/            # Profile module
│   │   └── admin/              # Admin module
│   ├── components/             # Shared components
│   │   ├── ui/                 # UI components (Button, Input, Card)
│   │   └── layout/             # Layout components
│   ├── lib/                    # Utilities & API
│   │   ├── api/                # API clients
│   │   └── utils/              # Helper functions
│   ├── store/                  # Zustand stores
│   └── types/                  # TypeScript types
```

## Features

### User Features
- ✅ OTP-based authentication (phone number)
- ✅ Product listing with search
- ✅ Product detail page
- ✅ Shopping cart
- ✅ Checkout with address form
- ✅ Order history
- ✅ Order tracking
- ✅ User profile

### Admin Features
- ✅ Admin login (email/password)
- ✅ Dashboard with statistics
- ✅ Products management (CRUD)
- ✅ Orders management
- ✅ Users management
- ✅ Analytics & reports
- ✅ Settings

### General Features
- ✅ Dark/Light mode
- ✅ Responsive design
- ✅ Module-based architecture
- ✅ All components under 200 lines
- ✅ TypeScript strict mode
- ✅ Error handling
- ✅ Loading states

## API Endpoints Used

### User Endpoints
- `POST /auth/send-otp` - Send OTP
- `POST /auth/verify-otp` - Verify OTP and login
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /orders` - Create order
- `GET /orders/my` - Get user orders
- `GET /orders/:id` - Get order by ID

### Admin Endpoints
- `POST /admin/login` - Admin login
- `GET /admin/products` - Get all products (admin)
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product
- `GET /admin/orders` - Get all orders
- `GET /admin/orders/:id` - Get order by ID
- `PATCH /admin/orders/:id/status` - Update order status
- `GET /admin/users` - Get all users
- `PATCH /admin/users/:id/status` - Update user status

## Development

### Build for production
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

## Notes

- All components are kept under 200 lines
- Module-based structure for better organization
- Uses getLayout pattern for layouts
- Zustand for state management
- React Query for server state
- Framer Motion for animations
- Tailwind CSS for styling

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

### Quick Setup

If `.env.local` is missing, create it with:
```bash
cd /home/ninja/gv/frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```
