import axios from 'axios';

const handleDeleteCategory = async ({
    idCategory,
    nameCategory,
    setCategories,
    setSortedCategories,
    setToastMessage,
    setShowToast,
}) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the category "${nameCategory}"?`);
    if (!confirmDelete) return; // Exit if the user cancels

    try {
        const response = await axios.delete(
            `http://localhost:5000/api/categories/${encodeURIComponent(nameCategory)}`
        );

        if (response.data.message === "Category successfully deleted!") {
            setToastMessage('Category successfully deleted!');
            setShowToast(true);

            // Remove the deleted category from both categories and sortedCategories
            setCategories((prevCategories) => {
                const updatedCategories = prevCategories.filter(
                    (category) => category.idCategory !== idCategory
                );
                setSortedCategories(updatedCategories); // Update sortedCategories too
                return updatedCategories;
            });

            // Hide the toast notification after 3 seconds
            setTimeout(() => setShowToast(false), 3000);
        } else {
            // Handle unexpected responses
            console.error("Delete response:", response.data.message);
            setToastMessage('An unexpected error occurred while deleting the category.');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    } catch (error) {
        console.error("This category cannot be deleted because it is associated with other records. Please ensure all related dependencies are resolved before deleting.", error);

        if (error.response) {
            if (error.response.status === 409) {
                setToastMessage(
                    'This category cannot be deleted because it is associated with other records. Please ensure all related dependencies are resolved before deleting.'
                );
            } else {
                // Display the backend error message if available
                setToastMessage(error.response.data.message || 'An error occurred while trying to delete the category. Please try again.');
            }
        } else {
            // Generic error message for network or unknown issues
            setToastMessage('An error occurred while trying to delete the category. Please try again.');
        }

        setShowToast(true); // Show the toast
        setTimeout(() => setShowToast(false), 2000); // Hide after 3 seconds
    }
};

export default handleDeleteCategory;
