// fetching/fetchCategories.js
import axios from 'axios';

const fetchCategories = async () => {
    try {
        // Sending a GET request to fetch categories
        const response = await axios({
            method: 'GET',
            url: 'http://localhost:5000/api/categories',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data; // Return the fetched categories
    } catch (error) {
        console.error("Error fetching categories:", error); // Log any errors
        return []; // Return an empty array in case of an error
    }
};

export default fetchCategories;
