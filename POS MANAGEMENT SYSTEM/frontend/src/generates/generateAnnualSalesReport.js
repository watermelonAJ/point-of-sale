import * as XLSX from 'xlsx'; // Ensure XLSX is imported

export const generateAnnualSalesReport = (transactions, setIsDownloadSuccessModalOpen, setIsSalesModalOpen) => {
   

    // Group transactions by Year
    const salesData = {};

    transactions.forEach((transaction) => {
        const transactionYear = transaction.TransactionYear; // Group by Year

        if (!salesData[transactionYear]) {
            salesData[transactionYear] = {
                totalSales: 0,
                cashPayments: 0,
                pointsPayments: 0,
            };
        }

        const totalAmount = transaction.TotalAmount;
        const payAmount = transaction.PayAmount;
        const pointsUsed = transaction.PointsUsed;

        // Sum the values for each year
        salesData[transactionYear].totalSales += totalAmount;
        salesData[transactionYear].cashPayments += payAmount;
        salesData[transactionYear].pointsPayments += pointsUsed;
    });

    // Convert the sales data into a format suitable for Excel
    const salesReport = Object.keys(salesData).map((year) => ({
        'Transaction Year': year,
        'Total Sales': `₱${salesData[year].totalSales.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        'Cash Payments': `₱${salesData[year].cashPayments.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        'Points Payments': `₱${salesData[year].pointsPayments.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    }));

    // Create a new workbook and add the data to it
    const ws = XLSX.utils.json_to_sheet(salesReport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Annual Sales Report');

    // Download the Excel file
    XLSX.writeFile(wb, 'Annual_Sales_Report.xlsx');

    // Show the "Download Successfully" modal after 3 seconds
    setTimeout(() => {
        setIsDownloadSuccessModalOpen(true);
    }, 500);

     // Close the "Sales Reports" modal
     setIsSalesModalOpen(true);
};
