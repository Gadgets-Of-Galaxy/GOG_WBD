import "../styles/admin.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Cards from "./Cards";
import SalesCard from "./SalesCard";
import RevenueCard from "./RevenueCards";

export const AdminOverview = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/checkouts");
        const data = await response.data.checkouts;
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);
  
  return (
    <div className="cards-container">
      <SalesCard orders = {orders}/>
      <Cards />
      <RevenueCard  orders={orders}/>
    </div>
  );
};
