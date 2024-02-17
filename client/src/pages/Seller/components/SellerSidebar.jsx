import "../styles/seller.css";
import {faXmark, faHome} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SellerSidebar = ({ activeLink, toggleSidebar, achieve }) => {
    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
    };

    const sidebarclose = () => {
        toggleSidebar(); 
    }
    return (
        <div className={`seller-sidebar ${achieve? 'sidebar-open' : 'sidebar-closed'}`}>
            <a href="/seller">
                <div className="logo-details">
                    <span className="logo_name">GOG</span>
                    {/* <FontAwesomeIcon className="header-right-icon" icon={ faXmark } onCLick={sidebarclose} /> */}
                </div>
            </a>
            <ul className="nav-links">
                <li>
                    <a href="/seller" className={activeLink === "sellerDashboard" ? "active" : ""}>
                        {/* <FontAwesomeIcon className="header-right-icon" icon={ faXmark } /> */}
                        <span className="links_name">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="/seller" className={activeLink === "productslist" ? "active" : ""}>
                        {/* <FontAwesomeIcon className="header-right-icon" icon={ faXmark } /> */}
                        <span className="links_name">Products</span>
                    </a>
                </li>
                <li>
                    <a href="/seller/addproduct" className={activeLink === "addproduct" ? "active" : ""}>
                        {/* <FontAwesomeIcon className="header-right-icon" icon={ faXmark } /> */}
                        <span className="links_name">Add Product</span>
                    </a>
                </li>
                <li>
                    <a href="/seller" className={activeLink === "userslist" ? "active" : ""}>
                        {/* <FontAwesomeIcon className="header-right-icon" icon={ faXmark } /> */}
                        <span className="links_name">Users List</span>
                    </a>
                </li>
                <li>
                    <a href="/seller/ordersList" className={activeLink === "orderslist" ? "active" : ""}>
                        {/* <FontAwesomeIcon className="header-right-icon" icon={ faXmark } /> */}
                        <span className="links_name">Orders List</span>
                    </a>
                </li>
                <li className="log_out">
                    <a href="/" onClick={handleLogout}>
                        <FontAwesomeIcon className="header-right-icon" icon={ faXmark } />
                        <span className="links_name">Log out</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}