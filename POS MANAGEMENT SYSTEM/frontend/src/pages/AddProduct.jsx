import React, { useState, useEffect, useContext, useRef } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar component
import '../styles/AddProduct.css'; // Import CSS for styling
import axios from 'axios'; // Make sure to install axios if you haven't already
import { UserContext } from './UserContext'; // Import UserContext
import ToastNotification from './ToastNotification'; // Toast notification
import {QRCodeSVG} from 'qrcode.react';
import html2canvas from 'html2canvas'; // Import html2canvas
import fetchCategories from '../fetching/fetchCategories'; // Import the function
import fetchProducts from '../fetching/fetchProducts'; // Import the function
import handleSubmitProduct from '../actions/productActions/handleSubmitProduct';
import handleDelete from '../actions/productActions/deleteProduct';



const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productUnit, setProductUnit] = useState(''); // Single state for product unit
    const [fkCategory, setFkCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Search query for customers
    const [products, setProducts] = useState([]); // State for products
    const { user } = useContext(UserContext); // Get user data from context
    const [showToast, setShowToast] = useState(false); // State for showing toast
    const [toastMessage, setToastMessage] = useState(''); // Toast message
    const [showQRCode, setShowQRCode] = useState(false); // State to show/hide QR code
    const [selectedProduct, setSelectedProduct] = useState(null); // State to store selected product
    const qrCodeRef = useRef(null); // Create a reference for the QR code SVG
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [productDetails, setProductDetails] = useState(null); // State to hold category details
    
    const [editProduct, setEditProduct] = useState({
        SKU: '',
        productName: '',
        productPrice: '',
        productQuantity: '',
        productUnit: '',
        fkCategory: '',
    });
    


   
//fetching categories
useEffect(() => {
    const fetchData = async () => {
        const data = await fetchCategories(); // Call the fetching function
        setCategories(data); // Set the fetched categories
        setSortedCategories(data); // Set the sorted categories (you can add sorting logic here)
    };

    fetchData();
}, []); // Empty dependency array to fetch only once when the component mounts


//fetching products
useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await fetchProducts(); // Call the fetching function
            setProducts(data); // Set the fetched products
        } catch (error) {
            console.error(error); // Log any errors for debugging
            setToastMessage(error.message); // Set user-friendly error message
            setShowToast(true); // Show the toast message
            setTimeout(() => setShowToast(false), 3000); // Hide the toast after 3 seconds
        }
    };

    fetchData();
}, []); // Empty dependency array to fetch only once when the component mounts

// Inside your component function
const submitProduct = (e) => {
    handleSubmitProduct({
        productName,
        productPrice,
        productQuantity,
        productUnit,
        fkCategory,
        user,
        setProducts,
        setToastMessage,
        setShowToast,
        setProductName,
        setProductPrice,
        setProductQuantity,
        setProductUnit,
        setFkCategory
    });
};

