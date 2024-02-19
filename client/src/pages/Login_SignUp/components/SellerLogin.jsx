import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Seller.css';

export const SellerLogin = ({setLoginSeller}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const [approvalStatus, setApprovalStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/sellerlogin', formData);  
            const seller = response.data.seller;
            setLoginSeller(seller);
            localStorage.setItem('loggedInSeller', JSON.stringify(seller));
            setApprovalStatus(seller.approved);
            if (seller.approved) {
                navigate('/seller');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };
    useEffect(() => {
        if (approvalStatus === true) {
            navigate('/seller');
        }
    }, [approvalStatus, navigate]);


    return (
        <div className="container1">
            {approvalStatus === false ? (
                <>
                    <p>You are not yet approved by the admin.</p>
                    <p>Return to <Link to="/">Home</Link></p>
                </>
            ) : (
                <>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Email:
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </label><br />
                        <label>Password:
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </label><br />
                        <button type="submit">Login</button>
                    </form>
                    <p>Don't have an account? <Link to="/SellerRegister">Register</Link></p>
                </>
            )}
        </div>
    );
}

export default SellerLogin;
