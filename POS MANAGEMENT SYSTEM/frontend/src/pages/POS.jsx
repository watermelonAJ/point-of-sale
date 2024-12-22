
import React, { useState, useRef, useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import '../styles/POS.css';
import axios from 'axios';
import QrScanner from 'qr-scanner';
import { UserContext } from './UserContext'; // Import UserContext
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Optional: For easier table handling in PDF


const POS = () => {
    const [sku, setSku] = useState('');
    const [customer, setCustomer] = useState(null);
    const [quantityInput, setQuantityInput] = useState(''); // Track input for current product
    const [totalAmount, setTotalAmount] = useState(0);
    const [cashAmount, setCashAmount] = useState(0);
    const [changeAmount, setChangeAmount] = useState(0);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [productsData, setProductsData] = useState([]);
    const [products, setProducts] = useState([]);
    const [skuSelected, setSkuSelected] = useState(false);
    const [customersData, setCustomersData] = useState([]); // Add state for customers
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false); // To control the modal visibility
    const [isPointsModalOpen, setIsPointsModalOpen] = useState(false); // State for the points modal
    const [isPointsModalAlertOpen, setIsPointsModalAlertOpen] = useState(false); // State for the points modal
    const [pointsToUse, setPointsToUse] = useState(0); // Track points to use
    const [selectedCustomer, setSelectedCustomer] = useState(null); // Track selected customer
    const videoRef = useRef(null);
    const scanner = useRef(null);
    const [pointsUsed, setPointsUsed] = useState(0); // Track points used
    // New state variables for Pay modal and confirmation
    const [isNoItemsModalOpen, setIsNoItemsModalOpen] = useState(false); // State to control the no-items modal visibility
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isPaymentSuccessModalOpen, setIsPaymentSuccessModalOpen] = useState(false);
    const { user } = useContext(UserContext); // Get user data from context
    const [reloadData, setReloadData] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For toggling dropdown visibility
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');
    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    




    // Fetch products whenever reloadData changes
useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'GET', // HTTP method
                headers: {
                    'Content-Type': 'application/json', // Specify JSON data format
                },
            });

            console.log("Response from server:", response);

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const result = await response.json();
            console.log("Response data:", result);

            setProductsData(result);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    fetchProducts();
}, [reloadData]);



   // Fetch customers whenever reloadData changes
