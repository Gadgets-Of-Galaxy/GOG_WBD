const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs')
const path = require('path')
const errorHandler = require('./middlewares/errorMiddleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors');
app.use(session({
    secret: 'GOG_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(express.static('public'));
app.use(cookieParser());
// app.use(morgan('common'));
// app.use(morgan(':method :url :status :response-time ms'));

morgan.token('user', (req) => {
    if (req.user) { return req.user.email; }
    return 'no user info';
});

function jsonFormat(tokens, req, res) {
    return JSON.stringify({
        ip: tokens['remote-addr'](req, res),
        user: tokens.user(req, res),
        time: tokens.date(req, res, 'iso'),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        'http-version': tokens['http-version'](req, res),
        'status-code': tokens.status(req, res),
        'content-length': tokens.res(req, res, 'content-length'),
        // referrer: tokens.referrer(req, res),
        // 'user-agent': tokens['user-agent'](req, res),
        'response-time': tokens['response-time'](req, res) + ' ms',
        params: res.req.params,
        body: res.req.body,
        query: res.req.query
    });
}
const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' });
// app.use(morgan(jsonFormat, { stream: accessLogStream }));

const mongoURL = 'mongodb+srv://hemanth0921:mongodbpassword@nodetut.ej60wid.mongodb.net/GOG';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// Routes
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');
const paymentRoutes = require('./routes/payment');
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/payment', paymentRoutes);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "gadgetsofgalaxy123@gmail.com",
        pass: "hyymkyjuiycfsueu"
    }
});

app.post('/sendemail', async (req, res) => {
    console.log(req.body.to);

    const mailOptions = {
        from: "gadgetsofgalaxy123@gmail.com",
        to: req.body.to,
        subject: "Reply to your query",
        text: req.body.text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending email' });
        } else {
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});


var csrf = require('csurf');
const csrfProtection = csrf({
    httpOnly: true,
    cookie: true,
    expiresIn: 30 * 60 * 1000
});
app.get('/api/getCSRFToken',csrfProtection, (req, res) => {
    try {
        console.log(req.csrfToken());
        res.json({ CSRFToken: req.csrfToken() });

    } catch (error) {
        console.error("Error in getCSRFToken:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/', (req, res) => {
    res.send('<h1>GOG Backend is Running...</h1>');
});

// Error Middleware
app.use(errorHandler);

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
