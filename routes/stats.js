const express = require('express');
const router = express.Router();
const CryptoData = require('../models/CryptoData');

router.get('/stats', async (req, res) => {
    const { coin } = req.query;

    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
        return res.status(400).json({ error: 'Invalid coin. Choose from bitcoin, matic-network, or ethereum.' });
    }

    try {
        // Latest data
        const latestData = await CryptoData.findOne({ coin })
            .sort({ timestamp: -1 })
            .limit(1);

        if (!latestData) {
            return res.status(404).json({ error: 'No data found for this coin.' });
        }

        res.json({
            price: latestData.price,
            marketCap: latestData.marketCap,
            change24h: latestData.change24h
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