useEffect(() => {
    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/customers', {
                method: 'GET', // HTTP method
                headers: {
                    'Content-Type': 'application/json', // Specify JSON data format
                },
            });

            console.log("Response from server:", response);

            if (!response.ok) {
                throw new Error('Failed to fetch customers');
            }

            const result = await response.json();
            console.log("Response data:", result);

            setCustomersData(result);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    fetchCustomers();
}, [reloadData]);



    useEffect(() => {
        if (productsData.length === 0) return;
        const startScanner = async () => {
            if (videoRef.current) {
                try {
                    scanner.current = new QrScanner(
                        videoRef.current,
                        (result) => handleProductScan(result.data),
                        {
                            onDecodeError: (error) => console.error("Decode error:", error),
                            highlightScanRegion: true,
                            highlightCodeOutline: true,
                            inversionMode: 'original'
                        }
                    );
                    await scanner.current.start();
                } catch (error) {
                    console.error("Error starting QR Scanner:", error);
                }
            }
        };
        startScanner();
        return () => {
            if (scanner.current) {
                scanner.current.stop();
                scanner.current.destroy();
            }
        };
    }, [productsData]);


    const addProductToCart = (selectedSku, quantity) => {
        const product = productsData.find(p => p.SKU.toLowerCase() === selectedSku.toLowerCase());
        if (product) {
            setProducts((prevProducts) => {
                const existingProductIndex = prevProducts.findIndex(p => p.SKU === product.SKU);
                if (existingProductIndex >= 0) {
                    // Update the quantity of the existing product in the cart
                    const updatedProducts = [...prevProducts];
                    const newQuantity = updatedProducts[existingProductIndex].quantity + quantity; // Correct addition
                    updatedProducts[existingProductIndex] = {
                        ...updatedProducts[existingProductIndex],
                        quantity: newQuantity
                    };
                    return updatedProducts;
                } else {
                    // Product is not in the cart, so add it with the initial quantity
                    return [...prevProducts, { ...product, quantity }];
                }
            });
            setTotalAmount((prevTotal) => prevTotal + product.productPrice * quantity);
        } else {
            console.error("Product not found in inventory.");
        }
    };

    const handleSkuChange = (e) => {
        const selectedSku = e.target.value;
        setSku(selectedSku);
        setSkuSelected(true); // Update the SKU selection state
        setIsQuantityModalOpen(true); // Show the quantity modal after scanning
        setSearchQuery(e.target.value); // Update the searchQuery when a SKU is selected
        setIsDropdownOpen(false); // Close the dropdown after selection

    };

    // Handle change in the search input
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredProducts = productsData.filter((product) =>
        product.SKU.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter customers based on the search query
    const filteredCustomers = customersData.filter((customer) =>
        `${customer.customerID}`.toLowerCase().includes(customerSearchQuery.toLowerCase())
    );

    // Handle change in the customer search input
    const handleCustomerSearchChange = (e) => {
        setCustomerSearchQuery(e.target.value);
    };

    // Handle selection of a customer from the dropdown
    const handleCustomerSelection = (customerID, fullName) => {
        setCustomer(customerID); // Set the selected customer ID
        setCustomerSearchQuery(fullName); // Update the search query to show the selected customer's name
        setIsCustomerDropdownOpen(false); // Close the dropdown after selection
    };

    const handleProductScan = (scannedSku) => {
        setSku(scannedSku.trim());
        setSkuSelected(true); // Update the SKU selection state
        setIsQuantityModalOpen(true); // Show the quantity modal
    };

    const handleQuantitySubmit = () => {
        if (quantityInput <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        // Find the selected product by SKU
        const product = productsData.find(p => p.SKU.toLowerCase() === sku.toLowerCase());

        if (product) {
            const availableQuantity = product.productQuantity;

            // Check if requested quantity exceeds available stock
            if (parseInt(quantityInput) > availableQuantity) {
                alert(`Not enough quantity available. Only ${availableQuantity} items in stock.`);

                return;
            }
        } else {
            alert("Product not found in inventory.");
            return;
        }

      // Add product to cart with the specified quantity
    addProductToCart(sku, parseInt(quantityInput)); // Add to cart first

    // Reset the SKU and other relevant states after adding to cart
    setSku(''); // Reset SKU state
    setSearchQuery(''); // Reset search query state
    setQuantityInput(''); // Reset the quantity input
    setIsQuantityModalOpen(false); // Close the modal
    };

    // Calculate points earned based on the total amount
    const calculatePointsEarned = (total, customer) => {
        if (customer === null) {
            return 0; // If no customer is selected, return 0 points earned
        }
        return total >= 500 ? (total * 0.01).toFixed(2) : 0;
    };

    useEffect(() => {
        setPointsEarned(calculatePointsEarned(totalAmount, customer)); // Pass customer to the function
    }, [totalAmount, customer]); // Recalculate when totalAmount or customer changes


    // Calculate the Pay Amount after applying points
    const payAmount = totalAmount - pointsUsed;

    useEffect(() => {
        setChangeAmount(cashAmount - payAmount);
    }, [cashAmount, payAmount]);


    const handleUsePoints = () => {
        if (customer === null) {
            setIsPointsModalAlertOpen(true); // Show the modal for unregistered customers
            return;
        }
    
        // Look for the customer data in the customersData array
        const selectedCustomerData = customersData.find(cust => cust.customerID === customer);
    
        // If customer is found, proceed with showing points modal
        if (selectedCustomerData) {
            setSelectedCustomer(selectedCustomerData);
            setIsPointsModalOpen(true); // Open the points modal
        } else {
            alert("Customer not found.");
        }
    };
    
    const handlePointsSubmit = () => {
        if (pointsToUse <= 0 || pointsToUse > selectedCustomer.points) {
            alert("Invalid points amount.");
            return;
        }
        setPointsUsed(pointsToUse); // Apply the points
        setIsPointsModalOpen(false); // Close modal
        setPointsToUse(0); // Reset points input
    };
    
// Function to handle pay button click
const handlePay = () => {
    if (products.length === 0) {
        setIsNoItemsModalOpen(true); // Show the alert modal if cart is empty
        return;
    }
    setIsPayModalOpen(true); // Proceed to pay modal if there are items in the cart
};

// Handle confirmation modal
const handleConfirmation = (isConfirmed) => {
    if (isConfirmed) {
        addTransactionToDatabase();
    }
    setIsPayModalOpen(false);
    setIsConfirmationModalOpen(false);
};

    // Function to generate the order number
function generateOrderNumber() {
    const prefix = "ID";
    const timestamp = Date.now().toString().slice(-4); // Get the last 4 digits of the timestamp
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

    return `${prefix}-${timestamp}-${randomNum}`; // Example: ID-1234-5678
}

const addTransactionToDatabase = async () => {
    try {
        // Generate the order number
        const orderNumber = generateOrderNumber();

        // Get the current date and extract day, month, and year
        const currentDate = new Date();
        const transactionDay = currentDate.getDate(); // Day of the month (1-31)
        const transactionMonth = currentDate.toLocaleString('default', { month: 'long' }); // Full month name (e.g., 'January')
        const transactionYear = currentDate.getFullYear(); // Full year (e.g., 2024)
        const transactionTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Time in HH:mm AM/PM format

        // Prepare main transaction data
        const transactionData = {
            OrderNumber: orderNumber,
            CustomerID: customer || null,
            TotalAmount: totalAmount,
            PointsUsed: pointsUsed,
            PayAmount: payAmount,
            CashAmount: cashAmount,
            ChangeAmount: changeAmount,
            TransactionDay: transactionDay, // Day
            TransactionMonth: transactionMonth, // Full month name (e.g., 'January')
            TransactionYear: transactionYear, // Year (e.g., 2024)
            TransactionTime: transactionTime,
            Cashier: `${user.firstName} ${user.lastName}`,
            fkuserID: user.userID,
            CustomerName: '${customer.firstName} ${customer.lastName}' ,
          
            
     
        };

        if (pointsEarned > 0) {
            transactionData.PointsEarned = pointsEarned;
        }

        // Make the POST request to add the main transaction
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:5000/api/transactions/add',
            headers: {
                'Content-Type': 'application/json',
            },
            data: transactionData,
        });

        if (response.status === 201) {
            // Add each product to the orderTransaction table
            for (const product of products) {
                const orderItemData = {
                    OrderNumber: orderNumber,
                    CustomerID: customer || null,
                    SKU: product.SKU,
                    ProductName: product.productName,
                    Quantity: product.quantity,
                    Price: product.productPrice,
                    TransactionDay: transactionDay, // Day
                    TransactionMonth: transactionMonth, // Full month name (e.g., 'January')
                    TransactionYear: transactionYear, // Year (e.g., 2024)
                    TransactionTime: transactionTime,
                };

                await axios({
                    method: 'POST',
                    url: 'http://localhost:5000/api/orderTransactions/add',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: orderItemData,
                });

                // Update the product quantity in the products table
                await axios({
                    method: 'PUT',
                    url: 'http://localhost:5000/api/products/updateQuantity',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        SKU: product.SKU,
                        productQuantity: product.quantity,
                    },
                });
            }

            // Update points if applicable
            if (customer) {
                await axios({
                    method: 'PUT',
                    url: 'http://localhost:5000/api/customers/updatePoints',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        customerID: customer,
                        PointsUsed: pointsUsed,
                        PointsEarned: pointsEarned,
                    },
                });
            }

            alert('Transaction successfully added!');
            setIsPaymentSuccessModalOpen(true);

            // Generate and download the PDF receipt with the same order number
            generateReceiptPDF(orderNumber);

            // Reset form and trigger data reload
            setProducts([]);
            setTotalAmount(0);
            setCashAmount(0);
            setChangeAmount(0);
            setPointsUsed(0);
            setPointsEarned(0);
            setCustomer('');
            setSku('');
            setSkuSelected(false);
            setQuantityInput('');
            setSelectedCustomer(null);

            // Reset customer-related state
            setCustomer('');
            setCustomerSearchQuery(''); // Optional: clear the search query as well
            setSelectedCustomer(null);  // Reset the selected customer state if it's used

            setReloadData((prev) => !prev);
        } else {
            throw new Error("Unexpected response from the server");
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
        alert('Failed to process the transaction. Please try again.');
    }
};


