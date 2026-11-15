"""API FastAPI du service de machine learning de Rylize (appelée uniquement par l'API Node)."""
from __future__ import annotations

import hmac
from datetime import datetime

from fastapi import Depends, FastAPI, Header, HTTPException, Path, Query
from pydantic import BaseModel, Field

from . import config
from .service import ServiceML

ID_MONGO = r"^[0-9a-fA-F]{24}$"


class DemandeSuggestion(BaseModel):
    userId: str = Field(pattern=ID_MONGO)
    description: str = Field(max_length=200)


def creer_app(service: ServiceML | None = None, token: str | None = None) -> FastAPI:
    app = FastAPI(title="Rylize ML", version="1.0.0")
    attendu = config.ML_SERVICE_TOKEN if token is None else token

    if service is None:  # connexion paresseuse : ne bloque pas le démarrage si MongoDB est lent
        from .depot import DepotMongo

        service = ServiceML(DepotMongo(config.MONGO_DB_URI), config.TAILLE_CACHE_MODELES)

    def verifier_token(x_ml_token: str | None = Header(default=None)) -> None:
        if attendu and not hmac.compare_digest(x_ml_token or "", attendu):
            raise HTTPException(status_code=401, detail="Jeton invalide")

    @app.get("/sante")
    def sante():
        base_ok = service.depot.ping()
        if not base_ok:
            raise HTTPException(status_code=503, detail="MongoDB injoignable")
        return {"statut": "ok", "mongodb": "connecte"}

    @app.post("/categorie/suggestion", dependencies=[Depends(verifier_token)])
    def suggestion(demande: DemandeSuggestion):
        return service.suggerer(demande.userId, demande.description)

    @app.get("/prevision/{user_id}", dependencies=[Depends(verifier_token)])
    def prevision(
        user_id: str = Path(pattern=ID_MONGO),
        mois: str | None = Query(default=None, pattern=r"^\d{4}-(0[1-9]|1[0-2])$"),
    ):
        return service.prevision(user_id, mois)

    @app.get("/anomalies/{user_id}", dependencies=[Depends(verifier_token)])
    def anomalies(
        user_id: str = Path(pattern=ID_MONGO),
        du: str | None = Query(default=None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
        au: str | None = Query(default=None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    ):
        try:
            debut = datetime.strptime(du, "%Y-%m-%d") if du else None
            fin = datetime.strptime(au, "%Y-%m-%d").replace(hour=23, minute=59, second=59) if au else None
        except ValueError:
            raise HTTPException(status_code=422, detail="Date invalide")
        return service.anomalies(user_id, debut, fin)

    return app


# Point d'entrée : uvicorn app.main:app
class _Paresseux:
    """Crée l'application au premier appel (évite d'ouvrir MongoDB à l'import, utile pour les tests)."""

    _app = None

    async def __call__(self, scope, receive, send):
        if _Paresseux._app is None:
            _Paresseux._app = creer_app()
        await _Paresseux._app(scope, receive, send)


app = _Paresseux()
