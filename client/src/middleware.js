const isAdmin = (req, res, next) => {
    const user = req.session.user;
    if (user && user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access forbidden. Admins only.' });
    }
};

const isSeller = (req, res, next) => {
    const user = req.session.user;
    if (user && user.isSeller) {
        next();
    } else {
        res.status(403).json({ message: 'Access forbidden. Sellers only.' });
    }
};

const isUser = (req, res, next) => {
    const user = req.session.user;
    if (user && user.isUser) {
        next();
    } else {
        res.status(403).json({ message: 'Access forbidden. Users only.' });
    }
};

module.exports = { isAdmin, isSeller, isUser };
