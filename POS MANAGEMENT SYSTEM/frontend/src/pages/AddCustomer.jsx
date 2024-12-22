import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar component
import '../styles/AddCustomer.css'; // Import CSS for styling
import axios from 'axios'; // For API calls
import ToastNotification from './ToastNotification'; // Toast notification
import { UserContext } from './UserContext'; // Context for user information
import fetchCustomers from '../fetching/fetchingCustomers'; // Import the function
import handleSubmitCustomer from '../actions/customerActions/handleSubmitCustomer';
import handleEditCustomer from '../actions/customerActions/handleEditCustomer';
import clearCustomerForm from '../actions/customerActions/clearCustomerForm';
import handleDeleteCustomer from '../actions/customerActions/handleDeleteCustomer';
// Import at the top level
import html2canvas from "html2canvas";  // Ensure this import is at the top of the file

const AddCustomer = () => {
    const { user } = useContext(UserContext); // User context for registeredBy and role
    const [customers, setCustomers] = useState([]); // State for customers list
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Search query for customers
    const [customerDetails, setCustomerDetails] = useState(null); // State to hold category details
    const [selectedCustomer, setSelectedCustomer] = useState(null); // Customer being edited
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false); // Edit/Add mode toggle
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [downloadShowModal, setDownloadShowModal] = useState(false);
    const [cashAmount, setCashAmount] = useState('');
    const [change, setChange] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false); // State to control the payment modal




    // Fetch existing customers on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/customers');
                setCustomers(response.data);
            } catch (error) {
                console.error(error); // Log any errors for debugging
                setToastMessage(error.message); // Set user-friendly error message
                setShowToast(true); // Show the toast message
                setTimeout(() => setShowToast(false), 2000); // Hide the toast after 3 seconds
            }
        };

        fetchData();
    }, []); // Empty dependency array to fetch only once when the component mounts
     
    //handle the adding and editing a customer
    const handleFormSubmit = () => {

        // Validate contact number
    if (!/^09\d{9}$/.test(contactNumber)) {
        setToastMessage('Phone number must be valid.');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000); // Hide after 3 seconds
        return;
    }

        handleSubmitCustomer({
            firstName,
            lastName,
            contactNumber,
            address,
            user,
            editMode,
            selectedCustomer,
            setFirstName,
    setLastName,
    setContactNumber,
    setAddress,
            setToastMessage,
            setShowToast,
            setCustomers, // Ensure customers is passed down
            setSelectedCustomer,
            toggleModal,
            customers
        });
    }; 

    const handleEdit = (customer) => {
        handleEditCustomer(
            customer,
            setEditMode,
            setSelectedCustomer,
            setFirstName,
            setLastName,
            setContactNumber,
            setAddress,
            setShowModal
        );
    };

    const handleClearForm = () => {
        clearCustomerForm(setFirstName, setLastName, setContactNumber, setAddress, setSelectedCustomer);
    };


    const filteredCustomers = customers.filter(customer => {
        const lowerCaseQuery = searchQuery.toLowerCase().trim();
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase().trim();
        const customerID = customer.customerID.toLowerCase().trim(); // Get customerID in lowercase
    
    
        // Return true if either full name or customerID includes the search query
        return fullName.startsWith(lowerCaseQuery) || customerID.startsWith(lowerCaseQuery);
    });
    

    const handleShowDetails = (customer) => {
        setCustomerDetails(customer);
        const fkAddedBy = customer. fkuserID;
        const addedBy = customer.registeredBy;
        const addedRole = customer.roleRegisteredBy;
        const dateAdded = customer.dateRegistered ? formatDate(customer.dateRegistered) : 'none'; // Use 'none' if dateUpdated is null or undefined
        const updatedBy = customer.updatedBy || 'none';
        const updatedRole = customer.updatedRole || 'none';
        const updatedDate = customer.updatedDate ? formatDate(customer.updatedDate) : 'none'; // Use 'none' if dateUpdated is null or undefined
    
        alert(`Cashier ID: ${fkAddedBy}\nRegistered By: ${addedBy}\nRole: ${addedRole}\nDate Registered: ${dateAdded}\n\nUpdated By: ${updatedBy}\nRole: ${updatedRole}\nDate Updated: ${updatedDate}`); // Corrected template literal
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
    
    // Example usage:
    const formattedDate = formatDate("2024-12-12T13:00:00");
    console.log(formattedDate); // Output: "December 12, 2024, 1:00 PM" (depending on your locale)
    

    // Toggle modal visibility
    const toggleModal = () => {
        setShowModal(!showModal);
    };

// Function to handle the delete action
const deleteCustomer = (customerID) => {
    handleDeleteCustomer({
        customerID,
        setToastMessage,
        setShowToast,
        setCustomers
    });
};

const handleDownload = () => {
    const modalContent = document.querySelector(".download-customer-modal-content");

    // Use html2canvas to capture the modal content as a canvas, excluding buttons
    html2canvas(modalContent, {
        backgroundColor: "#fff",  // Force background to be white
        ignoreElements: (element) => {
            return element.classList.contains("download-button") || 
                   element.classList.contains("close-modal-download-button");
        },
        logging: false, // Disable logging for a cleaner output
        scale: 10, // Optional: Higher scale for better resolution
        useCORS: true, // Allow cross-origin images
        onclone: (document) => {
            // Force all text to be black after cloning the document
            const elements = document.querySelectorAll('.customer-info p, .customer-info strong');
            elements.forEach(element => {
                element.style.color = 'black';  // Explicitly set the color to black
            });
        }
    }).then((canvas) => {
        // Convert the canvas to PNG format
        const imgData = canvas.toDataURL("image/png");  // Change to PNG format
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `customer_${customerDetails?.customerID}.png`; // Save as PNG
        link.click();

        // Show the toast notification after download
        setToastMessage("Successfully downloaded customer details!");
        setShowToast(true);
    });
};



const handleShowDownloadModal = (customer) => {
    setCustomerDetails(customer);  // Set customer details to show in the modal
    setDownloadShowModal(true);  // Set downloadShowModal to true to display the modal
};






    


     
  return (
        <div className="addcustomer-container">
            <Sidebar />
            <div className="addcustomer-main-content">
            <h2 className="addcustomer-dash">
                <img src="/customer-icon.png" alt="Order Icon" className="categories-icon" />
                Customer
                </h2>


              {/* Modal for Add/Edit */}
              {showModal && (
                    <div className="modal customer-modal">
                        <div className="modal-content">
                            <h2>{editMode ? 'Edit Customer' : 'Add Customer'}</h2>
                            <div className="modal-field">
                            <label htmlFor="first-name">First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            </div>

                            <div className="modal-field">
                            <label htmlFor="first-name">Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                             </div>

                             <div className="modal-field">
    <label htmlFor="contact-number">Phone Number</label>
    <input
        type="text"
        placeholder="Contact Number"
        value={contactNumber}
        onChange={(e) => {
            const value = e.target.value;
            // Allow only numbers and restrict length to 11
            if (/^\d*$/.test(value) && value.length <= 11) {
                setContactNumber(e.target.value);
            }
        }}
    />
    {contactNumber && (!/^09\d{9}$/.test(contactNumber)) && (
        <p className="error-message">
            Phone number must start with '09' and have 11 digits.
        </p>
    )}
</div>



                             <div className="modal-field">
                             <label htmlFor="first-name">Address</label>
                            <input
                                type="text"
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            </div>

                            <div className="modal-buttons">
                            <button className="modal-submit-button" onClick={handleFormSubmit}>
    {editMode ? 'Update Customer' : 'Add Customer'}
</button>



<button className="modal-close-button" onClick={() => { handleClearForm(); toggleModal(); }}>
    Close
</button>

                            </div>
                            </div>
                        </div>
            
                )}



{/* Modal to display customer details */}
{downloadShowModal && (
    <div className="modal download-customer-modal">
        <div className="download-customer-modal-content">
            <div className="modal-header">
                {/* Icon on the top-left side */}
                <img 
                    src="logo.png" 
                    alt="Icon" 
                    className="modal-icon-dl" 
                />
                <button className="close-modal-download-button" onClick={() => setDownloadShowModal(false)}>X</button>
            </div>
            {customerDetails && (
                <div className="customer-card">
                    <div className="customer-info">
                        {/* First row: First Name and Last Name */}
                        <p><strong>First Name:</strong> {customerDetails.firstName}</p>
                        <p><strong>Last Name:</strong> {customerDetails.lastName}</p>

                        {/* Second row: Customer ID and Phone Number */}
                        <p><strong>Customer ID:</strong> {customerDetails.customerID}</p>
                        <p><strong>Phone Number:</strong> {customerDetails.contactNumber}</p>

                        {/* Third row: Address */}
                        <p className="address"><strong>Address:</strong> {customerDetails.address}</p>

                        {/* Fourth row: Added On Date */}
                        <p className="date"><strong>Added On:</strong> {new Date(customerDetails.dateRegistered).toLocaleDateString()}</p>
                    </div>
                    {/* Additional Information */}
                    <p className="additional-info">
                            The Customer ID is a unique identifier for verifying and accessing customer information. Please keep it safe and provide it to the cashier during payments.
                    </p>
                    <button className="download-button" onClick={handleDownload}>Download Details</button>
                </div>
            )}
        </div>
    </div>
)}











                 {/* Search bar-categories */}
                 <input
    type="text"
    placeholder="Search Customer..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
    className="search-bar-categories"
/>
                
<button
    className="add-customer-button"
    onClick={() => {
        setEditMode(false); // Set to false for "Add" mode
        setSelectedCustomer(null); // Clear any selected customer
        clearCustomerForm(setFirstName, setLastName, setContactNumber, setAddress, setSelectedCustomer); // Clear the form fields
        setShowModal(true); // Show the modal
    }}
>
    Add Customer
</button>

                {/* Bottom container for displaying customers */}
                <div className="addcustomer-bottom-container">
                    <table className="addcustomer-table">
                        <thead>
                            <tr>
                            <th>No.</th>
                                <th>Customer ID</th>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Address</th>
                               
                                <th>Points</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer, index) => (
                                    <tr key={index}>
                                         <td className='number'>{index + 1}</td> {/* Add the row number here */}
                                        <td>{customer.customerID}</td>
                                        <td>{`${customer.firstName} ${customer.lastName.trim()}`}</td>

                                        <td>{customer.contactNumber}</td>
                                        <td>{customer.address}</td>
                                        
                                        <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(customer.points)}</td>
                                        <td>
                                            <button className="addcustomer-edit-button" onClick={() => handleEdit(customer)}>Edit</button>
                                            <button className="addcustomer-details-button" onClick={() => handleShowDetails(customer)}>Details</button>
                                            <button
    className="addcustomer-downloadAction-button"
    onClick={() => handleShowDownloadModal(customer)}  // Open the modal with the customer details
>
    Download
</button>

                                            <button className="addcustomer-delete-button" onClick={() => deleteCustomer(customer.customerID)} >Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9">No customers found.</td> {/* Updated colspan to match the number of columns */}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

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

export default AddCustomer;
