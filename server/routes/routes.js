const express = require('express');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const ContactUs = require('../models/ContactUs');
const Category = require('../models/Category');
const Review = require('../models/Review'); 
const Seller = require('../models/Seller');

const { uploadToCloudinary, removeFromCloudinary } = require('../routes/cloudinary');

const multer = require('multer');
const storage = multer.diskStorage({})
const upload = multer({ storage: storage });

const router = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = 'jwt_secret_key';

router.post('/api/seller/addproduct', upload.fields([
    { name: 'imagePath', maxCount: 1 },
    { name: 'imagethumbnail1', maxCount: 1 },
    { name: 'imagethumbnail2', maxCount: 1 },
    { name: 'imagethumbnail3', maxCount: 1 }
]), async (req, res) => {
    console.log(req.body);
    const files = req.files;
    // console.log(files);
    try {
        // Upload each image to Cloudinary and get the URLs
        const cloudinaryResponses = await Promise.all([
            uploadToCloudinary(files['imagePath'][0].path, req.body.productCode),
            uploadToCloudinary(files['imagethumbnail1'][0].path, req.body.productCode),
            uploadToCloudinary(files['imagethumbnail2'][0].path, req.body.productCode),
            uploadToCloudinary(files['imagethumbnail3'][0].path, req.body.productCode)
        ]);

        // Destructure the responses to get the URLs
        const [imagePathResponse, thumbnail1Response, thumbnail2Response, thumbnail3Response] = cloudinaryResponses;

        // Create a new Product instance with the uploaded image URLs
        const newProduct = new Product({
            productCode: req.body.productCode,
            title: req.body.title,
            imagePath: imagePathResponse.url,
            imagethumbnail1: thumbnail1Response.url,
            imagethumbnail2: thumbnail2Response.url,
            imagethumbnail3: thumbnail3Response.url,
            description: req.body.description,
            features1: req.body.features1,
            features2: req.body.features2,
            features3: req.body.features3,
            features4: req.body.features4,
            mrp: req.body.mrp,
            price: req.body.price,
            reviewed: req.body.reviewed,
            sold: req.body.sold,
            stock: req.body.stock,
            brand: req.body.brand,
            manufacturer: req.body.manufacturer,
            available: req.body.available,
            category: req.body.category,
        });

        // Save the new product to the database
        await newProduct.save();
        res.status(201).send('Image uploaded successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = user;
        next();
    });
};

router.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const encryptPassword = (password) => {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        };

        const hashedPassword = encryptPassword(password);

        let userRoles = { isUser: false, isSeller: false, isAdmin: false };
        userRoles.isUser = true;

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            ...userRoles
        });

        await newUser.save();
        const token = jwt.sign({ email: newUser.email, userId: newUser._id }, JWT_SECRET_KEY);
        res.status(201).json({ message: 'User created successfully', token });
        console.log("Successfully created");
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({
            email: user.email,
            userId: user._id,
            isUser: user.isUser,
            isSeller: user.isSeller,
            isAdmin: user.isAdmin
        }, JWT_SECRET_KEY);

        res.status(200).json({
            message: 'login successful',
            token, user,
            isUser: user.isUser,
            isSeller: user.isSeller,
            isAdmin: user.isAdmin
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Products' });
    }
});

router.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ product });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Product' });
    }
});

