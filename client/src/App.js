import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import WhyChooseUs from './pages/WhyChooseUs';
import RequestDemo from './pages/RequestDemo';
import PlaceOrder from './pages/PlaceOrder';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import MyAccount from './pages/MyAccount';
import Settings from './pages/Settings';
import MyOrders from './pages/MyOrders';
import Notifications from './pages/Notifications';
import ContactDeveloper from './pages/ContactDeveloper';
import Payments from './pages/Payments';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AuthModal />
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            } />
            <Route path="/services" element={
              <>
                <Navbar />
                <Services />
                <Footer />
              </>
            } />
            <Route path="/why-choose-us" element={
              <>
                <Navbar />
                <WhyChooseUs />
                <Footer />
              </>
            } />
            <Route path="/request-demo" element={
              <>
                <Navbar />
                <RequestDemo />
                <Footer />
              </>
            } />
            <Route path="/place-order" element={
              <>
                <Navbar />
                <PlaceOrder />
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            } />

            {/* User Profile Routes */}
            <Route path="/my-account" element={
              <>
                <Navbar />
                <MyAccount />
                <Footer />
              </>
            } />
            <Route path="/settings" element={
              <>
                <Navbar />
                <Settings />
                <Footer />
              </>
            } />
            <Route path="/my-orders" element={
              <>
                <Navbar />
                <MyOrders />
                <Footer />
              </>
            } />
            <Route path="/notifications" element={
              <>
                <Navbar />
                <Notifications />
                <Footer />
              </>
            } />
            <Route path="/contact-developer" element={
              <>
                <Navbar />
                <ContactDeveloper />
                <Footer />
              </>
            } />
            <Route path="/payments" element={
              <>
                <Navbar />
                <Payments />
                <Footer />
              </>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
