const express = require('express');
const cors = require('cors');
require('dotenv').config();

const meetingsRouter = require('./routes/meetings');
const availabilityRouter = require('./routes/availability');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/meetings', meetingsRouter);
app.use('/', availabilityRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});