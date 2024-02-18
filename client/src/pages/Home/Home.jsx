import { useEffect, useState } from "react";
import { Header } from "../CommonComponents/components/Header";
import { Slider } from "./components/Slider";
import { HomeBestDeals } from "./components/HomeBestDeals";
import { BestSellingProducts } from "./components/BestSellingProducts";
import { Footer } from "../CommonComponents/components/Footer";
import axios from "axios";
import { Brands } from "./components/Brands";

export const Home = () => {
  const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const [user, setUser] = useState(storedUser || null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/' + user._id);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        if (user) {
            fetchUser();
        }
    }, [user]);
    
  const [products, setProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        if (response.status === 200) {
          setProducts(response.data.products);
          // console.log("products: ", response.data.products);
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
    const fetchpProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        if (response.status === 200) {
          const sortedProducts = response.data.products.sort((a, b) => b.sold - a.sold);
          setBestSellingProducts(sortedProducts);
        } else {
          console.error("Failed to fetch products.");
        }
      } catch (error) {
        console.error("Error while fetching products:", error);
      }
    };

    fetchpProducts();
  }, []);

  return (
    <div>
      <Slider />
      <Brands />
      <HomeBestDeals products={products} user={user}/>
      <BestSellingProducts products={bestSellingProducts} user={user} />
      <Footer />
    </div>
  );
};
