import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { login } from '../api/authService';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('admin');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            await login(email, password);
            navigate('/home');  // ← Redirige vers /home après connexion
        } catch (err) {
            setError('Identifiants invalides');
        }
    };

    return (
        <Card className="border border-dark bg-dark text-white" 
              style={{ maxWidth: '400px', margin: '100px auto' }}>
            <Card.Header>
                <FontAwesomeIcon icon={faSignInAlt} /> Connexion
            </Card.Header>
            <Card.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-dark text-white"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-dark text-white"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100">
                        <FontAwesomeIcon icon={faSignInAlt} /> Se connecter
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default Login;