router.post('/api/carts/addToCart', async (req, res) => {
    const { productId, userId } = req.body;
    console.log(req.body);

    try {
        let userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
            userCart = new Cart({ user: userId, items: [], totalQty: 0, totalCost: 0 });
        }
        const existingProductIndex = userCart.items.findIndex(item => item.productId.toString() === productId.toString());
        if (existingProductIndex !== -1) {
            userCart.items[existingProductIndex].qty += 1;
        } else {
            const productDetails = await Product.findById(productId);
            if (!productDetails) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const product = {
                productId,
                qty: 1,
                price: productDetails.price,
                title: productDetails.title,
                imagePath: productDetails.imagePath,
                productCode: productDetails.productCode
            };
            userCart.items.push(product);
        }
        userCart.totalQty = userCart.items.reduce((total, item) => total + item.qty, 0);
        userCart.totalCost = userCart.items.reduce((totalCost, item) => {
            return totalCost + (item.price * item.qty);
        }, 0);
        await userCart.save();

        res.status(200).json({ message: 'Product added to cart successfully', cartId: userCart._id });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/api/wishlists/:wishlistId/removeProduct/:productId', async (req, res) => {
    const { wishlistId, productId } = req.params;

    try {
        let userWishlist = await Wishlist.findById(wishlistId);
        if (!userWishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        const productIndex = userWishlist.items.findIndex(item => item._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in wishlist' });
        }

        userWishlist.items.splice(productIndex, 1);
        userWishlist.totalQty -= 1;

        if (userWishlist.items.length === 0) {
            await Wishlist.findByIdAndDelete(wishlistId);
            return res.status(200).json({ message: 'Wishlist deleted as no products are left' });
        }

        await userWishlist.save();
        res.status(200).json({ message: 'Product removed from wishlist successfully' });
    } catch (error) {
        console.error('Error removing product from wishlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/api/carts/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json({ cartItems: userCart.items });
    } catch (error) {
        console.error('Error fetching user cart items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/api/checkout', async (req, res) => {
    try {
        const { totalQty, totalCost, items, user } = req.body;
        // console.log(items);
        const checkout = new Checkout({
            totalQty,
            totalCost,
            items,
            user
        });
        await checkout.save();
        for (const item of items) {
            await Product.updateOne(
                { _id: item.productId },
                { $inc: { sold: item.qty } }
            );
        }
        res.status(201).json({ message: 'Checkout successful', checkout });
        await Cart.deleteMany({ user: user });
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/checkouts/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const userCheckouts = await Checkout.find({ user: userId });
        // console.log(userCheckouts);
        if (!userCheckouts || userCheckouts.length === 0) {
            return res.status(404).json({ error: 'Checkouts not found' });
        }
        const checkoutItems = userCheckouts.flatMap(checkout => checkout.items);
        res.status(200).json({ checkoutItems });
    } catch (error) {
        console.error('Error fetching user checkout items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/checkouts', async (req, res) => {
    try {
        const checkouts = await Checkout.find({});
        if (!checkouts || checkouts.length === 0) {
            return res.status(404).json({ error: 'Checkouts not found' });
        }
        res.status(200).json({ checkouts: checkouts });
    } catch (error) {
        console.error('Error fetching checkout items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/wishlists/:userId', async (req, res) => {
    const userId = req.params.userId;
    // console.log(userId);
    try {
        const wishlists = await Wishlist.find({ user: userId });
        if (wishlists) {
            res.json({ wishlists });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishlists' });
    }
});

router.post('/api/wishlists/create/:id', async (req, res) => {
    const wishlistName = req.body.name;
    const userId = req.params.id;

    try {
        const newWishlist = new Wishlist({ name: wishlistName, user: userId });
        await newWishlist.save();

        const user = await User.findById(userId);
        user.wishlists.push(newWishlist);
        await user.save();

        res.status(200).json({ message: 'Wishlist created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create wishlist' });
    }
});

router.post('/api/wishlists/addProduct/:wishlistId', async (req, res) => {
    const wishlistId = req.params.wishlistId;
    const productId = req.body.productId;
    try {
        const wishlist = await Wishlist.findById(wishlistId);
        if (!wishlist) {
            // alert("Wishlist not found or Select an Existing wishlist");
            return res.status(404).json({ error: 'Wishlist not found' });
        }
        const existingProduct = wishlist.items.find(item => item.productId.toString() === productId);

        if (existingProduct) {
            // alert("Product already in wishlist");
            return res.status(400).json({ error: 'Product already exists in the wishlist' });
        }
        wishlist.items.push({
            productId: productId,
            imagePath: req.body.imagePath,
            price: req.body.price,
            productCode: req.body.productcode,
            title: req.body.title,
        });
        wishlist.totalQty = wishlist.items.length;
        await wishlist.save();

        // alert("Product added to wishlist successfully");
        res.status(200).json({ message: 'Product added to wishlist successfully', wishlist });
    } catch (error) {
        console.error('Error adding product to wishlist:', error);
        res.status(500).json({ error: 'Failed to add product to wishlist' });
    }
});

router.post('/api/editprofile/:id', async (req, res) => {
    const user_id = req.params.id;
    // console.log(req.body);

    try {
        const updatedUser = await User.findById(user_id);
        // console.log(updatedUser);

        if (!updatedUser) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        updatedUser.mobileNumber = req.body.mobileNumber;
        updatedUser.gender = req.body.gender;
        updatedUser.dob = req.body.dob.toString();
        updatedUser.location = req.body.location;

        console.log(updatedUser.mobileNumber);

        await updatedUser.save();

        // console.log('Updated User:', updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal server error');
    }
});

// used authenticateToken middleware
router.get('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/api/contactus', (req, res) => {
    const { name, subject, phone, email, message } = req.body;
    const newContactUs = new ContactUs({
        name,
        subject,
        phone,
        email,
        message,
    });

    newContactUs.save()
        .then(() => res.status(200).send('Message sent to Admin!'))
        .catch((error) => res.status(500).send(`Error: ${error}`));
});


const Razorpay = require("razorpay");
const crypto = require("crypto");

router.post("/api/payment/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: "rzp_test_Gj1HHlsQFVyVat",
            key_secret: "CPbCpVzcBIiDUgf3QKknEDcn",
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
});

router.post("/api/payment/verify", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
});

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




router.post('/api/sellerregister', async (req, res) => {
    try {
        const { username, email, password, companyName, address } = req.body;
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newSeller = new Seller({
            username,
            email,
            password: hashedPassword,
            companyName,
            address
        });
        await newSeller.save();
        newSeller.isSeller = true;
        await newSeller.save();

        res.status(201).json({ message: 'Seller registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/api/sellerlogin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        const passwordMatch = await bcrypt.compare(password, seller.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ sellerId: seller._id }, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ seller, message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/api/sellers', async (req, res) => {
    try {
        const sellers = await Seller.find({});
        res.json({ sellers });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sellers' });
    }
});

router.get('/api/sellers/:id', async (req, res) => {
    try {
        const sellerId = req.params.id;
        const seller = await Seller.findById(sellerId);
        res.status(200).json(seller);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/api/sellers/:id/approve', async (req, res) => {
    const { id } = req.params;
    try {
        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        seller.approved = true;
        await seller.save();
        return res.status(200).json({ message: 'Seller approved successfully', seller });
    } catch (error) {
        console.error('Error approving seller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/api/sellers/:id/revoke', async (req, res) => {
    const { id } = req.params;
    try {
        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        seller.approved = false;
        await seller.save();
        return res.status(200).json({ message: 'Seller approval revoked successfully', seller });
    } catch (error) {
        console.error('Error revoking seller approval:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({});
        res.json({ reviews });
        // console.log(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

router.post('/api/reviews', async (req, res) => {
    const { productId, userId, rating, reviewText } = req.body;
    console.log(req.body.username);
    try {
        const newReview = new Review({
            user: userId,
            product: productId,
            username: req.body.username,
            rating,
            reviewText
        });
        await newReview.save();
        await Product.findByIdAndUpdate(productId, { $push: { reviews: newReview._id } });

        res.status(201).json({ message: 'Review submitted successfully', review: newReview });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;