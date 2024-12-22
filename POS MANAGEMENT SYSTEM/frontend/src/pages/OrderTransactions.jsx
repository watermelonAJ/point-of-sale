// OrderTransactions.js
import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import '../styles/OrderTransactions.css';
import { UserContext } from './UserContext';
import fetchTransactions from '../fetching/fetchTransactions';
import { generateDailySalesReport } from '../generates/generateDailySalesReport';
import { generateMonthlySalesReport } from '../generates/generateMonthlySalesReport';
import { generateAnnualSalesReport } from '../generates/generateAnnualSalesReport';
import { generateTopCustomersReport } from '../generates/generateTopCustomersReport'; // Import the new function

function OrderTransactions() {
    const { user } = useContext(UserContext);
    const [transactions, setTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
    const [isDownloadSuccessModalOpen, setIsDownloadSuccessModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchTransactions();
            setTransactions(data);
        };

        fetchData();
    }, []);

    const filteredTransactions = transactions.filter((transaction) => {
        const query = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
        const orderNumber = String(transaction.OrderNumber || '').toLowerCase().trim().replace(/\s+/g, ' ');
        const customerID = String(transaction.CustomerID || '').toLowerCase().trim().replace(/\s+/g, ' ');
        const cashier = String(transaction.Cashier || '').toLowerCase().trim().replace(/\s+/g, ' ');

        return (
            orderNumber.includes(query) ||
            customerID.includes(query) ||
            cashier.includes(query)
        );
    });

    return (
        <div className="ordertransaction-container">
            <Sidebar />
            <div className="ordertransaction-main-content">
                <h2 className="dash">
                    <img src="/order-transaction.png" alt="Order Icon" className="dash-icon" />
                    Order Transactions
                </h2>

                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Search Order Number, Customer ID, Cashier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar-transaction"
                />

                {/* Button to open the main modal */}
                <button
                    className="order-download-button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Generate Reports
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
                            <h3>Generate Reports</h3>
                            <p className="justify-text">
                                Choose the type of report you would like to generate.
                            </p>
                            <div className="generate-modal-buttons">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsSalesModalOpen(true);
                                    }}
                                >
                                    Sales Reports
                                </button>
                                <button
   onClick={() => generateTopCustomersReport(transactions, setIsModalOpen, setIsDownloadSuccessModalOpen)}

>
    Top Customers Report
</button>

                            </div>
                        </div>
                    </div>
                )}

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

                {/* Nested Sales Reports Modal */}
                {isSalesModalOpen && (
                    <div className={`generate-modal-overlay ${isSalesModalOpen ? 'show' : ''}`}>
                        <div className="generate-modal">
                            <button
                                className="generate-modal-close-button"
                                onClick={() => setIsSalesModalOpen(false)}
                            >
                                x
                            </button>
                            <button
                                className="back-arrow-button"
                                onClick={() => {
                                    setIsSalesModalOpen(false);
                                    setIsModalOpen(true);
                                }}
                            >
                                ←
                            </button>
                            <h3>Sales Reports</h3>
                            <p>
                                Generate daily, monthly, or yearly sales reports,<br /> detailing total sales, cash, and points payments.
                            </p>
                            <div className="generate-modal-buttons">
                                <button onClick={() => generateDailySalesReport(transactions, setIsSalesModalOpen, setIsDownloadSuccessModalOpen, setIsSalesModalOpen)}>
                                    Daily Sales Report
                                </button>
                            
            <button 
    onClick={() => generateMonthlySalesReport(transactions, setIsDownloadSuccessModalOpen, setIsSalesModalOpen)}
>

                                    Monthly Sales Report
                                </button>

                                <button 
                                     onClick={() => generateAnnualSalesReport(transactions, setIsSalesModalOpen, setIsDownloadSuccessModalOpen, setIsSalesModalOpen)}
                                >
                                    Yearly Sales Report
                                </button>
                            </div>
                        </div>
                    </div>
                )}

               

                {/* Table */}
                <div className="transactions-table-container">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Order Number</th>
                                <th>Cashier ID</th>
                                <th>Customer</th>
                                <th>Points Earned</th>
                                <th>Points Used</th>
                                <th>Total Amount</th>
                                <th>Pay Amount</th>
                                <th>Cash Amount</th>
                                <th>Change Amount</th>
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
                                        <tr key={transaction.OrderNumber}>
                                            <td>{index + 1}</td>
                                            <td>{transaction.OrderNumber}</td>
                                            <td>{transaction.fkuserID}</td>
                                            <td>{transaction.CustomerID ? transaction.CustomerID : 'Unregistered'}</td>

                                            <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.PointsEarned)}</td>
<td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.PointsUsed)}</td>
<td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.TotalAmount)}</td>
<td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.PayAmount)}</td>
<td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.CashAmount)}</td>
<td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.ChangeAmount)}</td>

                                            <td>
                                                {`${transaction.TransactionMonth} ${transaction.TransactionDay}, ${transaction.TransactionYear} at ${transaction.TransactionTime}`} 
                                            </td>
                                          
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="11">No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderTransactions;
