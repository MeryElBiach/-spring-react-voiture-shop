import React, { Component } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosConfig';
import MyToast from './MyToast';

export default class Voiture extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.voitureChange = this.voitureChange.bind(this);
        this.submitVoiture = this.submitVoiture.bind(this);
    }

    initialState = {
        marque: '',
        modele: '',
        couleur: '',
        immatricule: '',
        prix: '',
        annee: ''
    }

    resetVoiture = () => {
        this.setState(() => this.initialState);
    }

    voitureChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    submitVoiture = event => {
        event.preventDefault();

        const voiture = {
            marque: this.state.marque,
            modele: this.state.modele,
            couleur: this.state.couleur,
            immatricule: this.state.immatricule,
            annee: this.state.annee,
            prix: this.state.prix
        };

        axiosInstance.post("/api/voitures", voiture)
            .then(response => {
                console.log("Voiture ajoutée :", response.data);
                this.setState({ show: true, message: "Voiture ajoutée avec succès !" });
                setTimeout(() => this.setState({ show: false }), 3000);
                this.setState(() => this.initialState);
            })
            .catch(error => {
                console.log("Erreur :", error.message);
                this.setState({ show: true, message: "Erreur lors de l'ajout !" });
                setTimeout(() => this.setState({ show: false }), 3000);
            });
    }

    render() {
        const { marque, modele, couleur, immatricule, prix, annee } = this.state;

        return (
            <div>
                <div style={{ display: this.state.show ? "block" : "none" }}>
                    <MyToast show={this.state.show} message={this.state.message} />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <FontAwesomeIcon icon={faPlusSquare} /> Ajouter une Voiture
                    </Card.Header>
                    <Form onSubmit={this.submitVoiture} onReset={this.resetVoiture} id="VoitureFormId">
                        <Card.Body>
                            <Row>
                                <Form.Group as={Col} controlId="formGridMarque">
                                    <Form.Label>Marque</Form.Label>
                                    <Form.Control required name="marque" type="text" value={marque} autoComplete="off"
                                        onChange={this.voitureChange} className={"bg-dark text-white"}
                                        placeholder="Entrez Marque Voiture" />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridModele">
                                    <Form.Label>Modele</Form.Label>
                                    <Form.Control required name="modele" type="text" value={modele} autoComplete="off"
                                        onChange={this.voitureChange} className={"bg-dark text-white"}
                                        placeholder="Entrez Modele Voiture" />
                                </Form.Group>
                            </Row>
                            <Row className="mt-3">
                                <Form.Group as={Col} controlId="formGridCouleur">
                                    <Form.Label>Couleur</Form.Label>
                                    <Form.Control required name="couleur" type="text" value={couleur} autoComplete="off"
                                        onChange={this.voitureChange} className={"bg-dark text-white"}
                                        placeholder="Entrez Couleur Voiture" />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridImmatricule">
                                    <Form.Label>Immatricule</Form.Label>
                                    <Form.Control required name="immatricule" type="text" value={immatricule} autoComplete="off"
                                        onChange={this.voitureChange} className={"bg-dark text-white"}
                                        placeholder="Entrez Immatricule Voiture" />
                                </Form.Group>
                            </Row>
                            <Row className="mt-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Annee</Form.Label>
                                    <Form.Control required name="annee" type="number" value={annee} autoComplete="off"
                                        onChange={this.voitureChange} className={"bg-dark text-white"}
                                        placeholder="Entrez Annee" />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Prix</Form.Label>
                                    <Form.Control required name="prix" type="number" value={prix} autoComplete="off"
                                        onChange={this.voitureChange} className={"bg-dark text-white"}
                                        placeholder="Entrez Prix" />
                                </Form.Group>
                            </Row>
                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon icon={faSave} /> Submit
                            </Button>{' '}
                            <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo} /> Reset
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        );
    }
}