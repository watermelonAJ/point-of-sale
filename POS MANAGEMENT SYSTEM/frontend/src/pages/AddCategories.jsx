import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar component
import '../styles/AddCategories.css'; // Import CSS for styling
import axios from 'axios'; // You will need to use axios for API calls
import ToastNotification from './ToastNotification'; // Import the ToastNotification component
import { UserContext } from './UserContext'; // Import UserContext
import fetchCategories from '../fetching/fetchCategories'; // Import the function
import handleSubmitCategory from '../actions/categoryActions/handleSubmitCategory'; // Import the function
import handleEditSubmitCategory from '../actions/categoryActions/handleEditSubmitCategory'; // Import the function
import handleDeleteCategory from '../actions/categoryActions/handleDeleteCategory'; // Import the function




const AddCategories = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortDirection, setSortDirection] = useState('asc'); // State to track sort direction
    const [sortedCategories, setSortedCategories] = useState([]); // State to hold sorted categories      
    const [categoryDetails, setCategoryDetails] = useState(null); // State to hold category details
    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const { user } = useContext(UserContext); // Get user data from context
    const [nameCategory, setNameCategory] = useState('');
    const [descriptionCategory, setDescriptionCategory] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [categories, setCategories] = useState([]); // State to hold categories
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // Add this state for managing the Edit Modal
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State for edit modal visibility
    const [editCategoryData, setEditCategoryData] = useState({
    idCategory: '',
    nameCategory: '',
    descriptionCategory: '',
     }); // State to store the category being edited




//fetching categories
useEffect(() => {
    const fetchData = async () => {
        const data = await fetchCategories(); // Call the fetching function
        setCategories(data); // Set the fetched categories
        setSortedCategories(data); // Set the sorted categories (you can add sorting logic here)
    };

    fetchData();
}, []); // Empty dependency array to fetch only once when the component mounts




//handle submit to add category to the database
const handleSubmit = (e) => {
    
    e.preventDefault();
    handleSubmitCategory({
        nameCategory,
        descriptionCategory,
        dateCreated,
        user,
        setCategories,
        setSortedCategories,
        setToastMessage,
        setShowToast,
        setNameCategory,
        setDescriptionCategory,
        setShowModal,
        setErrorMessage
    });
};

// Edit category
const handleEditSubmit = () => {
    handleEditSubmitCategory({
        editCategoryData,
        user,
        setCategories,
        setSortedCategories,
        setToastMessage,
        setShowToast,
        setIsEditModalVisible
    }
    );
};

// Delete category
const handleDelete = (idCategory, nameCategory) => {
    handleDeleteCategory({
        idCategory,
        nameCategory,
        setCategories,
        setSortedCategories,
        setToastMessage,
        setShowToast,
    });

    // Clear categoryDetails if the deleted category matches the current details
    setCategoryDetails((prevDetails) =>
        prevDetails?.idCategory === idCategory ? null : prevDetails
    );
};


    // Function to format the date and time in Philippine Time (PHT)
const formatDate = (isoString) => {
    const date = new Date(isoString); // Convert ISO string to Date object

    // Format the date to 'Month Day, Year' in PHT
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Manila' };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    // Format the time to 'HH:MM AM/PM' in PHT
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' };
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    // Combine the date and time with 'at' in between
    return `${formattedDate}`;
};

