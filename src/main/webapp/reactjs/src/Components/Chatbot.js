import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosConfig';

// Exemples de questions organisés par catégorie
const EXEMPLES = [
    { label: "Prix", question: "Quelle est la voiture la moins chère ?" },
    { label: "Stats", question: "Quel est le prix moyen des voitures ?" },
    { label: "Reco", question: "Quelle voiture recommandez-vous pour un budget de 100 000€ ?" },
    { label: "Comparer", question: "Comparez le Toyota Corolla et le Honda CRV." },
    { label: "Marketing", question: "Faites une description marketing du Honda CRV." },
    { label: "Analyse", question: "Y a-t-il des anomalies de prix dans le catalogue ?" },
];

const BADGE_VARIANT = {
    "Prix": "success",
    "Stats": "info",
    "Reco": "warning",
    "Comparer": "primary",
    "Marketing": "secondary",
    "Analyse": "danger",
};

function Chatbot() {
    const [question, setQuestion] = useState('');
    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    // Auto-scroll vers le bas à chaque nouveau message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [historique, loading]);

    const poserQuestion = async (texte) => {
        const q = texte || question;
        if (!q.trim()) return;

        setLoading(true);
        setQuestion('');
        try {
            const res = await axiosInstance.post('/api/chatbot/ask', { question: q });
            setHistorique(prev => [
                ...prev,
                { question: q, reponse: res.data.reponse }
            ]);
        } catch (error) {
            setHistorique(prev => [
                ...prev,
                { question: q, reponse: "❌ Erreur : impossible de contacter l'assistant. Vérifiez qu'Ollama est démarré." }
            ]);
        }
        setLoading(false);
    };

    const reinitialiser = async () => {
        try {
            await axiosInstance.post('/api/chatbot/reset');
        } catch (_) {}
        setHistorique([]);
    };

    return (
        <Card className="border border-dark bg-dark text-white mt-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <span>
                    <FontAwesomeIcon icon={faRobot} className="me-2 text-info" />
                    <strong>AutoExpert IA</strong>
                    <small className="text-muted ms-2">— Conseiller automobile intelligent</small>
                </span>
                {historique.length > 0 && (
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={reinitialiser}
                        title="Réinitialiser la conversation"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                )}
            </Card.Header>

            <Card.Body>
                {/* Zone des messages */}
                <div style={{ maxHeight: '340px', overflowY: 'auto', marginBottom: '14px' }}>
                    {historique.length === 0 ? (
                        <div>
                            <p className="text-muted text-center mb-3" style={{ fontSize: '13px' }}>
                                Bonjour ! Je suis <strong>AutoExpert</strong>, votre conseiller automobile IA.<br />
                                Posez-moi vos questions sur nos véhicules.
                            </p>
                            {/* Exemples cliquables */}
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                {EXEMPLES.map((ex, i) => (
                                    <Badge
                                        key={i}
                                        bg={BADGE_VARIANT[ex.label]}
                                        style={{ cursor: 'pointer', fontSize: '12px', padding: '6px 10px' }}
                                        onClick={() => poserQuestion(ex.question)}
                                        title={ex.question}
                                    >
                                        {ex.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ) : (
                        historique.map((msg, index) => (
                            <div key={index} className="mb-3">
                                {/* Question de l'utilisateur */}
                                <div className="d-flex justify-content-end mb-1">
                                    <div
                                        className="text-white px-3 py-2"
                                        style={{
                                            background: '#0d6efd',
                                            borderRadius: '12px 12px 0 12px',
                                            maxWidth: '80%',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {msg.question}
                                    </div>
                                </div>
                                {/* Réponse de l'IA */}
                                <div className="d-flex justify-content-start">
                                    <div
                                        className="text-white px-3 py-2"
                                        style={{
                                            background: '#1e2a3a',
                                            border: '1px solid #0dcaf0',
                                            borderRadius: '12px 12px 12px 0',
                                            maxWidth: '85%',
                                            fontSize: '14px',
                                            whiteSpace: 'pre-wrap'
                                        }}
                                    >
                                        <span className="text-info me-1">🤖</span>
                                        {msg.reponse}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="d-flex align-items-center gap-2">
                            <div className="spinner-border spinner-border-sm text-info" role="status" />
                            <small className="text-warning">AutoExpert réfléchit...</small>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Exemples rapides (affichés après le premier message) */}
                {historique.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-2">
                        {EXEMPLES.slice(0, 3).map((ex, i) => (
                            <Badge
                                key={i}
                                bg="secondary"
                                style={{ cursor: 'pointer', fontSize: '11px' }}
                                onClick={() => poserQuestion(ex.question)}
                            >
                                {ex.label}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Zone de saisie */}
                <Form.Group className="d-flex">
                    <Form.Control
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ex : Recommandez une voiture pour 100 000€..."
                        className="bg-dark text-white border-secondary"
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && poserQuestion()}
                        disabled={loading}
                        style={{ fontSize: '14px' }}
                    />
                    <Button
                        variant="info"
                        onClick={() => poserQuestion()}
                        disabled={loading || !question.trim()}
                        className="ms-2"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                </Form.Group>
                <small className="text-muted mt-1 d-block" style={{ fontSize: '11px' }}>
                    Appuyez sur Entrée pour envoyer
                </small>
            </Card.Body>
        </Card>
    );
}

export default Chatbot;