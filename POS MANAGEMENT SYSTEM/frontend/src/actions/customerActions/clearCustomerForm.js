const clearCustomerForm = (setFirstName, setLastName, setContactNumber, setAddress, setSelectedCustomer) => {
    setFirstName('');
    setLastName('');
    setContactNumber('');
    setAddress('');
    setSelectedCustomer(null);
};

export default clearCustomerForm;
