import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';
import { UserContext } from './UserContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    

    console.log(user); // Check the user object for debugging

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            navigate('/login'); // Navigate to the login page
        }
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <img src="sarilogo.png" alt="Store Logo" className="store-logo" />
                    <h2>{user.firstName} {user.lastName}</h2>
                    <h4>{user.role}</h4>
                </div>
                <ul className="sidebar-menu">
                    {/* Conditional Rendering Based on User Role */}
                    {user.role !== 'cashier' && (
                        <li>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => (isActive ? 'active-link' : '')}
                            >
                                <img src="dashboard.png" alt="Dashboard" />
                                Dashboard
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink
                            to="/user"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src="user.png" alt="User" />
                            Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/pos"
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            <img src="pos.png" alt="Point of Sale" />
                            Point of Sale
                        </NavLink>
                    </li>
                    <li>
                                <NavLink
                                    to="/order-transactions"
                                    className={({ isActive }) => (isActive ? 'active-link' : '')}
                                >
                                    <img src="orderhistory.png" alt="Order Transactions" />
                                    Order Transaction
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/order-details"
                                    className={({ isActive }) => (isActive ? 'active-link' : '')}
                                >
                                    <img src="orderhistory.png" alt="Order Transactions" />
                                    Order Details
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/add-customer"
                                    className={({ isActive }) => (isActive ? 'active-link' : '')}
                                >
                                    <img src="addCustomer.png" alt="Add Customer" />
                                    Customer
                                </NavLink>
                            </li>
                            
                    {user.role !== 'Cashier' && (
                        <>
                            
                            <li>
                                <NavLink
                                    to="/add-product"
                                    className={({ isActive }) => (isActive ? 'active-link' : '')}
                                >
                                    <img src="addProducts.png" alt="Add Product" />
                                    Product
                                </NavLink>
                            </li>
                            
                            <li>
                                <NavLink
                                    to="/add-categories"
                                    className={({ isActive }) => (isActive ? 'active-link' : '')}
                                >
                                    <img src="categories.png" alt="Add Categories" />
                                    Categories
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
