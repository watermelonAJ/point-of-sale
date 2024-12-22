import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Ensure Link is imported
import { TransitionGroup, CSSTransition } from "react-transition-group";
import '../styles/App.css';
import SignUp from './SignUp';
import Login from './login'; // Import Login component
import Welcome from './Welcome'; // Import Welcome component
import { UserProvider } from './UserContext'; // Import UserProvider
import Dashboard from './Dashboard'; // Import Dashboard component
import POS from './POS'; // Import Point of Sale component
import AddProduct from './AddProduct'; // Import Add Product component
import AddCustomer from './AddCustomer'; // Import Add Customer component
import AddCategories from './AddCategories'; // Import Add Categories component
import User from './User'; // Import Customers component
import OrderTransactions from './OrderTransactions'; // Import Add Categories component
import OrderDetails from './OrderDetails'; // Import Add Categories component
import GoogleLoginComponent from './GoogleLoginComponent';


function App() {
  return (
    <UserProvider> {/* Wrap Router with UserProvider */}
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout>
               
                <Link to="/signup">
                  <button className="btn signUp">SIGN UP</button>
                </Link>
                <Link to="/login">
                  <button className="btn logIn">LOG IN</button>
                </Link>
                <GoogleLoginComponent />
              </Layout>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <TransitionGroup>
                <CSSTransition classNames="fade" timeout={500}>
                  <SignUp />
                </CSSTransition>
              </TransitionGroup>
            } 
          />
          <Route
            path="/login"
            element={
              <TransitionGroup>
                <CSSTransition classNames="fade" timeout={500}>
                  <Login />
                </CSSTransition>
              </TransitionGroup>
            }
          />
          <Route 
            path="/welcome" // New route for the Welcome page
            element={
              <TransitionGroup>
                <CSSTransition classNames="fade" timeout={500}>
                  <Welcome />
                </CSSTransition>
              </TransitionGroup>
            }
          />
          {/* Sidebar Routes */}
          <Route 
               path="/dashboard" 
              element={
                       <Dashboard />
              } 
          />
          <Route 
            path="/user" 
            element={<User />} 
          />
          <Route 
            path="/pos" 
            element={<POS />} 
          />
          <Route 
            path="/add-product" 
            element={<AddProduct />} 
          />
          <Route 
            path="/add-customer" 
            element={<AddCustomer />} 
          />
          <Route 
            path="/order-transactions" 
            element={<OrderTransactions />} 
          />
          <Route 
            path="/add-categories" 
            element={<AddCategories />} 
          />
          <Route 
            path="/google-login" 
            element={<GoogleLoginComponent />} 
          />
          <Route 
            path="/order-details" 
            element={<OrderDetails />} 
          />
        </Routes>
        
      </Router>
    </UserProvider>
  );
}


// Layout component included in App.jsx
function Layout({ children }) {
  return (
    <div className="container">
      {/* Left Side (Image) */}
      <div className="left-side">
        <img src="coca-cola.jpg" alt="Sari Sari Store" />
      </div>

      {/* Right Side (Login Area) */}
      <div className="right-side">
        <div className="login-logo">
          <img src="logo.png" alt="SariPOS Logo" />
        </div>
        <div className="buttons">
          {children}
        </div>
        <footer>
          <p>Welcome to SariPOS with Simple, Smart, and Sari-Sari POS.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
