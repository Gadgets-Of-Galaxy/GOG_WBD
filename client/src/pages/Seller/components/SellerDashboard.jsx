import "../styles/seller.css";
import { SellerSidebar } from "./SellerSidebar";
import { SellerOverview } from "./SellerOverview";
import { CustomerReview } from "./CustomerReview";
import { useState, useEffect } from "react";
import axios from "axios";

export const SellerDashboard = () => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/checkouts");
        const data = await response.data.checkouts;
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const latestOrders = sortedOrders.slice(0, 3);
        const ordersWithUserDetails = await Promise.all(
          latestOrders.map(async (order) => {
            const userResponse = await axios.get(
              `http://localhost:5000/api/users/${order.user}`
            );
            const userData = userResponse.data;
            return {
              ...order,
              user: userData.name,
            };
          })
        );

        setRecentSales(ordersWithUserDetails);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);
  console.log(recentSales);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console(isSidebarOpen);
  };
  return (
    <div>
      <SellerSidebar
        activeLink="sellerDashboard"
        toggleSidebar={toggleSidebar}
        achieve={isSidebarOpen}
      />
      <section className="seller-section">
        <div className="sidebar-button">
          <span className="dashboard">Dashboard</span>
        </div>
        <div className="home-content">
          <SellerOverview />
        </div>
        <div className="seller-dashboard-bottom">
          <div className="sellers-orders-content">
            <h2 className="orders-heading">Recent Sales</h2>
            <table className="sellers-orders-table">
              <thead className="seller-thead">
                <tr>
                  <th>
                    <b>Customer</b>
                  </th>
                  <th width="40%">
                    <b>Item</b>
                  </th>
                  <th>
                    <b>Quantity</b>
                  </th>
                  <th>
                    <b>Price</b>
                  </th>
                  <th>
                    <b>Order Placed</b>
                  </th>
                </tr>
              </thead>
              <tbody className="seller-tbody">
                {recentSales.map((order) =>
                  order.items.map((item) => (
                    <tr key={item._id} className="orders-row">
                      <td>{order.user}</td>
                      <td width="40%">{item.title}</td>
                      <td>{item.qty}</td>
                      <td>{item.price}</td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="customer-reviews">
            <CustomerReview/>
          </div>
        </div>
      </section>
    </div>
  );
};
