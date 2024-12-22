// actions/handleEditSubmitCategory.js
import axios from 'axios';

const handleEditSubmitCategory = async ({
    editCategoryData,
    user,
    setCategories,
    setSortedCategories,
    setToastMessage,
    setShowToast,
    setIsEditModalVisible
}) => {
    const confirmEdit = window.confirm('Do you want to save the changes?');
    if (!confirmEdit) return;

    try {
        const response = await axios({
            method: 'PUT',
            url: `http://localhost:5000/api/categories/${editCategoryData.idCategory}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                ...editCategoryData, // Send updated category data
                updatedBy: `${user.firstName} ${user.lastName}`, // Add user details
                updatedRole: user.role,
                dateUpdated: new Date().toISOString(),
            },
        });

        if (response.data.message === 'Category successfully updated!') {
            setToastMessage('Category updated successfully!');
            setShowToast(true);

            // Update the categories list with the edited category
            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category.idCategory === editCategoryData.idCategory ? { ...category, ...editCategoryData } : category
                )
            );

            // Update the sorted categories as well
            setSortedCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category.idCategory === editCategoryData.idCategory ? { ...category, ...editCategoryData } : category
                )
            );

            // Close the modal and reset the edit state
            setIsEditModalVisible(false);

            // Hide the toast notification after 3 seconds
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        } else {
            // Handle any other response or error messages
            setToastMessage('Failed to update category.');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    } catch (error) {
        console.error('Error updating category:', error);
        setToastMessage('Error updating category. Please try again.');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }
};

export default handleEditSubmitCategory;
