// SKU Generation Function
function generateSKU() {
    const prefix = 'PROD';
    const shortTimestamp = Math.floor(Date.now() / 100000); // Shortened timestamp
    const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit random number

    return `${prefix}-${shortTimestamp}-${randomNum}`; // Example: PROD-16319-123
}

// Export the function
module.exports = generateSKU;
