import React, { Component } from 'react';
import { Card, Table, ButtonGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosConfig';
import MyToast from './MyToast';
import ModifierVoitureModal from './ModifierVoitureModal';

export default class VoitureListe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            voitures: [],
            show: false,
            showModal: false,
            selectedVoiture: null
        };
    }

    componentDidMount() {
        this.findAllVoitures();
    }

    findAllVoitures = () => {
        axiosInstance.get("/api/voitures")
            .then(response => {
                const voituresData = response.data._embedded.voitures.map(v => {
                    const selfLink = v._links.self.href;
                    const id = selfLink.substring(selfLink.lastIndexOf('/') + 1);
                    return { ...v, id: parseInt(id) };
                });
                this.setState({ voitures: voituresData });
            })
            .catch(error => console.log("Erreur :", error.message));
    }

    openEditModal = (voiture) => {
        this.setState({ showModal: true, selectedVoiture: voiture });
    }

    closeEditModal = () => {
        this.setState({ showModal: false, selectedVoiture: null });
    }

    handleUpdate = () => {
        this.findAllVoitures();
        this.setState({ show: true });
        setTimeout(() => this.setState({ show: false }), 3000);
    }

    deleteVoiture = (voitureId) => {
        axiosInstance.delete("/api/voitures/" + voitureId)
            .then(response => {
                this.setState({
                    voitures: this.state.voitures.filter(voiture => voiture.id !== voitureId),
                    show: true
                });
                setTimeout(() => this.setState({ show: false }), 3000);
            })
            .catch(error => console.log("Erreur suppression :", error.message));
    };

    render() {
        const { voitures, show } = this.state;

        return (
            <div>
                <div style={{ display: show ? "block" : "none" }}>
                    <MyToast show={show} message="Opération réussie." />
                </div>

                <ModifierVoitureModal
                    show={this.state.showModal}
                    onHide={this.closeEditModal}
                    voiture={this.state.selectedVoiture}
                    onUpdate={this.handleUpdate}
                />

                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <FontAwesomeIcon icon={faList} /> Liste Voitures
                    </Card.Header>
                    <Card.Body>
                        <Table bordered hover striped variant="dark">
                            <thead>
                                <tr className="text-white">
                                    <th className="text-white">Marque</th>
                                    <th className="text-white">Modele</th>
                                    <th className="text-white">Couleur</th>
                                    <th className="text-white">Annee</th>
                                    <th className="text-white">Prix</th>
                                    <th className="text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voitures.length === 0 ? (
                                    <tr align="center">
                                        <td colSpan="6">Aucune Voiture n'est disponible</td>
                                    </tr>
                                ) : (
                                    voitures.map((voiture) => (
                                        <tr key={voiture.id} align="center">
                                            <td>{voiture.marque}</td>
                                            <td>{voiture.modele}</td>
                                            <td>{voiture.couleur}</td>
                                            <td>{voiture.annee}</td>
                                            <td>{voiture.prix}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Button size="sm" variant="outline-primary"
                                                        onClick={() => this.openEditModal(voiture)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>{' '}
                                                    <Button size="sm" variant="outline-danger"
                                                        onClick={() => this.deleteVoiture(voiture.id)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}