import React, { useState } from 'react';
import { Navbar, Nav, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faPlus, faList, faSignOutAlt, faRobot } from '@fortawesome/free-solid-svg-icons';
import { logout, isAuthenticated } from '../api/authService';
import Chatbot from './Chatbot';

function NavigationBar() {
    const navigate = useNavigate();
    const [showChatbot, setShowChatbot] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Link to={""} className="navbar-brand">
                    <FontAwesomeIcon icon={faCar} size="lg" />{' '}
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {isAuthenticated() && (
                            <>
                                <Link to={"add"} className="nav-link">
                                    <FontAwesomeIcon icon={faPlus} /> Ajouter
                                </Link>
                                <Link to={"list"} className="nav-link">
                                    <FontAwesomeIcon icon={faList} /> Liste
                                </Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {isAuthenticated() && (
                            <>
                                <Button 
                                    variant="outline-info" 
                                    size="sm" 
                                    onClick={() => setShowChatbot(true)}
                                    className="me-2"
                                >
                                    <FontAwesomeIcon icon={faRobot} /> Assistant IA
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            {/* Modal Chatbot */}
            <Modal 
                show={showChatbot} 
                onHide={() => setShowChatbot(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton style={{ backgroundColor: '#343a40', color: 'white', borderBottom: '1px solid #495057' }}>
                    <Modal.Title>
                        <FontAwesomeIcon icon={faRobot} className="text-info me-2" />
                        AutoExpert IA - Assistant Automobile
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#343a40', padding: 0 }}>
                    <Chatbot />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default NavigationBar;