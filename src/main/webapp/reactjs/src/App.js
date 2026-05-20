import React from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar';
import Bienvenue from './Components/Bienvenue';
import Footer from './Components/Footer';
import Voiture from './Components/Voiture';
import VoitureListe from './Components/VoitureListe';
import Login from './Components/Login';
import { isAuthenticated } from './api/authService';


// Protège les routes
function PrivateRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Cache la Navbar sur la page Login
function AppContent() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <>
            {!isLoginPage && <NavigationBar />}
            <Container>
                <Row>
                    <Col lg={12} style={{ marginTop: "20px" }}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/home" exact element={<PrivateRoute><Bienvenue /></PrivateRoute>} />
                            <Route path="/add" element={<PrivateRoute><Voiture /></PrivateRoute>} />
                            <Route path="/edit/:id" element={<PrivateRoute><Voiture /></PrivateRoute>} />
                            <Route path="/list" element={<PrivateRoute><VoitureListe /></PrivateRoute>} />
<Route path="/" exact element={<Navigate to="/login" />} />
                        </Routes>
                    </Col>
                </Row>
            </Container>
            {!isLoginPage && <Footer />}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;