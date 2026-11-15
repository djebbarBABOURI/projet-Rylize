# Rylize — suivi de dépenses personnelles

Rylize est une application web (stack **MERN** : MongoDB, Express, React, Node.js) pour enregistrer, catégoriser et analyser ses dépenses au quotidien. Elle aide à comprendre ses habitudes de consommation grâce à des statistiques calculées par MongoDB, des graphiques et des budgets mensuels avec alertes.

## Fonctionnalités

**Comptes et sécurité**
- Inscription, connexion et déconnexion (JWT dans un cookie `httpOnly`, mots de passe hachés avec bcrypt)
- Profil modifiable (nom, prénom, adresse, photo) et changement de mot de passe
- Protection de l'API : `helmet`, limitation de débit, validation des entrées, vérification de propriété des données

**Dépenses**
- Ajout, modification et suppression multiple (avec confirmation)
- Recherche, filtre par catégorie et par période, tri et pagination, exécutés côté serveur par MongoDB
- Export CSV compatible Excel (séparateur `;`, virgule décimale), qui reprend les filtres actifs

**Catégories personnalisables**
- Catégories propres à chaque utilisateur, avec couleur ; 6 catégories créées à l'inscription
- Renommer une catégorie met à jour les dépenses et budgets liés

**Statistiques (agrégations MongoDB)**
- Cartes du mois : total, variation par rapport au mois précédent, moyenne par jour, projection de fin de mois, catégorie la plus coûteuse
- Graphiques en barres, en secteurs et courbe mensuelle, colorés par catégorie

**Budgets mensuels**
- Budget global ou par catégorie, suivi avec barre de progression et statut (ok / bientôt atteint dès 80 % / dépassé)

**Machine learning** (service Python, facultatif)
- Suggestion automatique de la catégorie pendant la saisie de la description (68,6 % de réussite en première suggestion, 88,6 % parmi les 3 propositions, sur des descriptions inconnues ; le modèle s'adapte ensuite aux habitudes de l'utilisateur)
- Prévision du total du mois et par catégorie, avec fourchette à 80 %
- Détection des dépenses inhabituelles
- Détails, métriques et limites : [ml-service/README.md](ml-service/README.md). Sans ce service, l'application fonctionne normalement : les fonctions IA sont simplement masquées.

## Architecture

```
projet-Rylize/
├── backend/                 API Express (architecture MVC)
│   ├── config/              variables d'environnement validées au démarrage
│   ├── bdd/                 connexion MongoDB (Mongoose)
│   ├── model/               schémas : Utilisateur, Depense, Categorie, Budget
│   ├── controlleurs/        logique des routes
│   ├── services/            requêtes complexes (filtres, agrégations, budgets)
│   ├── routes/ middleware/ outils/
│   ├── scripts/             seed de démonstration
│   └── tests/               tests node:test
├── ml-service/              service Python (FastAPI + scikit-learn) : suggestions, prévisions, anomalies
├── frontend/                React + Vite + Tailwind/DaisyUI + Chart.js
├── docker-compose.yml       MongoDB + API + service ML (+ mongo-express en option)
└── .github/workflows/       CI : tests backend, lint et build frontend
```

### Modèle de données MongoDB

| Collection | Champs principaux | Index |
|---|---|---|
| `utilisateurs` | nom, prenom, email, mdp (haché), adresse, imgProfil | `email` unique |
| `depenses` | userId, montant, categorie, date, description | `{userId, date}`, `{userId, categorie, date}` |
| `categories` | userId, nom, couleur | `{userId, nom}` unique |
| `budgets` | userId, categorie (`null` = global), montant | `{userId, categorie}` unique |

Les statistiques utilisent le pipeline d'agrégation (`$match`, `$group`, `$facet`, `$dateToString`) : un seul aller-retour vers la base pour obtenir totaux, répartition par catégorie et évolution mensuelle.

## Installation

