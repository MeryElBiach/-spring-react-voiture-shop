import React, { Component } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export default class ModifierVoitureModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            marque: '',
            modele: '',
            couleur: '',
            immatricule: '',
            annee: '',
            prix: ''
        };
    }

    // Charge les données quand la modale s'ouvre
    componentDidUpdate(prevProps) {
        if (this.props.voiture && prevProps.voiture !== this.props.voiture) {
            this.setState({
                marque: this.props.voiture.marque || '',
                modele: this.props.voiture.modele || '',
                couleur: this.props.voiture.couleur || '',
                immatricule: this.props.voiture.immatricule || '',
                annee: this.props.voiture.annee || '',
                prix: this.props.voiture.prix || ''
            });
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const voitureModifiee = {
            marque: this.state.marque,
            modele: this.state.modele,
            couleur: this.state.couleur,
            immatricule: this.state.immatricule,
            annee: this.state.annee,
            prix: this.state.prix
        };

        axios.put(`http://localhost:8080/api/voitures/${this.props.voiture.id}`, voitureModifiee)
            .then(response => {
                this.props.onHide();
                this.props.onUpdate();
            })
            .catch(error => {
                console.log("Erreur modification :", error.message);
            });
    }

    render() {
        const { show, onHide, voiture } = this.props;
        const { marque, modele, couleur, immatricule, annee, prix } = this.state;

        return (
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#343a40', color: 'white', borderBottom: '1px solid #495057' }}>
<Modal.Title>
    <FontAwesomeIcon icon={faEdit} /> Modifier Voiture
</Modal.Title>
                </Modal.Header>
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Body style={{ backgroundColor: '#343a40', color: 'white' }}>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Marque</Form.Label>
                                <Form.Control
                                    required
                                    name="marque"
                                    type="text"
                                    value={marque}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                    placeholder="Marque"
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Modele</Form.Label>
                                <Form.Control
                                    required
                                    name="modele"
                                    type="text"
                                    value={modele}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                    placeholder="Modele"
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mt-3">
                            <Form.Group as={Col}>
                                <Form.Label>Couleur</Form.Label>
                                <Form.Control
                                    required
                                    name="couleur"
                                    type="text"
                                    value={couleur}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                    placeholder="Couleur"
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Immatricule</Form.Label>
                                <Form.Control
                                    required
                                    name="immatricule"
                                    type="text"
                                    value={immatricule}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                    placeholder="Immatricule"
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mt-3">
                            <Form.Group as={Col}>
                                <Form.Label>Annee</Form.Label>
                                <Form.Control
                                    required
                                    name="annee"
                                    type="number"
                                    value={annee}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                    placeholder="Annee"
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Prix</Form.Label>
                                <Form.Control
                                    required
                                    name="prix"
                                    type="number"
                                    value={prix}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                    placeholder="Prix"
                                />
                            </Form.Group>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: '#343a40', borderTop: '1px solid #495057' }}>
                        <Button variant="secondary" onClick={onHide}>
                            <FontAwesomeIcon icon={faTimes} /> Annuler
                        </Button>
                        <Button variant="success" type="submit">
                            <FontAwesomeIcon icon={faSave} /> Enregistrer
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}