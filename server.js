require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

app.get('/health', (_req, res) => res.status(200).json({ status: true, message: 'OK' }));
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.use((_req, res) => {
  res.status(404).json({ status: false, message: 'Route not found' });
});

// Malformed JSON bodies come from express.json() and should be 400, not 500
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ status: false, message: 'Malformed JSON body' });
  }
  res.status(500).json({ status: false, message: 'Internal server error' });
});

// The MongoDB container may still be starting when the API boots, so retry
const connectWithRetry = async (retries = 10, delayMs = 3000) => {
  for (let attempt = 1; ; attempt++) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      if (attempt >= retries) throw err;
      console.log(`MongoDB connection attempt ${attempt} failed, retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

const start = async () => {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not set');
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');

  await connectWithRetry();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
