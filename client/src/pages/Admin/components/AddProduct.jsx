// AddProduct.jsx

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { connect } from 'react-redux';
import { addProduct } from '../store/actions/productActions';
import '../styles/admin.css'; // Import your CSS file

export const AddProduct = ({ addProduct }) => {
    const [formData, setFormData] = useState({
        productcode: '',
        title: '',
        imagepath: '',
        imagethumbnail1: '',
        imagethumbnail2: '',
        imagethumbnail3: '',
        description: '',
        features1: '',
        features2: '',
        features3: '',
        features4: '',
        mrp: '',
        price: '',
        reviewed: '',
        sold: '',
        stock: '',
        brand: '',
        manufacturer: '',
        available: '',
        category: '',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addProduct(formData);
        // Clear form or perform other actions after submission
    };

    return (
        <div>
            <AdminSidebar activeLink="addproduct"/>
            <section className="home-section">
                <nav>
                    <div className="sidebar-button">
                        <i className='bx bx-menu sidebarBtn'></i>
                        <span className="dashboard">Add Product</span>
                    </div>
                    <div className="search-box">
                        <input type="text" placeholder="Search..." />
                        <i className='bx bx-search'></i>
                    </div>
                </nav>
                <div className="uprofilepage">
                    <h3 className="font-weight-bold">ADD PRODUCT</h3>
                    <hr />
                    <form
                        className='edit-profile-form'
                        action="/admin/addProduct"
                        method="post"
                        onSubmit={handleSubmit}
                    >
                        <div className="mb-3">
                            <label htmlFor="productcode" className="form-label">Product Code</label>
                            <input
                                placeholder="Product code"
                                type="text"
                                className="form-control"
                                id="productcode"
                                name="productcode"
                                value={formData.productcode}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                placeholder="Title"
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="imagepath" className="form-label">ImagePath</label>
                            <input
                                placeholder="Imagepath"
                                type="text"
                                className="form-control"
                                id="imagepath"
                                name="imagepath"
                                value={formData.imagepath}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="imagethumbnail1" className="form-label">Thumbnail Image 1</label>
                            <input
                                placeholder="Thumbnail Image 1"
                                type="text"
                                className="form-control"
                                id="imagethumbnail1"
                                name="imagethumbnail1"
                                value={formData.imagethumbnail1}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="imagethumbnail2" className="form-label">Thumbnail Image 2</label>
                            <input
                                placeholder="Thumbnail Image 2"
                                type="text"
                                className="form-control"
                                id="imagethumbnail2"
                                name="imagethumbnail2"
                                value={formData.imagethumbnail2}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="imagethumbnail3" className="form-label">Thumbnail Image 3</label>
                            <input
                                placeholder="Thumbnail Image 3"
                                type="text"
                                className="form-control"
                                id="imagethumbnail3"
                                name="imagethumbnail3"
                                value={formData.imagethumbnail3}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <input
                                placeholder="Description"
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="features1" className="form-label">Features 1</label>
                            <input
                                placeholder="Features 1"
                                type="text"
                                className="form-control"
                                id="features1"
                                name="features1"
                                value={formData.features1}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="features2" className="form-label">Features 2</label>
                            <input
                                placeholder="Features 2"
                                type="text"
                                className="form-control"
                                id="features2"
                                name="features2"
                                value={formData.features2}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="features3" className="form-label">Features 3</label>
                            <input
                                placeholder="Features 3"
                                type="text"
                                className="form-control"
                                id="features3"
                                name="features3"
                                value={formData.features3}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="features4" className="form-label">Features 4</label>
                            <input
                                placeholder="Features 4"
                                type="text"
                                className="form-control"
                                id="features4"
                                name="features4"
                                value={formData.features4}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mrp" className="form-label">MRP</label>
                            <input
                                placeholder="MRP"
                                type="text"
                                className="form-control"
                                id="mrp"
                                name="mrp"
                                value={formData.mrp}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Price</label>
                            <input
                                placeholder="Price"
                                type="text"
                                className="form-control"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="reviewed" className="form-label">Reviewed</label>
                            <input
                                placeholder="Reviewed"
                                type="text"
                                className="form-control"
                                id="reviewed"
                                name="reviewed"
                                value={formData.reviewed}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sold" className="form-label">Sold</label>
                            <input
                                placeholder="Sold"
                                type="text"
                                className="form-control"
                                id="sold"
                                name="sold"
                                value={formData.sold}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="stock" className="form-label">Stock</label>
                            <input
                                placeholder="Stock"
                                type="text"
                                className="form-control"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="brand" className="form-label">Brand</label>
                            <input
                                placeholder="Brand"
                                type="text"
                                className="form-control"
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="manufacturer" className="form-label">Manufacturer</label>
                            <input
                                placeholder="Manufacturer"
                                type="text"
                                className="form-control"
                                id="manufacturer"
                                name="manufacturer"
                                value={formData.manufacturer}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="available" className="form-label">Available</label>
                            <input
                                placeholder="Available"
                                type="text"
                                className="form-control"
                                id="available"
                                name="available"
                                value={formData.available}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <input
                                placeholder="Category"
                                type="text"
                                className="form-control"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="button-group d-flex flex-column mt-3" id="btn-group">
                            <input type="submit" value="Add Product" className="add-button" />
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//         addProduct: (productData) => dispatch(addProduct(productData)),
//     };
// };

// export const AddProduct = connect(null, mapDispatchToProps)(ConnectedAddProduct);


