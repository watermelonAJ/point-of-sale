// utils/generateCustomerID.js

const generateCustomerID = (callback) => {
    // Example ID generation logic; you can replace it with your own
    const customerID = `CUST ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    callback(null, customerID);
};

module.exports = generateCustomerID;


