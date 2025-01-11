const express = require('express');
const router = express.Router();
const CryptoData = require('../models/CryptoData');

router.get('/deviation', async (req, res) => {
    const { coin } = req.query;

    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
        return res.status(400).json({ error: 'Invalid coin. Choose from bitcoin, matic-network, or ethereum.' });
    }

    try {
        const records = await CryptoData.find({ coin })
            .sort({ timestamp: -1 })
            .limit(100)
            .select('price');

        if (records.length === 0) {
            return res.status(404).json({ error: 'No sufficient data found for this coin.' });
        }

        const prices = records.map(record => record.price);
        const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
        const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
        const deviation = Math.sqrt(variance);

        res.json({ deviation });
    } catch (error) {
        console.error('Error calculating deviation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;