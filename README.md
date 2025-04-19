# E-Commerce Platform with Rider Delivery System

## Project Overview

This is a full-stack e-commerce application with integrated rider delivery functionality. The platform consists of three main components:

1. **User-facing Storefront**: Where customers can browse products, add items to cart, and place orders
2. **Admin Panel**: For managing products, orders, and riders
3. **Rider PWA (Progressive Web App)**: For delivery personnel to manage and update order statuses

## Tech Stack

### Frontend
- **React**: UI library for building the client-side application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Firebase Authentication**: For user and rider authentication
- **Axios**: For making HTTP requests to the backend API
- **React Router**: For client-side routing
- **Context API**: For state management
- **React Icons/Heroicons**: For professional UI icons throughout the application

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web framework for building the API
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB

## Project Structure

The project is organized into two main directories:

### Client (Frontend)
```
client/
├── public/            # Public assets
├── src/
│   ├── components/    # React components
│   │   ├── Admin/     # Admin panel components
│   │   ├── Rider/     # Rider app components
│   │   └── User/      # User-facing components
│   ├── context/       # React context providers
│   ├── services/      # API services
│   ├── Firebase.js    # Firebase configuration
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Entry point
└── .env               # Environment variables
```

### Server (Backend)
```
server/
├── models/           # Mongoose models
├── routes/           # API routes
│   ├── orderRoutes.js # Order-related endpoints
│   ├── productRoutes.js # Product-related endpoints
│   └── riderRoutes.js # Rider-related endpoints
├── middleware/       # Express middleware
├── server.js         # Entry point
└── .env              # Environment variables
```

## Features

### User Features
- Browse products by category
- Add products to cart
- Place orders with delivery information
- View order history and status
- User authentication

### Admin Features
- View and manage orders
- Update order status
- Assign riders to orders
- Manage riders (view)

### Rider Features
- Google sign-in authentication
- View assigned orders
- Update order status (Delivered/Undelivered)
- Add delivery notes

## Environment Variables

### Client (.env)
```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_DATABASE_URL=your-database-url

# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
```

### Server (.env)
```
# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string

# Server Configuration
PORT=8080

# JWT Secret (if using JWT)
JWT_SECRET=your-jwt-secret
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Firebase account (for authentication)

### Client Setup
1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the client directory with the required environment variables (see above)

4. Start the development server:
   ```
   npm run dev
   ```

### Server Setup
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the required environment variables (see above)

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get a specific order
- `GET /api/orders/user/:userId` - Get orders for a specific user
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order status (admin only)

### Riders
- `GET /api/riders` - Get all riders (admin only)
- `GET /api/riders/:id` - Get a specific rider
- `GET /api/riders/auth/:uid` - Get rider by Firebase UID
- `POST /api/riders/register` - Register a new rider
- `GET /api/riders/:riderId/orders` - Get orders assigned to a rider
- `PUT /api/riders/orders/:orderId/status` - Update order status by rider

## Authentication

The application uses Firebase Authentication for both users and riders:

- **Users**: Email/password authentication
- **Riders**: Google sign-in authentication

## Deployment

### Client
- The client can be built for production using:
  ```
  cd client
  npm run build
  ```
- The built files will be in the `dist` directory and can be deployed to any static hosting service (Netlify, Vercel, Firebase Hosting, etc.)

### Server
- The server can be deployed to any Node.js hosting service (Heroku, DigitalOcean, AWS, etc.)
- Make sure to set the environment variables on your hosting platform

## UI Enhancements

To make the user interface more professional, consider adding the following icon libraries:

- **Heroicons**: Clean, minimal SVG icons that work well with Tailwind CSS
- **React Icons**: Includes popular icon sets like Font Awesome, Material Design, and more
- **Material Icons**: Google's Material Design icons for a consistent look and feel
- **Phosphor Icons**: Flexible icon family with a consistent style
- **Feather Icons**: Simple, elegant open source icons

Recommended icon usage:

- **User Interface**: Navigation, buttons, and interactive elements
- **Product Categories**: Distinct icons for different product types
- **Order Status**: Visual indicators for different order statuses (pending, shipped, delivered)
- **Rider Dashboard**: Delivery, location, and status update icons
- **Admin Panel**: Management and analytics icons

## Future Enhancements

- Payment gateway integration
- Real-time order tracking
- Push notifications for order updates
- Rider location tracking
- Customer reviews and ratings
- Advanced search and filtering

## Troubleshooting

### Common Issues

1. **Order Placement Fails**:
   - Ensure all required customer information fields are filled out
   - Check server logs for detailed error messages

2. **Order Status Update Fails**:
   - Verify rider authentication is working correctly
   - Ensure the rider is properly assigned to the order
   - Check for proper handling of MongoDB ObjectId comparisons

3. **Firebase Authentication Issues**:
   - Verify Firebase configuration in the client `.env` file
   - Ensure Firebase services are enabled in the Firebase console

## License

MIT
