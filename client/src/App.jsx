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
      <Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } />
        <Routes>
          {/* <Route
            path={ ["/", "/login", "/product/:productId", "/cart", "/myOrders", "/category"] }
            element={ <Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } /> }
          /> */}
          <Route path="/" element={ <Home loginuser={ user } /> } />
          <Route path="/login" element={ <Login setLoginUser={ setLoginUser } /> } />
          <Route path="/product/:productId" element={ <ProductDetailsPage user={ loginuser } /> } />
          <Route
            path="/myAccount"
            element={ loginuser ? <MyAccount user={ loginuser } /> : <Navigate to="/login" /> }
          />
          <Route path="/editProfile" element={ <EditProfile user={ loginuser } /> } />
          <Route path='/wishlist' element={ loginuser ? <MyWishlists user={ loginuser } /> : <Navigate to="/login" /> } />
          <Route path='/cart' element={ loginuser ? <MyCart user={ loginuser } /> : <Navigate to="/login" /> } />
          <Route path='/myOrders' element={ loginuser ? <MyOrders user={ loginuser } /> : <Navigate to="/login" /> } />
          <Route path="/category" element={ <Category categories={ categories } user={ loginuser } products={ products } sortedProducts={ sortedProducts } /> } />
          <Route path='/checkout' element={ loginuser ? <CheckoutPage user={ loginuser } /> : <Navigate to="/login" /> } />
          <Route path='/Aboutus' element={ <Aboutus user={ loginuser } /> } />
          <Route path='/Contactus' element={ <Contactus user={ loginuser } /> } />

          <Route path='/admin' element={ <AdminDashboard /> } />
          <Route path='/admin/productDetails' element={ <Products products={ products } /> } />
          <Route path='/admin/userDetails' element={ <Users users={ users } /> } />
          <Route path='/admin/sellerDetails' element={ <SellersList users={ users } /> } />
          <Route path='/admin/ordersList' element={ <OrdersList orders={ orders } /> } />
          <Route path='/admin/addProduct' element={ <AddProduct /> } />
          <Route path='/admin/messages' element={ <AdminMessages messages={ messages } /> } />
          <Route path='/admin/sellersList' element={ <SellersList sellers={ sellers } /> } />

          <Route path="/sellerLogin" element={ <SellerLogin /> } />
          <Route path="/sellerRegister" element={ <SellerRegister /> } />
          <Route path='/seller' element={ <SellerDashboard /> } />
          <Route path='/seller/addproduct' element={ <SellerAddProduct /> } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
