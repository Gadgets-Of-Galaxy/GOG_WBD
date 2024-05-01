const express = require('express');
const moment = require('moment');
const router = express();

const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const ContactUs = require('../models/ContactUs');

router.get('/sales/:period', async (req, res) => {
    try {
        const { period } = req.params;

        const endDate = moment();
        let startDate;

        switch (period) {
            case 'day':
                startDate = moment().subtract(1, 'days');
                break;
            case 'week':
                startDate = moment().subtract(1, 'weeks');
                break;
            case 'month':
                startDate = moment().subtract(1, 'months');
                break;
            case 'year':
                startDate = moment().subtract(1, 'years');
                break;
            default:
                return res.status(400).json({ error: 'Invalid time period' });
        }

        const salesData = await Checkout.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate.toDate(),
                        $lt: endDate.toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    totalSales: { $sum: '$totalCost' },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        const labels = salesData.map((item) => item._id);
        const data = salesData.map((item) => item.totalSales);

        res.json({ labels, data });
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/orders', async (req, res) => {
    try {
        const checkouts = await Checkout.find();
        res.status(200).json(checkouts);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/messages', async (req, res) => {
    try {
        const messages = await ContactUs.find({});
        // console.log(messages);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/contactUs/:id', async (req, res) => {
    const messageId = req.params.id;
    try {
        const deletedMessage = await ContactUs.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/deleUser/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ user: 'User not found' });
        }
        res.status(200).json({ user: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting User:', error);
        res.status(500).json({ user: 'Internal server error' });
    }
});

module.exports = router;