// fetching/fetchTransactions.js
const fetchTransactions = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/transactions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        const result = await response.json();
        return result; // Return the fetched data
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return []; // Return an empty array in case of an error
    }
};

export default fetchTransactions;
