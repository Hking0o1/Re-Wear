const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Your routes
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);
