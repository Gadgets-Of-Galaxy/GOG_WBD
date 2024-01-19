import "../styles/admin.css";
import { useState, useEffect } from 'react';
import axios from 'axios';


export const AdminOverview = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/checkouts')
                const data = await response.data.checkouts;
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const totalOrders = orders.reduce((total, order) => total + order.totalQty, 0);
    const totalSales = orders.reduce((total, order) => total + order.totalCost, 0);
    const totalProfit = 0.08*totalSales;

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const formattedOrderDate = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getDate().toString().padStart(2, '0')}`;
        return formattedOrderDate === formattedToday;
    });
    const todaySales = todayOrders.reduce((total, order) => total + order.totalCost, 0);

    return (
        <div>
            <div className="overview-boxes">
                        <div className="box">
                            <div className="right-side">
                                <div className="box-topic">Total Order</div>
                                <div className="number">{totalOrders.toLocaleString()}</div>
                                <div className="indicator">
                                    <i className='bx bx-up-arrow-alt'></i>
                                    <span className="text">Up from yesterday</span>
                                </div>
                            </div>
                            <i className='bx bx-cart-alt cart'></i>
                        </div>
                        <div className="box">
                            <div className="right-side">
                                <div className="box-topic">Total Sales</div>
                                <div className="number">{totalSales.toLocaleString()}</div>
                                <div className="indicator">
                                    <i className='bx bx-up-arrow-alt'></i>
                                    <span className="text">Up from yesterday</span>
                                </div>
                            </div>
                            <i className='bx bxs-cart-add cart two'></i>
                        </div>
                        <div className="box">
                            <div className="right-side">
                                <div className="box-topic">Total Profit</div>
                                <div className="number">{totalProfit.toLocaleString()}</div>
                                <div className="indicator">
                                    <i className='bx bx-up-arrow-alt'></i>
                                    <span className="text">Up from yesterday</span>
                                </div>
                            </div>
                            <i className='bx bx-cart cart three'></i>
                        </div>
                        <div className="box">
                            <div className="right-side">
                                <div className="box-topic">Today Sales</div>
                                <div className="number">{todaySales.toLocaleString()}</div>
                                <div className="indicator">
                                    <i className='bx bx-down-arrow-alt down'></i>
                                    <span className="text">Down From Today</span>
                                </div>
                            </div>
                            <i className='bx bxs-cart-download cart four'></i>
                        </div>
                    </div>
        </div>
    );
}