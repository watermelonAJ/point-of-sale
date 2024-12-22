import * as XLSX from 'xlsx';

export const generateTopCustomersReport = async (transactions, setIsModalOpen, setIsDownloadSuccessModalOpen) => {
    // Close the modal immediately
    setIsModalOpen(false);

    const customerData = {};

    for (const transaction of transactions) {
        const customerID = transaction.CustomerID;

        // Skip if the customerID is null (unregistered customer)
       // Check for invalid CustomerID values: null, undefined, empty string, or invalid strings
    if (customerID === undefined || customerID === null || customerID.trim() === "" || customerID === "null" || customerID === "Unregistered") {
        console.log("Skipping transaction with invalid CustomerID:", transaction);
        continue;
    }

        const pointsEarned = transaction.PointsEarned || 0;
        const pointsUsed = transaction.PointsUsed || 0; // Assuming PointsUsed field exists
        const totalAmount = transaction.TotalAmount || 0;

        // Initialize data for the customer if not already present
        if (!customerData[customerID]) {
            customerData[customerID] = {
                customerID,
                totalPointsEarned: 0,
                totalPointsUsed: 0,
                totalAmountSpent: 0,
            };
        }

        // Update aggregated data
        customerData[customerID].totalPointsEarned += pointsEarned;
        customerData[customerID].totalPointsUsed += pointsUsed;
        customerData[customerID].totalAmountSpent += totalAmount;
    }

    // Convert the aggregated data to an array and sort by points earned or total amount spent
    const sortedData = Object.values(customerData).sort((a, b) => {
        return b.totalPointsEarned - a.totalPointsEarned || b.totalAmountSpent - a.totalAmountSpent;
    });

    // Prepare the data for the Excel file, including total remaining points
    const data = sortedData.map((customer, index) => {
        const totalRemainingPoints = customer.totalPointsEarned - customer.totalPointsUsed;
        
        return {
            Rank: index + 1,
            CustomerID: customer.customerID,
            TotalPointsEarned: customer.totalPointsEarned.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            TotalPointsUsed: customer.totalPointsUsed.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            TotalRemainingPoints: totalRemainingPoints.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),  // Add remaining points
            TotalAmountSpent: customer.totalAmountSpent.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        };
    });

    // Create a workbook and add the data to it
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Top Customers');

    // Download the Excel file
    XLSX.writeFile(wb, 'Top_Customers_Report.xlsx');

    // Show the "Download Successfully" modal after 3 seconds
    setTimeout(() => {
        setIsDownloadSuccessModalOpen(true);
    }, 500);
};
