const fetchOrderTransactions = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/orderTransactions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("Response from server:", response);

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        const result = await response.json();
        console.log("Response data:", result);

        return result; // Return the result to be used in the component
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

export default fetchOrderTransactions;
