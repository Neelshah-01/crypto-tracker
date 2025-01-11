require('dotenv').config();
require('./jobs/CryptoJob');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
const statsRoute = require('./routes/stats');
app.use('/api', statsRoute);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