const generateReceiptPDF = (orderNumber) => {
    const doc = new jsPDF();
    
    // Title and Basic Info
    doc.setFontSize(18);
    doc.text("Receipt", 105, 10, { align: "center" });
    doc.setFontSize(12);
    if (customer) {
        doc.text(`Customer ID: ${customer}`, 105, 15, { align: "center" });
    }
    doc.text(`Cashier: ${user.firstName} ${user.lastName}`, 105, 20, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 25, { align: "center" });
    doc.text(`Order Number: ${orderNumber}`, 105, 30, { align: "center" }); // Add the Order Number to the receipt
    
    // Table for items without borders
    const items = products.map((item) => [
        item.productName,
        item.quantity,
        `P${item.productPrice.toFixed(2)}`,
        `P${(item.productPrice * item.quantity).toFixed(2)}`
    ]);
    
    doc.autoTable({
        startY: 40,
        head: [['Product Name', 'Quantity', 'Price', 'Total']],
        body: items,
        theme: 'plain', // No borders
        styles: {
            fillColor: [255, 255, 255], // Background color for the table
            textColor: [0, 0, 0], // Text color
            lineWidth: 0, // No lines/borders
            halign: 'center', // Horizontal alignment
            valign: 'middle', // Vertical alignment
        },
        headStyles: {
            fillColor: [200, 200, 200], // Header background color
        },
    });
    
    // Draw line before summary section
    const lineY = doc.previousAutoTable.finalY + 10; 
    doc.setLineWidth(0.9);
    doc.line(10, lineY, 200, lineY);
    
    // Summary Section
    const finalY = lineY + 13;
    doc.setFont('helvetica', 'bold');
    doc.text("Total Amount:", 20, finalY + 10);
    doc.text("Points Used:", 20, finalY + 15);
    doc.text("Points Earned:", 20, finalY + 20);
    doc.text("Pay Amount:", 20, finalY + 25);
    doc.text("Cash Amount:", 20, finalY + 30);
    doc.text("Change:", 20, finalY + 35);
    
    // Normal font for values
    doc.setFont('arial', 'bold');
    doc.text(`P${totalAmount.toFixed(2)}`, 160, finalY + 10);
    doc.text(`P${pointsUsed}`, 160, finalY + 15);
    doc.text(`P${pointsEarned}`, 160, finalY + 20); // Add 'P' before pointsEarned
    doc.text(`P${payAmount.toFixed(2)}`, 160, finalY + 25);
    doc.text(`P${cashAmount.toFixed(2)}`, 160, finalY + 30);
    doc.text(`P${changeAmount.toFixed(2)}`, 160, finalY + 35);
    
    // Broken line before the "Thank You" message
    const brokenLineStartY = finalY + 45;
    doc.setLineWidth(0.5);
    let lineX = 5;
    const lineLength = 2;
    const gapLength = 3;
    for (let x = lineX; x < 200; x += (lineLength + gapLength)) {
        doc.line(x, brokenLineStartY, x + lineLength, brokenLineStartY);
    }
    
    // "Thank You" message
    doc.setFont('arial', 'normal');
    doc.text("Thank you for shopping. Come again!", 105, finalY + 70, { align: 'center' });
    
    // Save PDF
    doc.save(`Receipt_${Date.now()}.pdf`);
};




    
    



    return (
        <div className="pos-container">
            <Sidebar />
            <div className="pos-main-content">
                <div className="pos-left">
                    <h2 className="pos-dash" > <img src="/pos-icon.png" alt="Order Icon" className="pos-icon" /> POS</h2>
                    <div className="pos-columns">
                        <div className="qr-scanner">
                            <p>QR Scanner</p>
                            <video ref={videoRef} className="qr-video" style={{ width: '100%', height: 'auto%', display: 'block' }} />
                        </div>


                        <div >
                        <div className="sku-value">
            <div className="custom-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="dropdown-header">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by SKU"
                        className="dropdown-search"
                    />
                </div>
                {isDropdownOpen && (
                    <div className="dropdown-options">
                        {filteredProducts.length === 0 ? (
                            <div className="dropdown-option">Not Found</div>
                        ) : (
                            filteredProducts.map((product) => (
                                <div
                                    key={product.SKU}
                                    className="dropdown-option"
                                    onClick={() => handleSkuChange({ target: { value: product.SKU } })}
                                >
                                    {product.SKU}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
                            {/* Customer Dropdown */}
                            <div className="customer-search">
            <div className="custom-dropdown" onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}>
                <div className="dropdown-header">
                    <input
                        type="text"
                        value={customerSearchQuery } 
                        onChange={handleCustomerSearchChange}
                        placeholder="Search by CustomerID"
                        className="dropdown-search"
                    />
                </div>
                {isCustomerDropdownOpen && (
                    <div className="dropdown-options">
                        {filteredCustomers.length === 0 ? (
                            <div className="dropdown-option">Not Found</div>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <div
                                    key={customer.customerID}
                                    className="dropdown-option"
                                    onClick={() => handleCustomerSelection(customer.customerID, `${customer.firstName} ${customer.lastName}`)}
                                >
                                    {`${customer.customerID}`}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>

                        </div>
                    </div>

                    
                    <div className="amount-display">
                        <div className="amount-item">
                            <span>Total Amount:</span>
                            <span>₱{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="amount-item">
                            <span>Pay Amount:</span>
                            <span>₱{payAmount.toFixed(2)}</span>
                        </div>
                        <div className="amount-item">
                            <span>Points Used:</span>
                            <span>₱{pointsUsed}</span>
                        </div>
                        <div className="amount-item">
                            <span>Points Earned:</span>
                            <span>₱{pointsEarned}</span>
                        </div>
                        <div className="amount-buttons">
                            <button className="use-points-btn" onClick={handleUsePoints}> Use Points</button>
                            <button className="pay-btn" onClick={handlePay}>Pay</button>
                        </div>
                    </div>
                </div>



                <div className="pos-right">
                <div className="receipt-table-container">
                    <table className="receipt-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product.SKU}>
                                    <td>{product.productName}</td>
                                    <td>{product.quantity}</td>
                                    <td>{(product.productPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Modal for entering quantity */}
            {isQuantityModalOpen && (
                <div className="quantity-modal">
                    <div className="points-modal-content">
                        <h3>Enter Quantity</h3>
                        <input
                            type="number"
                            value={quantityInput}
                            onChange={(e) => setQuantityInput(e.target.value)}
                            placeholder="Enter quantity"
                            min="1"
                        />
                        <button onClick={handleQuantitySubmit} className="points-submit-btn">Add to Cart</button>
                        <button onClick={() => setIsQuantityModalOpen(false)} className="points-submit-btn">Cancel</button>
                    </div>
                </div>
            )}

            {/* Points Modal */}
            {isPointsModalOpen && selectedCustomer && (
                <div className="points-modal">
                    <div className="points-modal-content">
                        <h3>{`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}'s Points</h3>
                        <p>Points Available: {selectedCustomer.points}</p>
                        <input
                            type="number"
                            value={pointsToUse}
                            onChange={(e) => setPointsToUse(e.target.value)}
                            placeholder="Enter points to use"
                            className="points-input"
                        />
                        <button onClick={handlePointsSubmit} className="points-submit-btn">Submit</button>
                        <button onClick={() => setIsPointsModalOpen(false)} className="points-cancel-btn">Cancel</button>
                    </div>
                </div>
            )}

            {/* Pay Modal */}
            {isPayModalOpen && (
                <div className="pay-modal">
                    <div className="pay-modal-content">
                        <h3>Pay Amount</h3>
                        <div className="pay-amount-item">
                            <span>Pay Amount:</span>
                            <span>₱{payAmount.toFixed(2)}</span>
                        </div>
                        <div className="pay-amount-item">
                            <span>Cash Amount:</span>
                            <input
                                type="number"
                                value={cashAmount}
                                onChange={(e) => setCashAmount(parseFloat(e.target.value)) } // Parse input as a float or set to 0
                            />
                        </div>
                        <div className="pay-amount-item">
                            <span>Change:</span>
                            <span>₱{changeAmount.toFixed(2)}</span>
                        </div>
                        {/* Display Insufficient Money Warning if needed */}
                        {cashAmount < payAmount && (
                            <p style={{ color: 'red' }}>Insufficient money</p>
                        )}
                        <button
                            onClick={() => {
                                if (cashAmount >= payAmount) {
                                    setIsConfirmationModalOpen(true);
                                }
                            }}
                        >
                            Confirm Payment
                        </button>
                        <button  className='close-payment-modal' onClick={() => setIsPayModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* No Items Modal */}
            {isNoItemsModalOpen && (
                <div className="no-items-modal">
                    <div className="no-items-modal-content">
                        <h3>You cannot proceed with payment without any items in the cart.</h3>
                        <button className='close-payment-modal' onClick={() => setIsNoItemsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}


           {/* Confirmation Modal */}
        {isConfirmationModalOpen && (
            <div className="confirmation-modal">
                <div className="confirmation-modal-content">
                    <h3>Are you sure you want to proceed with this payment?</h3>
                    <button onClick={() => handleConfirmation(true)}>Yes</button>
                    <button onClick={() => handleConfirmation(false)}>No</button>
                </div>
            </div>
        )}

        {/* Payment Success Modal */}
        {isPaymentSuccessModalOpen && (
            <div className="payment-success-modal">
                <div className="payment-success-modal-content">
                    <h3>Payment Successful!</h3>
                    <button onClick={() => setIsPaymentSuccessModalOpen(false)}>Close</button>
                </div>
            </div>
        )}

{isPointsModalAlertOpen && (
    <div className="alert-points-modal">
        <div className="modal-content">
            <h3>Notice</h3>
            <p>Points cannot be applied for an unregistered customer.</p>
            <button onClick={() => setIsPointsModalAlertOpen(false)}>Close</button>
        </div>
    </div>
)}


        </div>
    );
};

export default POS;
