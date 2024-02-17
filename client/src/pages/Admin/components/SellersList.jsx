import React, { useState, useEffect } from 'react';
import "../styles/adminLists.css"
import { AdminSidebar } from "./AdminSidebar";
import axios from 'axios';

export const SellersList = ({ sellers }) => {
    const [sellerList, setSellerList] = useState([]);

    useEffect(() => {
        setSellerList(sellers);
    }, [sellers]);

    const fetchSellers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/sellers');
            setSellerList(response.data);
        } catch (error) {
            console.error('Error fetching sellers:', error);
        }
    };

    const handleApprove = async (sellerId) => {
        try {
            await axios.put(`http://localhost:5000/api/sellers/${sellerId}/approve`);
            const updatedSellers = sellerList.map(seller => {
                if (seller._id === sellerId) {
                    return { ...seller, approved: true };
                } else {
                    return seller;
                }
            });
            setSellerList(updatedSellers);
            window.alert('Seller approved successfully!');
        } catch (error) {
            console.error('Error approving seller:', error)
            window.alert('Error approving seller. Please try again.');
        }
    };

    const handleRevoke = async (sellerId) => {
        try {
            await axios.put(`http://localhost:5000/api/sellers/${sellerId}/revoke`);
            const updatedSellers = sellerList.map(seller => {
                if (seller._id === sellerId) {
                    return { ...seller, isSeller: false };
                } else {
                    return seller;
                }
            });
            setSellerList(updatedSellers);
            window.alert('Seller approval revoked successfully!');
        } catch (error) {
            console.error('Error revoking seller approval:', error);
            window.alert('Error revoking seller approval. Please try again.');
        }
    };

    if (!sellerList || sellerList.length === 0) {
        return (
            <div>
                <AdminSidebar />
                <section className="orders-section">
                    <div className="orders-content">
                        <h2 className="orders-heading">Sellers List:</h2>
                        <p className="no-data">No Sellers found.</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div>
            <AdminSidebar activeLink="sellerslist" />
            <section className="orders-section">
                <div className="orders-content">
                    <h2 className="orders-heading">Sellers List:</h2>
                    <br />
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th><b>Seller Name</b></th>
                                <th><b>Email</b></th>
                                <th><b>Company</b></th>
                                <th><b>Address</b></th>
                                <th><b>Status</b></th>
                                <th><b>Action</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            { sellerList.map((seller) => (
                                <tr key={ seller._id } className="orders-row">
                                    <td>{ seller.username }</td>
                                    <td>{ seller.email }</td>
                                    <td>{ seller.companyName }</td>
                                    <td>{ seller.address }</td>
                                    <td style={ { backgroundColor: seller.approved ? 'lightgreen' : 'yellow' } }>
                                        { seller.approved ? 'Approved' : 'Not Approved' }
                                    </td>
                                    <td>
                                        { seller.approved ? (
                                            <button className="revoke-button" onClick={ () => handleRevoke(seller._id) }>Revoke</button>
                                        ) : (
                                            <button className="approve-button" onClick={ () => handleApprove(seller._id) }>Approve</button>
                                        ) }
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default SellersList;
