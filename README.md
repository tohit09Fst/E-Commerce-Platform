# E-Commerce Platform

A full-stack e-commerce platform built with React (Vite) and Node.js, featuring Firebase integration and MongoDB database.

## Project Structure

```
├── client/          # Frontend React application
└── server/          # Backend Node.js server
```

## Client Setup

### Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url

# API Configuration
VITE_API_BASE_URL=your_api_url
```

### Installation

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

## Server Setup

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=8080  # Default port for the server
```

### Installation

```bash
cd server
npm install
```

### Development

```bash
npm start
```

## API Endpoints

- `/api/products` - Product management
- `/api/orders` - Order management

## Features

- Firebase Authentication
- Real-time Database
- MongoDB Integration
- RESTful API
- Product Management
- Order Processing

## Security Notes

- Never commit `.env` files to version control
- Keep your Firebase and MongoDB credentials secure
- Use environment variables for all sensitive information

## Deployment

### Client
- Build the client: `npm run build`
- Deploy to your preferred hosting service (e.g., Firebase Hosting, Vercel)

### Server
- Deploy to your preferred hosting service (e.g., Render, Heroku)
- Ensure environment variables are properly configured in your hosting platform

## License

MIT
