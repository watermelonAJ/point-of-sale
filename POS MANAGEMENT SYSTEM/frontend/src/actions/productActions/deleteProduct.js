import axios from 'axios';

// Function to handle product deletion
const handleDelete = async (sku, setToastMessage, setShowToast, setProducts) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?'); // Confirm before deleting
    if (!confirmDelete) return;

    try {
        // Send DELETE request to the server
        const response = await axios.delete(`http://localhost:5000/api/products/delete/${sku}`);

        if (response.status === 200) {
            // Show success message in toast
            setToastMessage('Product deleted successfully!');
            setShowToast(true);

            // Refresh product list after deletion
            const updatedResponse = await axios.get('http://localhost:5000/api/products');
            setProducts(updatedResponse.data);

            // Hide the toast after 3 seconds
            setTimeout(() => setShowToast(false), 3000);
        }
    } catch (error) {
        console.error('Error deleting product:', error);

        // Show error message in toast
        setToastMessage('This customer cannot be deleted because it is associated with other records.');
        setShowToast(true);

        // Hide the toast after 3 seconds
        setTimeout(() => setShowToast(false), 2000);
    }
};

export default handleDelete;
