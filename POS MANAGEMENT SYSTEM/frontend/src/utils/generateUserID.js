// utils/generateUserID.js

function generateUserID() {
    const prefix = 'USER';
    const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit random number

    return `${prefix}-${randomNum}`; // Example: USER-16319-123
}

export default generateUserID;
