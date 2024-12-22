// utils/generateUserID.js

const generateUserID = (callback) => {
    // Example ID generation logic; you can replace it with your own
    const userID = `USER ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    callback(null, userID);
};

module.exports = generateUserID;


