// actions/productActions/handleSubmitProduct.js
import axios from 'axios';

const handleSubmitProduct = async ({
    productName,
    productPrice,
    productQuantity,
    productUnit,
    fkCategory,
    user,
    setProducts,
    setToastMessage,
    setShowToast,
    setProductName,
    setProductPrice,
    setProductQuantity,
    setProductUnit,
    setFkCategory
    
}) => {
    const customUnit = productUnit === 'other' ? e.target[3].value : productUnit;
    const currentDate = new Date().toISOString();

    const productData = {
        productName,
        productPrice: parseFloat(productPrice.replace(/₱\s?/, '').replace(/[^0-9.]/g, '')),
        productQuantity,
        productUnit: customUnit,
        fkCategory,
        addedBy: `${user.firstName} ${user.lastName}`,
        role: user.role,
        dateAdded: currentDate,
        fkuserID: user.userID,
        

    };

    const confirmAdd = window.confirm('Do you want to add this product?');
    if (!confirmAdd) return;

    try {
        // Sending the POST request to add the product
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:5000/api/products/add',
            headers: {
                'Content-Type': 'application/json',
            },
            data: productData,  // The body data to be sent with the POST request
        });

        if (response.status === 201) { // Ensure status 201 is handled as success
            console.log(response.data.message);

            // Fetch the updated list of products
            const updatedResponse = await axios({
                method: 'GET',
                url: 'http://localhost:5000/api/products/', // Corrected endpoint
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setProducts(updatedResponse.data);

            // Reset form values
            setProductName('');
            setProductPrice('');
            setProductQuantity('');
            setProductUnit('');
            setFkCategory('');

            setToastMessage('Product added successfully!');
            setShowToast(true);
        } else {
            throw new Error('Unexpected response status');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        setToastMessage('There was an error adding the product.');
        setShowToast(true);
    }
};

export default handleSubmitProduct;
