import React ,{useState, useEffect} from "react";
import { SellerSidebar } from "./SellerSidebar";
import axios from "axios";

export const SellerProducts = () => {

    const [productData, setProductData] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/products");
                if (response.status === 200) {
                    setProductData(response.data.products);
                } else {
                    console.error("Failed to fetch products.");
                }
            } catch (error) {
                console.error("Error while fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    console.log(productData)

    return (
        <div>
            <SellerSidebar activeLink="productslist"/>
            <section className="orders-section">
                <div className="orders-content">
                    <h2 className="orders-heading">Product Details:</h2>
                    <br />
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th><b>Product Image</b></th>
                                <th><b>Product Code</b></th>
                                <th><b>Product Name</b></th>
                                <th><b>Brand</b></th>
                                <th><b>Sold</b></th>
                                <th><b>Available</b></th>
                                <th><b>MRP</b></th>
                                <th><b>Current Price</b></th>
                                <th><b>Action</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            { productData.map((product) => (
                                <tr key={ product._id } className="orders-row">
                                    <td>
                                        <img src={ `/${product.imagePath}` } alt="Product" className="product-image" />
                                    </td>
                                    <td>{ product.productCode }</td>
                                    <td>Mobiles</td>
                                    <td>{ product.brand }</td>
                                    <td>{ product.sold }</td>
                                    <td>{ product.stock }</td>
                                    <td>{ product.mrp }</td>
                                    <td>{ product.price }</td>
                                    <td>
                                        <a>
                                            <button className="delete-button" type="submit">Delete</button>
                                        </a>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>

                </div>
            </section>
        </div>
    );
}