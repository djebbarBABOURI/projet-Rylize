import os

MONGO_DB_URI = os.getenv("MONGO_DB_URI", "mongodb://127.0.0.1:27017/app_rysid")

# Secret partagé avec l'API Node (en-tête X-ML-Token). Vide = pas de vérification (développement).
ML_SERVICE_TOKEN = os.getenv("ML_SERVICE_TOKEN", "")
TAILLE_CACHE_MODELES = int(os.getenv("ML_CACHE_MODELES", "256"))
