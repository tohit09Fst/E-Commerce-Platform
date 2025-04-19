const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const riderRoutes = require('./routes/riderRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.get('/test', (req, res) => res.send('Server is working')); // Test route
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/riders', riderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));