// Example usage
const formattedDateTime = formatDate("2024-12-12T13:45:00Z"); // 'Z' for UTC time
console.log(formattedDateTime); // Output: "December 12, 2024 at 9:45 PM"




    const filteredCategories = sortedCategories.filter(category => 
        category.nameCategory.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    console.log(filteredCategories); // Log the filtered categories
    

    const sortCategories = (order) => {
        const sorted = [...categories].sort((a, b) => {
            if (a.nameCategory < b.nameCategory) return order === 'asc' ? -1 : 1;
            if (a.nameCategory > b.nameCategory) return order === 'asc' ? 1 : -1;
            return 0;
        });
        console.log("Sorted Categories:", sorted); // Log sorted categories
        setSortedCategories(sorted);
    };
    
    const handleSortCategories = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
        console.log("Sorting direction changed to:", newDirection); // Log new sorting direction
        sortCategories(newDirection);
    };
    
    const handleShowDetails = (category) => {
        setCategoryDetails(category);
        
        const updatedBy = category.updatedBy || 'none';
        const updatedRole = category.updatedRole || 'none';
        const dateUpdated = category.dateUpdated ? formatDate(category.dateUpdated) : 'none'; // Use 'none' if dateUpdated is null or undefined
    
        alert(`Updated By: ${updatedBy}\nUpdated Role: ${updatedRole}\nDate Updated: ${dateUpdated}`); // Corrected template literal
    };

      // Toggle modal visibility
      const toggleModal = () => {
        setShowModal(!showModal);
    };



    return (
        <div className="addcategories-container">
            <Sidebar />
            <div className="addcategories-main-content">
              
            <h2 className="categories-dash">
                <img src="/categories-icon.png" alt="Order Icon" className="categories-icon" />
                Categories
                </h2>
                
 {/* Modal for Adding Category */}
{showModal && (
    <div className="modal user-edit-profile">
        <div className="modal-content">
            <h2>Add Category</h2>
                <div className="modal-field">
                    <label htmlFor="category-name">Category Name</label>
                    <input
                        type="text"
                        id="category-name"
                        name="category-name"
                        placeholder="Name of the Category"
                        value={nameCategory}
                        onChange={(e) => setNameCategory(e.target.value)}
                        required
                    />
                </div>

                <div className="modal-field">
                    <label htmlFor="category-description">Description</label>
                    <input
                        type="text"
                        id="category-description"
                        name="category-description"
                        placeholder="Description"
                        value={descriptionCategory}
                        onChange={(e) => setDescriptionCategory(e.target.value)}
                        required
                    />
                </div>
                <div className="modal-buttons">
                    <button
                        type="submit"
                        className="modal-submit-button"
                        onClick={handleSubmit} // Trigger confirmation modal on submit
                        
                    >
                        Add Category
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

{/* Modal for Editing Category */}
{isEditModalVisible && (
    <div className="modal user-edit-profile">
        <div className="modal-content">
            <h2>Edit Category</h2>
            <div className="modal-field">
                <label htmlFor="edit-category-name">Category Name</label>
                <input
                    type="text"
                    id="edit-category-name"
                    name="edit-category-name"
                    placeholder="Name of the Category"
                    value={editCategoryData.nameCategory}
                    onChange={(e) =>
                        setEditCategoryData({ ...editCategoryData, nameCategory: e.target.value })
                    }
                    required
                />
            </div>

            <div className="modal-field">
                <label htmlFor="edit-category-description">Description</label>
                <input
                    type="text"
                    id="edit-category-description"
                    name="edit-category-description"
                    placeholder="Description"
                    value={editCategoryData.descriptionCategory}
                    onChange={(e) =>
                        setEditCategoryData({ ...editCategoryData, descriptionCategory: e.target.value })
                    }
                    required
                />
            </div>

            <div className="modal-buttons">
                <button
                    type="submit"
                    className="modal-submit-button"
                    onClick={() => handleEditSubmit()} // Call the edit submit function
                >
                    Save Changes
                </button>
                <button
                    className="modal-close-button"
                    onClick={() => setIsEditModalVisible(false)} // Close the modal
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}

                 {/* Search bar-categories */}
                 <input
    type="text"
    placeholder="Search Categories..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
    className="search-bar-categories"
/>

<button className="add-category-button" onClick={() => setShowModal(true)} >
    Add Category
</button>

             

                {/* Toast Notification */}
                {showToast && (
                    <ToastNotification 
                        message={toastMessage} 
                        onClose={() => setShowToast(false)} 
                    />
                )}

                {/* Bottom container for displaying categories */}
                <div className="addcategories-bottom-container">
                    <table className="addcategories-table">
                        <thead>
                            <tr>
                            <th onClick={handleSortCategories} style={{ cursor: 'pointer' }}>
                             Category {sortDirection === 'asc' ? '↑' : '↓'}
                            </th>

                                <th>Description</th>
                                <th>Added By</th> {/* New column for user name */}
                                <th>Role</th> {/* New column for user role */}
                                <th>Date Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <tr key={category.idCategory}>
                                        <td>{category.nameCategory}</td>
                                        <td className='category-description-column'>{category.descriptionCategory}</td>
                                        <td>{category.addedBy}</td>
                                        <td>{category.role}</td>
                                        <td>{formatDate(category.dateCreated)}</td>
                                        <td>
                                            <button className="edit-button"   onClick={() => {
                                            setIsEditModalVisible(true); // Show the edit modal
                                            setEditCategoryData({
                                            idCategory: category.idCategory,
                                            nameCategory: category.nameCategory,
                                            descriptionCategory: category.descriptionCategory,
                                            addedBy: category.addedBy,
                                            role: category.role,
                                            dateCreated: category.dateCreated,
                                            }); // Set the selected category's data
                                            }}>Edit</button>
                                            <button className="details-button" onClick={() => handleShowDetails(category)}>Details</button>
                                            <button 
                                            className="delete-button" 
                                            onClick={() => handleDelete(category.idCategory, category.nameCategory)}
                                                >
                                            Delete
                                         </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No categories found.</td> {/* Updated colspan to 6 */}
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddCategories;