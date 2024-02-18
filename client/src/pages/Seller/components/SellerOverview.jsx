import "../styles/seller.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cards from "./Cards";
import SalesCard from "./SalesCard";
import RevenueCard from "./RevenueCards";
import "../styles/Cards.css";


export const SellerOverview = () => {
    return (
        <div className="cards-container">
            <SalesCard/>
            <Cards/>
            <RevenueCard/>
        </div>
    );
}