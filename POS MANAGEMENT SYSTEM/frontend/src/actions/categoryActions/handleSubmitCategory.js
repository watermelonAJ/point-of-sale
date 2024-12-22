// actions/handleSubmitCategory.js
import axios from 'axios';

const handleSubmitCategory = async ({
    nameCategory,
    descriptionCategory,
    dateCreated,
    user,
    setCategories,
    setSortedCategories,
    setToastMessage,
    setShowToast,
    setNameCategory,
    setDescriptionCategory,
    setShowModal,
    setErrorMessage
}) => {
    // Validate input fields
    if (nameCategory.trim() === '' || descriptionCategory.trim() === '') {
        setErrorMessage('Please fill out both the Category Name and Description.');
        return;
    }
    

    const confirmAdd = window.confirm("Do you want to add this category?");
    if (!confirmAdd) return;

    try {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:5000/api/categories',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                nameCategory,
                descriptionCategory,
                dateCreated: new Date().toISOString(),
                addedBy: user.firstName + ' ' + user.lastName,
                role: user.role,
            },
        });

        // Handle different response messages
        if (response.data.message === "Category successfully added!") {
            setToastMessage('Category added successfully!');
            setShowToast(true);

            // Update both categories and sortedCategories
            setCategories((prevCategories) => {
                const updatedCategories = [
                    {
                        nameCategory,
                        descriptionCategory,
                        dateCreated,
                        addedBy: user.firstName + ' ' + user.lastName,
                        role: user.role,
                    },
                    ...prevCategories,
                ];
                setSortedCategories(updatedCategories); // Update sortedCategories as well
                return updatedCategories;
            });

            // Clear input fields
            setNameCategory('');
            setDescriptionCategory('');
            setShowModal(false); // Close the modal

            // Hide the toast notification after 3 seconds
            setTimeout(() => setShowToast(false), 3000);
        } else if (response.data.message === "Category already exists.") {
            setToastMessage('Alert: The category name already exists. Please choose a different name to avoid duplication.');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    } catch (error) {
        setErrorMessage('Error adding category. Please try again.');
        console.error("Error adding category:", error);
    }
};

export default handleSubmitCategory;
