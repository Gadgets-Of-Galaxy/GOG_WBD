import { useState, useEffect } from 'react'
// import {useLocation} from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import { Login } from './pages/Login_SignUp/components/Login'
import { Home } from './pages/Home/Home';
import { MyAccount } from './pages/Home/components/MyAccount';
import { AdminDashboard } from './pages/Admin/components/AdminDashboard';
import { AdminMessages } from './pages/Admin/components/AdminMessages';
import { Products } from './pages/Admin/components/Products';
import { Users } from './pages/Admin/components/Users';
import { OrdersList } from './pages/Admin/components/OrdersList';
import { Category } from './pages/Home/components/Category';
import { EditProfile } from './pages/Home/components/EditProfile';
import { MyWishlists } from './pages/Home/components/MyWishlists';
import { MyCart } from './pages/Home/components/MyCart';
import { MyOrders } from './pages/Home/components/MyOrders';
import { CheckoutPage } from './pages/Home/components/CheckoutPage';
import { Aboutus } from './pages/Home/components/Aboutus';
import { Contactus } from './pages/Home/components/Contactus';
import { Login } from './pages/Login_SignUp/components/Login';
import { SellerLogin } from './pages/Login_SignUp/components/SellerLogin';
import ProductDetailsPage from './pages/Home/components/ProductDetailsPage';

import { SellerDashboard } from './pages/Seller/components/SellerDashboard';
import { SellerAddProduct } from './pages/Seller/components/SellerAddProduct';
import { Header } from './pages/CommonComponents/components/Header';

import axios from "axios";
import { SellersList } from './pages/Admin/components/SellersList';
import SellerRegister from './pages/Login_SignUp/components/SellerRegister';
import { SellerProducts } from './pages/Seller/components/SellerProducts';

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(null);
  const [users, setUsers] = useState(null);
  const [sellers, setSellers] = useState(null);
  const [categories, setCategories] = useState(null);
  const [orders, setOrders] = useState(null);
  const [messages, setMessages] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [loginuser, setLoginUser] = useState(storedUser || null);
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setLoginUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/' + loginuser._id);
        setUser(response.data);
        // console.log(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (loginuser) {
      fetchUser();
    }
  }, [loginuser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/orders/');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching Orders:', error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/messages/');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching admin messages:', error);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sellers/');
        setSellers(response.data.sellers);
      } catch (error) {
        console.error('Error fetching Sellers:', error);
      }
    };
    fetchSellers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (loginuser) {
          const response = await axios.get(`http://localhost:5000/api/users/${loginuser._id}`);
          setLoginUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const [sortedProducts, setSortedProducts] = useState([]);

  const handleSearchedProducts = (searchedData) => {
    setSortedProducts(searchedData);
  };


  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={ <><Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } /><Home loginuser={ user } /></> } />
          <Route path="/login" element={ <Login setLoginUser={ setLoginUser } /> } />
          <Route path="/product/:productId" element={ <><Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } /><ProductDetailsPage user={ loginuser } /></> } />
          <Route path="/category" element={ <><Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } /><Category categories={ categories } user={ loginuser } products={ products } sortedProducts={ sortedProducts } /></> } />
          <Route path='/Aboutus' element={ <Aboutus user={ loginuser } /> } />
          <Route path='/Contactus' element={ <Contactus user={ loginuser } /> } />
          <Route path="/myAccount" element={ loginuser?.isUser? <MyAccount /> : <Navigate to="/login" /> } />

          <Route path="/editProfile" element={ loginuser?.isUser? <EditProfile user={ loginuser } /> : <Navigate to="/login" /> } />
          <Route path='/wishlist' element={ loginuser?.isUser?  <MyWishlists user={ loginuser } /> : <Navigate to="/login" /> } />
          <Route path='/cart' element={ loginuser?.isUser?  <><Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } /><MyCart user={ loginuser } /></> : <Navigate to="/login" /> } />
          <Route path='/myOrders' element={ loginuser?.isUser?  <><Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } /><MyOrders user={ loginuser } /></> : <Navigate to="/login" /> } />
          <Route path='/checkout' element={ loginuser?.isUser?  <CheckoutPage user={ loginuser } /> : <Navigate to="/login" /> } />

          <Route path='/admin' element={ loginuser?.isAdmin ? <AdminDashboard /> : <Navigate to="/login" /> } />
          <Route path='/admin/productDetails' element={ loginuser?.isAdmin ? <Products products={ products } /> : <Navigate to="/login" /> } />
          <Route path='/admin/userDetails' element={ loginuser?.isAdmin ? <Users users={ users }/> : <Navigate to="/login" /> } />
          <Route path='/admin/ordersList' element={ loginuser?.isAdmin ? <OrdersList orders={ orders } /> : <Navigate to="/login" /> } />
          <Route path='/admin/messages' element={ loginuser?.isAdmin ? <AdminMessages messages={ messages } /> : <Navigate to="/login" /> } />
          <Route path='/admin/sellersList' element={ loginuser?.isAdmin ? <SellersList sellers={ sellers } /> : <Navigate to="/login" /> } />

          <Route path="/sellerLogin" element={ <SellerLogin /> } />
          <Route path="/sellerRegister" element={ <SellerRegister /> } />
          <Route path='/seller' element={ <SellerDashboard /> } />
          <Route path='/seller/addproduct' element={ <SellerAddProduct /> } />
          <Route path="/seller/products" element={ <SellerProducts/> } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
