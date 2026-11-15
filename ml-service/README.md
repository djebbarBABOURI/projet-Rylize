# Service de machine learning de Rylize

Microservice Python (FastAPI + scikit-learn) appelé uniquement par l'API Node. Il lit les dépenses dans MongoDB en lecture seule.

## Fonctionnalités

| Fonction | Modèle | Détails |
|---|---|---|
| **Suggestion de catégorie** | TF-IDF sur n-grammes de caractères (2 à 5) + régression logistique | Robuste aux fautes de frappe. Entraîné sur un jeu de départ de 404 descriptions françaises puis **réentraîné avec les dépenses de l'utilisateur** (poids ×3) : il apprend ses habitudes et ses catégories personnalisées. Les suggestions sont restreintes à ses catégories. |
| **Prévision mensuelle** | Moyenne mobile, lissage exponentiel ou tendance (Ridge), choisi par validation *walk-forward* | Sélection du meilleur modèle par utilisateur et par catégorie, fourchette à 80 % déduite des erreurs observées. Minimum 3 mois complets. |
| **Dépenses inhabituelles** | IsolationForest + score robuste (médiane / MAD) par catégorie | Une dépense n'est signalée que si les deux méthodes concordent et qu'elle est plus élevée que d'habitude. Minimum 30 dépenses. |

## Résultats mesurés

`python -m scripts.evaluer` (validation croisée stratifiée à 5 plis, sur des descriptions **jamais vues** du jeu de départ) :

| Mesure | Résultat |
|---|---|
| Catégorie correcte en première suggestion | **68,6 %** (± 3,9) |
| Catégorie correcte parmi les 3 suggestions affichées | **88,6 %** (± 2,6) |
| Première suggestion avec une faute de frappe ajoutée | 63,4 % (± 5,4) |

Ces chiffres correspondent au **démarrage à froid** (aucune dépense saisie) et à un jeu de départ écrit à la main : ils ne mesurent pas la précision sur de vraies données. Elle augmente avec l'historique, car les descriptions d'un utilisateur se répètent (« courses », « navigo »...).

## Limites connues

- Pas de saisonnalité dans les prévisions (il faudrait au moins 2 ans d'historique).
- Les dépenses exceptionnelles mais légitimes (loyer annuel, vacances) peuvent être signalées comme inhabituelles.
- Le modèle de catégorie est reconstruit en mémoire quand les dépenses d'un utilisateur changent (mise en cache LRU), sans stockage sur disque.

## Lancer

```bash
cd ml-service
python -m venv .venv && source .venv/bin/activate      # Windows : .venv\Scripts\activate
pip install -r requirements-dev.txt
MONGO_DB_URI=mongodb://127.0.0.1:27017/rylize uvicorn app.main:app --port 8001
python -m pytest -q                                    # 38 tests, sans MongoDB
python -m scripts.evaluer                              # métriques du classifieur
```

Variables : `MONGO_DB_URI`, `ML_SERVICE_TOKEN` (secret partagé avec l'API, en-tête `X-ML-Token`), `ML_CACHE_MODELES` (nombre de modèles gardés en mémoire, 256 par défaut).

## Routes (internes)

| Route | Description |
|---|---|
| `GET /sante` | état du service et de MongoDB |
| `POST /categorie/suggestion` `{userId, description}` | top-3 des catégories avec probabilités |
| `GET /prevision/{userId}?mois=AAAA-MM` | prévision du total et des catégories principales |
| `GET /anomalies/{userId}?du=&au=` | dépenses inhabituelles de la période |

Côté application, l'API Node les expose sous `/api/ml/*` (authentification requise, `userId` pris dans la session).
