const axios = require('axios');
const CryptoData = require('../models/CryptoData');
const cron = require('node-cron');

const fetchCryptoData = async () => {
    try {
        const coins = ['bitcoin', 'matic-network', 'ethereum'];
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: coins.join(','),
                vs_currencies: 'usd',
                include_market_cap: 'true',
                include_24hr_change: 'true'
            }
        });

        const data = response.data;

        for (const coin of coins) {
            await CryptoData.create({
                coin,
                price: data[coin].usd,
                marketCap: data[coin].usd_market_cap,
                change24h: data[coin].usd_24h_change
            });
        }

        console.log('Crypto data updated');
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }
};

cron.schedule('0 */2 * * *', fetchCryptoData); // Schedule the job to run every 2 hours
// cron.schedule('* * * * *', fetchCryptoData); // Runs every minute for testing
fetchCryptoData();
module.exports = fetchCryptoData;
