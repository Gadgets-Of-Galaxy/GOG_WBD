const express = require('express');
const router = express();

const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const ContactUs = require('../models/ContactUs');

router.get('/api/admin/orders', async (req, res) => {
    try {
        const checkouts = await Checkout.find();
        res.status(200).json(checkouts);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/admin/messages', async (req, res) => {
    try {
        const messages = await ContactUs.find({});
        // console.log(messages);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/api/admin/contactUs/:id', async (req, res) => {
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

module.exports = router;