Prérequis : Node.js 20+ (testé avec 22), npm et MongoDB (local, Docker ou Atlas).

```bash
git clone https://github.com/djebbarBABOURI/projet-Rylize.git
cd projet-Rylize
cp .env.example .env        # puis renseigner JWT_SECRET (et MONGO_DB_URI si besoin)
npm install                 # dépendances du backend
cd frontend && npm install  # dépendances du frontend
```

**MongoDB avec Docker** (le plus simple) : `docker compose up -d mongo` puis garder `MONGO_DB_URI=mongodb://127.0.0.1:27017/rylize`.

### Lancer l'application

```bash
npm run server              # API sur http://localhost:8000 (nodemon)
cd frontend && npm run dev  # interface sur http://localhost:3000
```

Pour tout lancer avec Docker (MongoDB + API) : `JWT_SECRET=... docker compose up -d --build`. L'interface d'administration de MongoDB est disponible avec `docker compose --profile outils up -d` (http://localhost:8081).

### Service de machine learning (facultatif)

```bash
cd ml-service
python -m venv .venv && source .venv/bin/activate   # Windows : .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --port 8001
```

Puis, dans `.env` : `ML_SERVICE_URL=http://127.0.0.1:8001`. Avec Docker, le service `ml` est lancé automatiquement par `docker compose up`.

### Données de démonstration

```bash
npm run seed
```

Crée le compte `demo@rylize.dev` / `Demo1234!` avec environ 4 mois de dépenses et des budgets.

### Tests

```bash
npm test                    # 40 tests : validations, filtres, agrégations, API HTTP, passerelle ML
cd ml-service && python -m pytest -q   # 38 tests du service ML
cd frontend && npm run lint && npm run build
```

Les pipelines d'agrégation sont testés en mémoire avec [mingo](https://github.com/kofrasa/mingo) et l'API avec des modèles Mongoose simulés : aucun serveur MongoDB n'est nécessaire pour lancer la suite.

## API

Toutes les routes, sauf `/api/sante` et l'authentification, nécessitent le cookie de connexion.

| Méthode et route | Description |
|---|---|
| `GET /api/sante` | état de l'API et de MongoDB |
| `POST /api/authautification/inscription` · `/connexion` · `/deconnexion` | authentification |
| `PATCH /api/utilisateur/modifUtilisateur/:id` | modifier son profil |
| `PATCH /api/utilisateur/motdepasse` | changer son mot de passe |
| `GET /api/depenses/getDepenses` | liste ; filtres `categorie`, `du`, `au`, `min`, `max`, `q`, `tri`, `ordre`, `page`, `limite` |
| `POST /api/depenses/ajoutDepense/:id` · `PATCH /modifierDepense/:id` · `DELETE /deleteDepenses` | écriture |
| `GET /api/depenses/export` | export CSV (mêmes filtres) |
| `GET /api/ml/statut` · `/categorie?description=` · `/prevision?mois=` · `/anomalies?du=&au=` | fonctions de machine learning (503 si le service ML est absent) |
| `GET/POST /api/categories` · `PATCH/DELETE /api/categories/:id` | catégories |
| `GET /api/statistiques?du=&au=` | totaux, par catégorie, par mois |
| `GET /api/statistiques/resume?mois=AAAA-MM` | résumé mensuel et comparaison |
| `GET /api/budgets?mois=AAAA-MM` · `PUT /api/budgets` · `DELETE /api/budgets/:id` | budgets et statut |

## Sécurité : à savoir

- Le fichier `.env` ne doit jamais être versionné (il est ignoré par git). Une ancienne version contenant des identifiants figure dans l'historique du dépôt : **changez le mot de passe MongoDB Atlas et le `JWT_SECRET`** si ces valeurs ont été utilisées ailleurs.
- En production, définir `NODE_ENV=production` (cookies `secure`) et placer l'API derrière HTTPS.
