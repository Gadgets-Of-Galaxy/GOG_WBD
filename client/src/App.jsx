import { useState, useEffect } from 'react'
// import {useLocation} from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import { Login } from './pages/Login_SignUp/components/Login'
import { Home } from './pages/Home/Home';
import { MyAccount } from './pages/Home/components/MyAccount';
import { AdminDashboard } from './pages/Admin/components/AdminDashboard';
import { AddProduct } from './pages/Admin/components/AddProduct';
import { AdminMessages } from './pages/Admin/components/AdminMessages';
import { Products } from './pages/Admin/components/Products';
import { Users } from './pages/Admin/components/Users';
import { OrdersList } from './pages/Admin/components/OrdersList';
import { Category } from './pages/Home/components/Category';
import {EditProfile } from './pages/Home/components/EditProfile';
import { MyWishlists } from './pages/Home/components/MyWishlists';
import {MyCart} from './pages/Home/components/MyCart';
import {MyOrders} from './pages/Home/components/MyOrders';
import {CheckoutPage} from './pages/Home/components/CheckoutPage';
import {Aboutus} from './pages/Home/components/Aboutus';
import {Contactus} from './pages/Home/components/Contactus';

import messagesData from '../DumpDatabase/contactus.json';
import productsData from '../DumpDatabase/products.json';
import usersData from '../DumpDatabase/users.json';
// import wishlists from '../DumpDatabase/wishlists.json';
// import cartsData from '../DumpDatabase/carts.json';
import ordersData from '../DumpDatabase/checkouts.json';
import { Login } from './pages/Login_SignUp/components/Login';
import ProductDetailsPage from './pages/Home/components/ProductDetailsPage';
import Categorydata from '../DumpDatabase/categories.json'

import { SellerDashboard } from './pages/Seller/components/SellerDashboard';

import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [orders, setOrders] = useState(null);
  const [messages, setMessages] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [loginuser, setLoginUser] = useState(storedUser || null);

  const isUser = loginuser?.isUser || false;
  const isAdmin = loginuser?.isAdmin || false;
  const isSeller = loginuser?.isSeller || false;

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
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching admin messages:', error);
      }
    };
    fetchMessages();
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


  return (
    <Router>
    <div>
      <Routes>
        <Route path="/" element={<Home loginuser={user}/>} />
        <Route path="/login" element={<Login setLoginUser={setLoginUser} />} />
        <Route path="/product/:productId" element={<ProductDetailsPage user={loginuser} />} />
        <Route
            path="/myAccount"
            element={loginuser ? <MyAccount user={loginuser} /> : <Navigate to="/login" />}
          />
        <Route path="/editProfile" element={<EditProfile user={loginuser}/>} />
        <Route path='/wishlist' element={loginuser ? <MyWishlists user={loginuser}/> : <Navigate to="/login" />} />
        <Route path='/cart' element={loginuser ? <MyCart user={loginuser}/> : <Navigate to="/login" />} />
        <Route path='/myOrders' element={loginuser ? <MyOrders user={loginuser}/> : <Navigate to="/login" />} />
        <Route path="/category" element={<Category categories={Categorydata} user={loginuser} products={productsData}/>} />
        <Route path='/checkout' element={loginuser ? <CheckoutPage user={loginuser}/> : <Navigate to="/login" />}/>
        <Route path='/Aboutus' element={<Aboutus user={loginuser}/>} />
        <Route path='/Contactus' element={<Contactus user={loginuser}/>} />

        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/admin/productDetails' element={<Products products={productsData} />}/>
        <Route path='/admin/userDetails' element={<Users users={users} />} />
        <Route path='/admin/ordersList' element={<OrdersList orders={orders} />} />
        <Route path='/admin/addProduct' element={<AddProduct />} />
        <Route path='/admin/messages' element={<AdminMessages messages={messages} />} />

        {/* {isAdmin && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
          {isAdmin && (
            <Route path="/admin/productDetails" element={<Products products={productsData} />} />
          )}
          {isAdmin && (
            <Route path="/admin/userDetails" element={<Users users={users} />} />
          )}
          {isAdmin && (
            <Route path="/admin/ordersList" element={<OrdersList orders={orders} />} />
          )}
          {isAdmin && (
            <Route path="/admin/addProduct" element={<AddProduct />} />
          )}
          {isAdmin && (
            <Route path="/admin/messages" element={<AdminMessages messages={messages} />} />
          )} */}


        <Route path='/seller' element={<SellerDashboard />} />
      </Routes>
      </div>
    </Router>
  )
}

export default App
