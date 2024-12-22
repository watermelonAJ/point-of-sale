// utils/generateOrderNumber.js
function generateOrderNumber() {
    const prefix = "ID";
    const timestamp = Date.now().toString().slice(-4); // Get the last 4 digits of the timestamp
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

    return `${prefix}-${timestamp}-${randomNum}`; // Example: ID-1234-5678
}

module.exports = generateOrderNumber;
