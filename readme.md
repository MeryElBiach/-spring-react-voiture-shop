# Gestion de Magasin de Voitures

Application Full Stack de gestion d'un magasin de voitures avec assistant IA intégré.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18 + React Bootstrap |
| Backend | Spring Boot 3.4.5 + Java 21 |
| Base de données | MariaDB 10.11 |
| IA | Ollama + llama3.2 (Spring AI) |
| Sécurité | Spring Security + JWT |
| API Docs | Swagger UI (Springdoc) |
| Déploiement | Docker + Docker Compose |

## Fonctionnalités

- Authentification JWT (login admin/admin)
- CRUD complet sur les voitures et propriétaires
- Relation propriétaire → voitures (OneToMany / ManyToOne)
- Assistant IA intelligent (AutoExpert) qui analyse le catalogue, compare les prix, détecte les anomalies et génère des descriptions marketing
- Historique de conversation avec l'IA
- Interface React avec thème sombre, toasts, modals et chatbot intégré

## Architecture Docker

```
voiture-net (réseau Docker interne)
├── mariadb        → base de données (port hôte 3307)
├── springboot-app → API REST + JWT + IA (port hôte 9090)
├── ollama         → modèle llama3.2 (port hôte 11434)
└── react-app      → interface utilisateur (port hôte 3000)
```

---

## Guide de démarrage (pour le professeur)

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et **démarré**
- Connexion internet (pour télécharger les images Docker au premier lancement)
- Ports disponibles sur la machine : **3000, 3307, 9090, 11434**

### Étape 1 — Cloner le projet

```bash
git clone https://github.com/MeryElBiach/-spring-react-voiture-shop.git
cd SpringDataRest
```

### Étape 2 — Lancer tous les containers

```bash
docker-compose up -d --build
```

Cette commande fait tout automatiquement :
- Compile le code Java avec Maven
- Compile l'interface React
- Crée la base de données `compagnie`
- Démarre les 4 containers dans le bon ordre

> La première exécution prend environ 5 à 10 minutes (téléchargement des images + compilation).

### Étape 3 — Charger le modèle IA (première fois uniquement)

```bash
docker exec -it ollama ollama pull llama3.2
```

> Cette étape est nécessaire une seule fois. Le modèle est ensuite persisté dans un volume Docker.

### Étape 4 — Vérifier que tout tourne

```bash
docker-compose ps
```

Vous devez voir 4 containers avec le statut `Up` :

```
mariadb        → Up (healthy)
springboot-app → Up
ollama         → Up
react-app      → Up
```

### Étape 5 — Accéder à l'application

| Interface | URL |
|---|---|
| Application React | http://localhost:3000 |
| API Spring Data REST | http://localhost:9090/api |
| Swagger UI | http://localhost:9090/swagger-ui/index.html |

### Identifiants de connexion

```
Login    : admin
Password : admin
```

---

## Commandes utiles

```bash
# Arrêter les containers (sans les supprimer)
docker-compose stop

# Redémarrer les containers arrêtés
docker-compose start

# Voir les logs de Spring Boot
docker-compose logs springboot-app

# Voir les logs en temps réel
docker-compose logs -f springboot-app

# Reconstruire après modification du code
docker-compose up -d --build

# Tout supprimer (containers + volumes)
docker-compose down -v
```


## Exemples de questions pour l'assistant IA

- *"Quelle est la voiture la moins chère ?"*
- *"Comparez le Toyota Corolla et le Honda CRV"*
- *"Y a-t-il des anomalies de prix dans le catalogue ?"*
- *"Recommandez une voiture pour un budget de 100 000€"*
- *"Faites une description marketing du Honda CRV"*