import React from 'react';

class Bienvenue extends React.Component {
    render() {
        return (
            <div style={{ 
                backgroundColor: '#343a40', 
                color: 'white', 
                padding: '30px', 
                borderRadius: '8px'
            }}>
                <h1>Bienvenue au Magasin des Voitures</h1>
                <blockquote className="blockquote mb-0">
                    <p>Le meilleur de nos voitures est exposé près de chez vous</p>
                    <footer className="blockquote-footer" style={{ color: '#adb5bd' }}>
                        Master MIOLA
                    </footer>
                </blockquote>
            </div>
        );
    }
}

export default Bienvenue;