//delete product
const deleteProduct = (sku) => {
    handleDelete(sku, setToastMessage, setShowToast, setProducts);
};


    const handleShowQRCode = (product) => {
        setSelectedProduct(product); // Set the selected product for QR code
        setShowQRCode(true); // Show QR code
    };
   
    const handleDownload = async () => {
        if (qrCodeRef.current) {
            try {
                const canvas = await html2canvas(qrCodeRef.current, {
                    backgroundColor: null, // Optional: set to null for transparency
                });
                const imgData = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `${selectedProduct.productName}-qrcode.png`;
                link.download = `${selectedProduct.SKU}-qrcode.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                  // Show the toast notification
            setToastMessage("Download complete");
            setShowToast(true);
            
            } catch (error) {
                console.error("Error generating QR code PNG:", error);
            }
        } else {
            console.error("QR Code reference is null.");
        }
    };

    
     // Edit product button click
     const handleEditClick = (product) => {
        setEditProduct(product); // Set the product to be edited
        setShowEditModal(true); // Show the edit modal
    };
        
  // Save edited product
const saveEditedProduct = async () => {
    // Ask for confirmation before saving changes
    const isConfirmed = window.confirm("Are you sure you want to save the changes?");

    if (!isConfirmed) {
        // If the user clicks "Cancel", simply return and do not update
        return; 
    }

    try {

        const currentDate = new Date().toISOString();
        // Calculate the new quantity based on the updated quantity input
        const newQuantity = parseInt(editProduct.productQuantity) + (parseInt(editProduct.updatedQuantity) || 0);
        const updatedProduct = {
            ...editProduct,
            productQuantity: newQuantity,  // Set the new quantity
            updatedQuantity: '',  // Reset the updated quantity input field
            fkuserID: user.userID,
            updatedBy: `${user.firstName} ${user.lastName}`, // Dynamically set updatedBy
            updatedRole: user.role, // Dynamically set updatedRole
            updatedDate: currentDate, // Add the updatedDate field
        };

        // Now update the product in the database with all details
        await axios.put(`http://localhost:5000/api/products/${editProduct.SKU}`, updatedProduct);

        // Update the product in the product list
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.SKU === editProduct.SKU ? updatedProduct : product
            )
        );

        setShowEditModal(false); // Close the modal
        setToastMessage('Product updated successfully');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
        setToastMessage('Error updating product');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }
};


    // Filtered products based on the search query
    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        product.SKU.toLowerCase().startsWith(searchQuery.toLowerCase())
    );


     // Toggle modal visibility
     const toggleModal = () => {
        setShowModal(!showModal);
    };

   
    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true // Ensures 12-hour format with AM/PM
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };
   
    const handleShowDetails = (product) => {
        const cashierID = product.fkuserID;
        const addedBy = product.addedBy || 'none'; // Access properties from the specific product object
        const role = product.role || 'none';
        const dateAdded = formatDate(product.dateAdded);

        const updatedBy = product.updatedBy || 'none'; // Access properties from the specific product object
        const roleUpdated = product.updatedRole || 'none'; 
        const dateUpdated = product.updatedDate ? formatDate(product.updatedDate) : 'none'; // Convert dateUpdated to a readable format or show 'none'
    
        alert(`Cashier ID: ${cashierID}\nAdded By: ${addedBy}\nRole: ${role}\nDate Added: ${dateAdded}\n\nUpdated By: ${updatedBy}\nRole: ${roleUpdated}\nDate Updated: ${dateUpdated}`);
    };

    

    

    

    return (
        <div className="addproduct-container">
            <Sidebar /> {/* Include Sidebar here */}
            <div className="addproduct-main-content">
            <h2 className="categories-dash">
                <img src="/product-icon.png" alt="Order Icon" className="categories-icon" />
                Products
                </h2>

            {/* Modal for Adding Product */}
{showModal && (
    <div className="modal product-modal">
        <div className="modal-content">
            <h2>Add Product</h2>
                {/* Product Name and Price */}
                <div className="modal-field">
                    <label htmlFor="productName">Product Name</label>
                    <input
                        type="text"
                        id="productName"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <div className="modal-field">
                    <label htmlFor="productPrice">Price</label>
                    <input
                        type="text"
                        id="productPrice"
                        placeholder="₱ Price"
                        value={`₱ ${productPrice}`}
                        onChange={(e) => setProductPrice(e.target.value.replace(/₱\s?/, '').replace(/[^0-9.]/g, ''))}
                        required
                    />
                </div>

                {/* Quantity and Unit */}
<div className="modal-field">
    <label htmlFor="productQuantity">Quantity</label>
    <input
        type="text" // Use text to better control input validation
        id="productQuantity"
        placeholder="Quantity"
        value={productQuantity}
        onChange={(e) => {
            // Allow only positive real numbers
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
                setProductQuantity(value);
            }
        }}
        required
    />
</div>


                 {/* Category */}
                 <div className="modal-field">
                    <label htmlFor="fkCategory">Category</label>
                    <select
                        id="fkCategory"
                        value={fkCategory}
                        onChange={(e) => setFkCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.idCategory} value={category.idCategory}>
                                {category.nameCategory}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="modal-field">
                    <label htmlFor="productUnit">Unit</label>
                    <input
                        type="text"
                        id="productUnit"
                        value={productUnit}
                        onChange={(e) => setProductUnit(e.target.value)}
                        placeholder="Enter product unit"
                        required
                    />
                </div>


                {/* Buttons */}
                <div className="modal-buttons">
                    <button type="submit" className="modal-submit-button" onClick={submitProduct}>
                        Add Product
                    </button>
                    <button
                        className="modal-close-button"
                        onClick={toggleModal}
                    >
                        Close
                    </button>
                </div>
        </div>
    </div>
)}

 
{/* Modal for Editing Product */}
{showEditModal && (
    <div className="modal product-modal">
        <div className="modal-content">
            <h2>Edit Product</h2>
            {/* Product Name */}
            <div className="modal-field">
                <label htmlFor="editProductName">Product Name</label>
                <input
                    type="text"
                    id="editProductName"
                    value={editProduct.productName}
                    onChange={(e) => setEditProduct({ ...editProduct, productName: e.target.value })}
                    required
                />
            </div>

            {/* Price */}
            <div className="modal-field">
                <label htmlFor="editProductPrice">Price</label>
                <input
                    type="text"
                    id="editProductPrice"
                    value={`₱ ${editProduct.productPrice}`}
                    onChange={(e) => setEditProduct({ ...editProduct, productPrice: e.target.value.replace(/₱\s?/, '').replace(/[^0-9.]/g, '') })}
                    required
                />
            </div>

            {/* Quantity */}
            <div className="modal-field">
                <label htmlFor="editProductQuantity">Quantity</label>
                {/* Display Current Quantity as Uneditable Text */}
                <div>
                    <p>Current Quantity: {editProduct.productQuantity}</p>
                </div>
                {/* Editable Input Field for Updated Quantity */}
                <input
    type="number"
    id="editProductQuantity"
    value={editProduct.updatedQuantity || ''}
    onChange={(e) => {
        const newUpdatedQuantity = e.target.value;
        setEditProduct({
            ...editProduct,
            updatedQuantity: newUpdatedQuantity,  // Track the updated quantity input
        });
    }}
    required

                />
                {/* Display Final Quantity Calculation */}
                <p>
                    Final Quantity: {parseInt(editProduct.productQuantity) + (parseInt(editProduct.updatedQuantity) || 0)}
                </p>
            </div>

            {/* Category */}
            <div className="modal-field">
                <label htmlFor="editFkCategory">Category</label>
                <select
                    id="editFkCategory"
                    value={editProduct.fkCategory}
                    onChange={(e) => setEditProduct({ ...editProduct, fkCategory: e.target.value })}
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.idCategory} value={category.idCategory}>
                            {category.nameCategory}
                        </option>
                    ))}
                </select>
            </div>

            {/* Unit */}
            <div className="modal-field">
                <label htmlFor="editProductUnit">Unit</label>
                <input
                    type="text"
                    id="editProductUnit"
                    value={editProduct.productUnit}
                    onChange={(e) => setEditProduct({ ...editProduct, productUnit: e.target.value })}
                    placeholder="Enter product unit"
                    required
                />
            </div>

            {/* Update Changes Button */}
            <div className="modal-buttons">
                <button
                    type="button"
                    className="modal-submit-button"
                    onClick={() => {
                        const newQuantity = parseInt(editProduct.productQuantity) + (parseInt(editProduct.updatedQuantity) || 0);
                        setEditProduct({
                            ...editProduct,
                            productQuantity: newQuantity,  // Finalize the new quantity
                            updatedQuantity: '',  // Optionally reset the input field
                        });
                        // Call to save the updated product
                        saveEditedProduct();
                    }}
                >
                    Update Changes
                </button>
                <button
                    className="modal-close-button"
                    onClick={() => setShowEditModal(false)}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}





                         {/* Search bar-product */}
                         <input
    type="text"
    placeholder="Search Products..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
    className="search-bar-product"
