// actions/handleDeleteCustomer.js
import axios from 'axios';

const handleDeleteCustomer = async ({
    customerID,
    setToastMessage,
    setShowToast,
    setCustomers
}) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) {
        return; // Exit if the user cancels
    }

    try {
        // Sending DELETE request to the server
        const response = await axios.delete(`http://localhost:5000/api/customers/delete/${customerID}`);

        if (response.status === 200) {
            // Show success message in toast
            setToastMessage(response.data.message);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds

            // Remove the deleted customer from the list
            setCustomers((prevCustomers) =>
                prevCustomers.filter((customer) => customer.customerID !== customerID)
            );
        }
    } catch (error) {
        console.error("Error deleting customer:", error);
        // Show error message in toast
        setToastMessage("This customer cannot be deleted because it is associated with other records.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000); // Hide toast after 3 seconds
    }
};

export default handleDeleteCustomer;
