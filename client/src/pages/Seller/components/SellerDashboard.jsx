import "../styles/seller.css";
import { SellerSidebar } from "./SellerSidebar";
import { SellerOverview } from "./SellerOverview";
import { useState, useEffect } from 'react';
import axios from 'axios';

export const SellerDashboard = () => {
    return (
        <div>
            <SellerSidebar activeLink="sellerDashboard" />
            <section className="home-section">
                <nav>
                    <div className="sidebar-button">
                        <i className='bx bx-menu sidebarBtn'></i>
                        <span className="dashboard">Seller Dashboard</span>
                    </div>
                    <div className="search-box">
                        <input type="text" placeholder="Search..." />
                        <i className='bx bx-search'></i>
                    </div>
                </nav>

                <div className="home-content">
                    <SellerOverview />
                </div>
            </section>
        </div>
    );
}