/>

<button className="add-product-button" onClick={() => setShowModal(true)} >
    Add Product
</button>
                
                {/* Bottom container for displaying products */}
                <div className="addproduct-bottom-container">
                    <table className="addproduct-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Product Name</th>
                                <th>Category Name</th>
                                <th>Unit</th>
                                <th>Price</th>
                                <th>Quantity</th>
                               
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                       
                        {filteredProducts.length > 0 ? (
                            filteredProducts.slice().reverse().map(product => (
                                <tr key={product.SKU}>
                                    <td>{product.SKU}</td>
                                <td>{product.productName}</td>
                                    <td>{categories.find(category => category.idCategory === product.fkCategory)?.nameCategory}</td>
                                    <td>{product.productUnit}</td>
                                    <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(product.productPrice)}</td>

                                    <td>{product.productQuantity}</td>
                                   
                                    <td>
                                    <button className="addproduct-edit-button"  onClick={() => handleEditClick(product)}>Edit</button>
                                    <button className="addproduct-edit-button" onClick={() => handleShowDetails(product)}>Details</button>
                                        <button className="addproduct-qr-button" onClick={() => handleShowQRCode(product)}>DOWNLOAD QR</button>
                                        <button className="addproduct-delete-button" onClick={() => deleteProduct(product.SKU)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="9">No product found.</td> {/* Updated colspan to match the number of columns */}
                        </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {showQRCode && selectedProduct && (
                <div className="qr-code-popup">
                    <button className="x-button" onClick={() => setShowQRCode(false)}>
                        &times; {/* This displays the "X" symbol */}
                    </button>
                    <div className= "qrcode" ref={qrCodeRef}>
                        <QRCodeSVG value={selectedProduct.SKU} />
                        <p>SKU: {selectedProduct.SKU}</p>
                        <p>Product: {selectedProduct.productName}</p>
                        
                    </div>
                    <button className="handleDownloadQR" onClick={handleDownload}>
                        Download QR Code
                    </button>
                </div>
            )}
                 {/* Toast notification */}
                 {showToast && (
                    <ToastNotification
                        message={toastMessage}
                        onClose={() => setShowToast(false)}
                    />
                )}
            </div>
            </div>
      
    );
};

export default AddProduct;
