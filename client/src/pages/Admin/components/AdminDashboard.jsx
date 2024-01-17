import "../styles/admin.css";
import { AdminSidebar } from "./AdminSidebar";
import { AdminOverview } from "./AdminOverview";
import { useState, useEffect } from 'react';
import axios from 'axios';

export const AdminDashboard = () => {
    const [productData, setProductData] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/products");
                if (response.status === 200) {
                    setProductData(response.data.products);
                } else {
                    console.error("Failed to fetch products.");
                }
            } catch (error) {
                console.error("Error while fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const sortedProducts = productData.sort((a, b) => b.sold - a.sold);
        setTopSellingProducts(sortedProducts.slice(0, 7));
    });

    const [recentSales, setRecentSales] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/checkouts')
                const data = await response.data.checkouts;
                const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const latestOrders = sortedOrders.slice(0, 5);
                const ordersWithUserDetails = await Promise.all(
                    latestOrders.map(async order => {
                        const userResponse = await axios.get(`http://localhost:5000/api/users/${order.user}`);
                        const userData = userResponse.data;
                        return {
                            ...order,
                            user: userData.name
                        };
                    })
                );

                setRecentSales(ordersWithUserDetails);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            <AdminSidebar activeLink="adminDashboard" />
            <section className="home-section">
                <nav>
                    <div className="sidebar-button">
                        <i className='bx bx-menu sidebarBtn'></i>
                        <span className="dashboard">Dashboard</span>
                    </div>
                    <div className="search-box">
                        <input type="text" placeholder="Search..." />
                        <i className='bx bx-search'></i>
                    </div>
                </nav>

                <div className="home-content">
                    <AdminOverview />
                    <div className="sales-boxes">
                        <div className="recent-sales box">
                            <div className="title">Recent Sales</div>
                                { recentSales.map(order => (
                                    <ul key={ order._id } className="top-sales-details">
                                        <li className="">Date: { formatDate(order.createdAt) }</li>
                                        <li className="">Customer: { order.user }</li>
                                        <li className="">Total: Rs.{ order.totalCost }</li>
                                    </ul>
                                )) }
                            <div className="button">
                                <a href="/admin/ordersList">See All</a>
                            </div>
                        </div>

                        <div className="top-sales box">
                            <div className="title">Top Selling Products</div>
                            <ul className="top-sales-details">
                                { topSellingProducts.map(product => (
                                    <li key={ product.productCode }>
                                        <p>{ product.title }</p>
                                        <p>Sold: { product.sold }</p>
                                    </li>
                                )) }
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}