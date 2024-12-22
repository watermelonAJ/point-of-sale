// fetching/fetchCustomers.js
import axios from 'axios';

const fetchCustomers = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/customers');
        return response.data; // Return the fetched customer data
    } catch (error) {
        console.error("Error fetching customers:", error); // Log the error
        throw new Error('Error fetching customer data. Please try again.'); // Throw an error to handle in the component
    }
};

export default fetchCustomers;
