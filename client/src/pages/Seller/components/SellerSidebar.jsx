import "../styles/seller.css";

export const SellerSidebar = ({ activeLink }) => {
    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
    };
    return (
        <div className="sidebar">
            <a href="/seller">
                <div className="logo-details">
                    <i className='bx bxs-home-smile'></i>
                    <span className="logo_name">GOG</span>
                </div>
            </a>
            <ul className="nav-links">
                <li>
                    <a href="/seller" className={activeLink === "sellerDashboard" ? "active" : ""}>
                        <i className='bx bx-grid-alt'></i>
                        <span className="links_name">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="/seller" className={activeLink === "productslist" ? "active" : ""}>
                        <i className='bx bx-box'></i>
                        <span className="links_name">Products</span>
                    </a>
                </li>
                <li>
                    <a href="/seller" className={activeLink === "addproduct" ? "active" : ""}>
                        <i className='bx bx-pie-chart-alt-2'></i>
                        <span className="links_name">Add Product</span>
                    </a>
                </li>
                <li>
                    <a href="/seller" className={activeLink === "userslist" ? "active" : ""}>
                        <i className='bx bx-heart'></i>
                        <span className="links_name">Users List</span>
                    </a>
                </li>
                <li>
                    <a href="/seller/ordersList" className={activeLink === "orderslist" ? "active" : ""}>
                        <i className='bx bx-list-ul'></i>
                        <span className="links_name">Orders List</span>
                    </a>
                </li>
                
                {/* <li>
                    <a href="/seller">
                        <i className='bx bx-user'></i>
                        <span className="links_name">Employees</span>
                    </a>
                </li> */}
                <li>
                    <a href="/seller/messages" className={activeLink === "messageslist" ? "active" : ""}>
                        <i className='bx bx-message'></i>
                        <span className="links_name">Messages</span>
                    </a>
                </li>
                <li className="log_out">
                    <a href="/" onClick={handleLogout}>
                        <i className='bx bx-log-out'></i>
                        <span className="links_name">Log out</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}