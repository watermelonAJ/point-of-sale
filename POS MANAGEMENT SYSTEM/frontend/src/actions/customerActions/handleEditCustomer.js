const handleEditCustomer = (customer, setEditMode, setSelectedCustomer, setFirstName, setLastName, setContactNumber, setAddress, setShowModal) => {
    setEditMode(true);
    setSelectedCustomer(customer);
    setFirstName(customer.firstName);
    setLastName(customer.lastName);
    setContactNumber(customer.contactNumber);
    setAddress(customer.address);
    setShowModal(true); // Open modal
};

export default handleEditCustomer;
