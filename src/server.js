const app = require('./app');
const config = require('./config');
const connectDB = require('./config/database');

// Connect to database
connectDB();

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});