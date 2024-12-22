import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './Sidebar'; 
import '../styles/OrderTransactions.css'; 
import fetchTransactions from '../fetching/fetchTransactionsOrder';
import { generateDailyProductReport } from '../generates/generateDailyProductReport'; 

function OrderDetails() {
    const [orderDetails, setOrderDetails] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDownloadSuccessModalOpen, setIsDownloadSuccessModalOpen] = useState(false);

    
    useEffect(() => {
        const fetchData = async () => {
            const transactions = await fetchTransactions(); 
            setOrderDetails(transactions); 
        };

        fetchData();
    }, []);
    
    

    const filteredTransactions = orderDetails.filter((orderDetails) => {
        const query = searchQuery.toLowerCase().trim().replace(/\s+/g, ' '); 
        const orderNumber = String(orderDetails.OrderNumber || '').toLowerCase().trim().replace(/\s+/g, ' ');
        const ProductName = String(orderDetails.ProductName || '').toLowerCase().trim().replace(/\s+/g, ' ');
        const SKU = String(orderDetails.SKU || '').toLowerCase().trim().replace(/\s+/g, ' ');

        return (
            orderNumber.includes(query) ||
            ProductName.includes(query) ||
            SKU.includes(query)
        );
    });

    return (
        <div className="ordertransaction-container">
            <Sidebar />
            <div className="ordertransaction-main-content">
                <h2 className="dash">
                    <img src="/order-transaction.png" alt="Order Icon" className="dash-icon" />
                    Order Details
                </h2>

                <input
                    type="text"
                    placeholder="Search Order Number, Product Name, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar-transaction"
                />

                {/* Button to open the main modal */}
                <button
                    className="order-download-button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Generate Report
                </button>




                {/* Modal for generating reports */}
                {isModalOpen && (
                    <div className={`generate-modal-overlay ${isModalOpen ? 'show' : ''}`}>
                        <div className="generate-modal">
                            <button
                                className="generate-modal-close-button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                x
                            </button>
                            <h3>Generate Report</h3>
                            <p className="justify-text">
                                The Daily Product Quantity Report summarizes<br /> the quantities available or sold for each product daily.
                            </p>
                            <div className="generate-modal-buttons">
                                <button
                                    onClick={() => {
                                        generateDailyProductReport(orderDetails, setIsDownloadSuccessModalOpen);
                                    }}
                                >
                                    Daily Product Report
                                </button>

                                {/* Download success modal */}
                                {isDownloadSuccessModalOpen && (
                                    <div className="download-successfully-modal-overlay">
                                        <div className="download-successfully-modal">
                                            <h3>Download Successfully</h3>
                                            <p>Your report has been downloaded.</p>
                                            <button
                                                onClick={() => setIsDownloadSuccessModalOpen(false)}
                                                className="close-modal-button"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

    

                <div className="transactions-table-container">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Order Number</th>
                                <th>Customer ID</th>
                                <th>SKU</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Transaction Date and Time</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions
                                    .sort((a, b) => {
                                        const dateTimeA = new Date(
                                            `${a.TransactionYear}-${a.TransactionMonth}-${a.TransactionDay} ${a.TransactionTime}`
                                        );
                                        const dateTimeB = new Date(
                                            `${b.TransactionYear}-${b.TransactionMonth}-${b.TransactionDay} ${b.TransactionTime}`
                                        );

                                        return dateTimeB - dateTimeA;
                                    })
                                    .map((transaction, index) => (
                                        <tr key={index}>
                                            <td className='number'>{index + 1}</td>
                                            <td>{transaction.OrderNumber}</td>
                                            <td>{transaction.CustomerID ? transaction.CustomerID : "Unregistered"}</td>
                                            <td>{transaction.SKU}</td>
                                            <td>{transaction.ProductName}</td>
                                            <td>{transaction.Quantity}</td>
                                            <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(transaction.Price)}</td>
                                            <td>{`${transaction.TransactionMonth} ${transaction.TransactionDay}, ${transaction.TransactionYear} at ${transaction.TransactionTime}`}</td>
                                         
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="11">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
