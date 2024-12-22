import * as XLSX from 'xlsx'; // Make sure XLSX is imported

export const generateDailySalesReport = (transactions, setIsDownloadSuccessModalOpen, setIsSalesModalOpen) => {
    // Group transactions by date (Month/Date/Year)
    const salesData = {};

    transactions.forEach((transaction) => {
        const transactionDate = `${transaction.TransactionMonth} ${transaction.TransactionDay}, ${transaction.TransactionYear}`;

        if (!salesData[transactionDate]) {
            salesData[transactionDate] = {
                totalSales: 0,
                cashPayments: 0,
                pointsPayments: 0,
            };
        }

        const totalAmount = transaction.TotalAmount || 0;
        const payAmount = transaction.PayAmount || 0;
        const pointsUsed = transaction.PointsUsed || 0;

        salesData[transactionDate].totalSales += totalAmount;
        salesData[transactionDate].cashPayments += payAmount;
        salesData[transactionDate].pointsPayments += pointsUsed;
    });

    // Convert the sales data to a format suitable for Excel
    const salesReport = Object.keys(salesData).map((date) => ({
        'Transaction Date': date,
        'Total Sales': `₱${salesData[date].totalSales.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        'Cash Payments': `₱${salesData[date].cashPayments.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        'Points Payments': `₱${salesData[date].pointsPayments.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    }));

    // Sort the sales report by date in descending order (most recent first)
    salesReport.sort((a, b) => {
        // Convert the 'Transaction Date' string to a Date object for sorting
        const dateA = new Date(a['Transaction Date']);
        const dateB = new Date(b['Transaction Date']);
        return dateB - dateA; // Sort in descending order
    });

    // Create a new workbook and add the data to it
    const ws = XLSX.utils.json_to_sheet(salesReport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Sales Report');

    // Download the Excel file
    XLSX.writeFile(wb, 'Daily_Sales_Report.xlsx');

    // Close the "Sales Reports" modal
    setIsSalesModalOpen(true);

    // Show the "Download Successfully" modal after 3 seconds
    setTimeout(() => {
        setIsDownloadSuccessModalOpen(true);
    }, 500);
};
