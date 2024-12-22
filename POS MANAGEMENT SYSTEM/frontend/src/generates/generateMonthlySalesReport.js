import * as XLSX from 'xlsx'; // Make sure XLSX is imported
export const generateMonthlySalesReport = (transactions, setIsDownloadSuccessModalOpen, setIsSalesModalOpen) => {
    

    // Group transactions by month/year (e.g., January 2024)
    const salesData = {};

    transactions.forEach((transaction) => {
        const transactionDate = `${transaction.TransactionMonth} ${transaction.TransactionYear}`;

        if (!salesData[transactionDate]) {
            salesData[transactionDate] = {
                totalSales: 0,
                cashPayments: 0,
                pointsPayments: 0,
            };
        }

        const totalAmount = transaction.TotalAmount;
        const payAmount = transaction.PayAmount;
        const pointsUsed = transaction.PointsUsed;

        salesData[transactionDate].totalSales += totalAmount;
        salesData[transactionDate].cashPayments += payAmount;
        salesData[transactionDate].pointsPayments += pointsUsed;
    });

    // Convert the sales data to a format suitable for Excel
    const salesReport = Object.keys(salesData).map((date) => ({
        'Transaction Month/Year': date,
        'Total Sales': `₱${salesData[date].totalSales.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        'Cash Payments': `₱${salesData[date].cashPayments.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        'Points Payments': `₱${salesData[date].pointsPayments.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    }));

    // Create a new workbook and add the data to it
    const ws = XLSX.utils.json_to_sheet(salesReport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Sales Report');

    // Download the Excel file
    XLSX.writeFile(wb, 'Monthly_Sales_Report.xlsx');

    // Show the "Download Successfully" modal after 3 seconds
    setTimeout(() => {
        setIsDownloadSuccessModalOpen(true);
    }, 500);

    // Close the "Sales Reports" modal
    setIsSalesModalOpen(true);
};
