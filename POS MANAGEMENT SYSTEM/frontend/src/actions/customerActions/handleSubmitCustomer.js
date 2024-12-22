// actions/handleSubmitCustomer.js

import axios from 'axios';

const handleSubmitCustomer = async ({
    firstName,
    lastName,
    contactNumber,
    address,
    user,
    editMode,
    selectedCustomer,
    setToastMessage,
    setShowToast,
    setCustomers,
    setSelectedCustomer,
    toggleModal,
    customers,
    setFirstName,
    setLastName,
    setContactNumber,
    setAddress
}) => {
    const action = editMode ? "edit this customer" : "add this customer";
    const confirmAction = window.confirm(`Are you sure you want to ${action}?`);

    if (!confirmAction) {
        return; // Exit the function if the user cancels
    }

    try {
        const newCustomer = {
            firstName,
            lastName,
            number: contactNumber,
            address,
            ...(editMode
                ? {
                      updatedBy: `${user.firstName} ${user.lastName}`,
                      updatedRole: user.role,
                      updatedDate: new Date().toISOString(),
                  }
                : {
                      fkuserID: user.userID,
                      registeredBy: `${user.firstName} ${user.lastName}`,
                      role: user.role,
                      dateRegistered: new Date().toISOString(),
                      payment: 50,
                      contactNumber,
                  }),
        };

        const response = editMode
            ? await axios.put(`http://localhost:5000/api/customers/${selectedCustomer.customerID}`, newCustomer)
            : await axios.post('http://localhost:5000/api/customers/add', newCustomer);

        const message = response.data.message;
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Hide the toast after 3 seconds

        if (response.status === 200) {
            if (editMode) {
                // Update customer data in the list if in edit mode
                setCustomers((prev) =>
                    prev.map((customer) =>
                        customer.customerID === selectedCustomer.customerID
                            ? { ...customer, contactNumber, ...newCustomer } // Update only the contact number and other details
                            : customer
                    )
                );
            } else {
                // Add new customer to the list if in add mode
                setCustomers([response.data.customer, ...customers]);
            }
            toggleModal(); // Close the modal
        }
    } catch (error) {
        console.error(editMode ? "Error updating customer:" : "Error adding customer:", error?.message || error);
        setToastMessage('An error occurred. Please try again.');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
    }
};

export default handleSubmitCustomer;
