import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import Sidebar from './Sidebar';
import { UserContext } from './UserContext';
import '../styles/Dashboard.css';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
    const { user } = useContext(UserContext);

    // States for stat cards
    const [totalCategories, setTotalCategories] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalCustomer, setTotalCustomer] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    // State for pie chart data
    const [categorySalesData, setCategorySalesData] = useState([]);

    // Fetch category sales data for the pie chart
    useEffect(() => {
        const fetchCategorySales = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/sales/category-sales');
                setCategorySalesData(response.data); // Set the category sales data
            } catch (error) {
                console.error('Error fetching category sales data:', error);
            }
        };

        fetchCategorySales();
    }, []);

    const [userSalesData, setUserSalesData] = useState([]);

    // Fetch user sales data for the bar chart
    useEffect(() => {
        const fetchUserSalesData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/sales/user-sales', {
                    params: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
                });
                setUserSalesData(response.data); // Update state with fetched data
            } catch (error) {
                console.error('Error fetching user sales data:', error);
            }
        };
    
        fetchUserSalesData();
    }, []);

    
    // Fetch data for stat cards
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, productsRes, customersRes, ordersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/categories'),
                    axios.get('http://localhost:5000/api/products'),
                    axios.get('http://localhost:5000/api/customers'),
                    axios.get('http://localhost:5000/api/transactions'),
                ]);

                setTotalCategories(categoriesRes.data.length);
                setTotalProducts(productsRes.data.length);
                setTotalCustomer(customersRes.data.length);
                setTotalOrders(ordersRes.data.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Fetch total sales when the component mounts
        const fetchTotalSales = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/transactions/total-sales');
                setTotalSales(response.data.totalSales); // Update state with the total sales
            } catch (error) {
                console.error("Error fetching total sales:", error);
            }
        };

        fetchTotalSales(); // Call the function to fetch the total sales
    }, []);

   // Prepare data for the pie chart
const pieData = {
    labels: categorySalesData.map((item) => item.nameCategory), // Category names
    datasets: [
        {
            label: 'Sales by Category',
            data: categorySalesData.map((item) => item.totalSales || 0), // Total sales values
            backgroundColor: [
                '#FF6384',  // Red
                '#FF9F40',  // Orange
                '#FFCD56',  // Yellow
                '#4BC0C0',  // Teal
                '#36A2EB',  // Blue
                '#9966FF',  // Purple
                '#FF665A',  // Coral Red
                '#FFCA3A',  // Mustard Yellow
                '#32CD32',  // Lime Green
                '#00BFFF',  // Deep Sky Blue
                '#8A2BE2',  // Blue Violet
                '#FF6347',  // Tomato Red
                '#ADFF2F',  // Green Yellow
                '#FFD700',  // Gold
                '#20B2AA',  // Light Sea Green
                '#FF4500',  // Orange Red
            ], // Unique colors for the pie chart
            hoverBackgroundColor: [
                '#FF6384',  // Red
                '#FF9F40',  // Orange
                '#FFCD56',  // Yellow
                '#4BC0C0',  // Teal
                '#36A2EB',  // Blue
                '#9966FF',  // Purple
                '#FF665A',  // Coral Red
                '#FFCA3A',  // Mustard Yellow
                '#32CD32',  // Lime Green
                '#00BFFF',  // Deep Sky Blue
                '#8A2BE2',  // Blue Violet
                '#FF6347',  // Tomato Red
                '#ADFF2F',  // Green Yellow
                '#FFD700',  // Gold
                '#20B2AA',  // Light Sea Green
                '#FF4500',  // Orange Red
            ],
        },
    ],
};

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'left', // Change legend position to the left
                labels: {
                    font: {
                        size: 10, // Adjust font size of labels in the legend
                    },
                    padding: 5, // Optional: space between legend items
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const { label, raw } = tooltipItem;
                        return `${label}: ₱${raw.toFixed(2)}`; // Formatting tooltip value
                    },
                },
            },
        },
        layout: {
            padding: 20, // Adjust padding around the pie chart
        },
        maintainAspectRatio: false, // Allow resizing of chart
    };
    
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                {/* Stat Cards Section */}
                <div className="stat-cards-container">
                    <div className="stat-card">
                        <h2>{totalCategories}</h2>
                        <p>Total Categories</p>
                    </div>
                    <div className="stat-card">
                        <h2>{totalOrders}</h2>
                        <p>Orders</p>
                    </div>
                    <div className="stat-card">
                        <h2>{totalProducts}</h2>
                        <p>Total Products</p>
                    </div>
                    <div className="stat-card">
                        <h2>{totalCustomer}</h2>
                        <p>Registered Customers</p>
                    </div>
                    <div className="stat-card">
                        <h2>
                            {totalSales
                                ? `₱${parseFloat(totalSales)
                                    .toFixed(2)
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                                : '₱0.00'}
                        </h2>
                        <p>Overall Sales</p>
                    </div>
                </div>
                
    
                {/* Pie Chart Section */}
                <div className="chart-container">
                    <h3>Sales by Category</h3>
                    {categorySalesData.length > 0 ? (
                        <div className="pie-chart-wrapper">
                            <Pie data={pieData} options={options} height={300} width={300} />
                        </div>
                    ) : (
                        <p>Loading chart data...</p>
                    )}
                    
                </div>
            </div>
        </div>
    );
    
}

export default Dashboard;
