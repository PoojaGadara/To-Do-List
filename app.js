const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoute');
const userRoute = require('./routes/userRoute')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/user' , userRoute)


//Database Connection
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: false
      });
      console.log('MongoDB connected!!');
      const port = process.env.PORT || 8080;
      const server = app.listen(port, () => {
        console.log(`NEW App running on port ${port}...`);
      });
    } catch (err) {
      console.log('Failed to connect to MongoDB', err);
    }
  };
  
  try {
    connectDB();
  } catch (err) {
    console.log('Failed to connect to MongoDB 2', err);
    try {
      connectDB();
    } catch (err) {
      console.log('Failed to connect to MongoDB 3', err);
      process.exit(0);
    }
  }