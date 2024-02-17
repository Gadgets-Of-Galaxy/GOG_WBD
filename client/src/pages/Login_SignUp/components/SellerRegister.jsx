import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Seller.css";

export const SellerRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        companyName: '',
        address: '',
    });

    const navigate = useNavigate();

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
            const response = await axios.post('http://localhost:5000/api/sellerregister', formData);
            console.log(response.data);
            navigate('/SellerLogin');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className='container'>
            <h2>Register as a Seller</h2>
            <form onSubmit={handleSubmit}>
            <label>Username:
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </label><br />
                <label>Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label><br />
                <label>Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </label><br />
                <label>Company Name:
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
                </label><br />
                <label>Address:
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </label><br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default SellerRegister;
