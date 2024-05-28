const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const db = require('./models');
const seedDatabase = require('./seeders/seedDatabase');

const userRoutes = require('./routes/userRoutes');
const slotRoutes = require('./routes/slotRoutes');
const callRoutes = require('./routes/callRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rate limit for requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
});
app.use(limiter);

// Routes for users, slots, and calls
app.use('/users', userRoutes);
app.use('/slots', slotRoutes);
app.use('/calls', callRoutes);

// 404 Error handler
app.use((req, res) => {
  res.status(404).send('This is not the page you\'re looking for...')
});

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Sync database models, seed database, and start server
db.sequelize.sync({ alter: true }).then(() => {
  console.log('All models were synchronized successfully.');
  seedDatabase().then(() => {
    app.listen(4000, () => {
      console.log(`Server is running on port 4000`);
    });
  });
});