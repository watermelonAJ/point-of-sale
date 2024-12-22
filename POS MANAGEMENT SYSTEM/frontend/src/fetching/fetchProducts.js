// fetching/fetchProducts.js
import axios from 'axios';

const fetchProducts = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'http://localhost:5000/api/products', // Adjust the endpoint as needed
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Return the fetched product data
    } catch (error) {
        console.error('Error fetching products:', error); // Log the error
        throw new Error('Error fetching product data. Please try again.'); // Throw an error to handle in the component
    }
};

export default fetchProducts;
