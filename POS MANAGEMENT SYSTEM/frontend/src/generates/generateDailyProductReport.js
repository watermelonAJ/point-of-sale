import * as XLSX from 'xlsx';

export const generateDailyProductReport = (transactions, setIsDownloadSuccessModalOpen) => {
    const productData = {};

    transactions.forEach((transaction) => {
        const { SKU, ProductName, Quantity, TransactionDay, TransactionMonth, TransactionYear } = transaction;

        const transactionDate = `${TransactionMonth} ${TransactionDay}, ${TransactionYear}`;

        if (!productData[transactionDate]) {
            productData[transactionDate] = [];
        }

        const existingProduct = productData[transactionDate].find(product => product.ProductSKU === SKU);

        if (existingProduct) {
            existingProduct.QuantitySold += Quantity;
        } else {
            productData[transactionDate].push({
                ProductSKU: SKU,
                ProductName,
                QuantitySold: Quantity,
            });
        }
    });

    // Convert the product data to a format suitable for Excel
    const reportData = [];
    Object.keys(productData).forEach((date) => {
        productData[date].forEach((product) => {
            reportData.push({
                'Transaction Date': date,
                'Product SKU': product.ProductSKU,
                'Product Name': product.ProductName,
                'Quantity Sold': product.QuantitySold,
            });
        });
    });

    // Sort the report data by 'Transaction Date' in ascending order
    reportData.sort((a, b) => {
        // Convert 'Transaction Date' string to a Date object for sorting
        const dateA = new Date(a['Transaction Date']);
        const dateB = new Date(b['Transaction Date']);
        return dateB - dateA; // Sort in ascending order (oldest to newest)
    });

    // Create a new workbook and add the data to it
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Product Report');

    // Download the Excel file
    XLSX.writeFile(wb, `Daily_Product_Report_${new Date().toLocaleDateString('en-US')}.xlsx`);

    // Show the "Download Successfully" modal after 3 seconds
    setTimeout(() => {
        setIsDownloadSuccessModalOpen(true);
    }, 900);
};
