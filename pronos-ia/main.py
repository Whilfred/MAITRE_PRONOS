#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
API Gateway Premium - PRONOS-APP
Distributeur de prédictions algorithmiques haute performance basé sur FastAPI.
Consomme le moteur prédictif 'predict.py' pour servir l'application mobile en JSON.
"""

from fastapi import FastAPI, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import sys
import os

# Ajout du dossier courant au chemin système pour sécuriser l'importation locale
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from predict import calculer_prediction_ia

# Initialisation de l'application FastAPI avec métadonnées professionnelles pour ton jury
app = FastAPI(
    title="👑 PRONOS-APP Machine Learning Engine",
    description=(
        "API REST Premium de modélisation, d'analyse automatique et de scores prédictifs. "
        "Développée spécifiquement pour l'écosystème de l'application VIP."
    ),
    version="1.0.0",
    docs_url="/api/v1/documentation",  # Interface Swagger personnalisée
    redoc_url="/api/v1/redoc"
)

# --- CONFIGURATION DU MIDDLEWARE CORS ---
# Indispensable pour éviter les blocages de sécurité réseau (CORS Policy) 
# lorsque ton application React Native (sur smartphone) ou ton serveur Laravel appelle l'API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, tu pourras restreindre à l'IP de ton serveur
    allow_credentials=True,
    allow_methods=["*"],  # Autorise GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

# Modèle de réponse structuré pour la documentation de l'API
class PredictionResponse(BaseModel):
    success: bool
    timestamp: str
    match_details: dict

@app.get("/", tags=["Système"])
def check_status():
    """
    Endpoint de diagnostic (Health Check) pour vérifier que le serveur Python fonctionne.
    """
    return {
        "status": "Online",
        "framework": "FastAPI",
        "engine": "Python 3 Machine Learning Core",
        "secure": True
    }

@app.get("/api/v1/predict", tags=["Algorithme Prédictif"])
def obtenir_prediction(
    home: str = Query(..., min_length=2, max_length=50, description="Nom de l'équipe à domicile (ex: Real Madrid)"),
    away: str = Query(..., min_length=2, max_length=50, description="Nom de l'équipe à l'extérieur (ex: FC Barcelone)")
):
    """
    **Endpoint Premium** : Génère instantanément une analyse prédictive complète.
    
    Envoie une requête avec les paramètres `home` et `away`. L'algorithme traite les 
    9 sources de données (xG, forme récente, météo, blessures...) et retourne :
    - Le score exact prédictif.
    - Le type de pari conseillé.
    - L'indice de confiance neuronal (%) et le niveau de risque.
    - L'analyse textuelle rédigée automatiquement.
    """
    # Sécurité de base : empêcher une équipe de jouer contre elle-même
    if home.strip().lower() == away.strip().lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erreur de traitement : L'équipe à domicile et l'équipe à l'extérieur doivent être différentes."
        )

    try:
        # Exécution de l'algorithme probabiliste de predict.py
        resultat_ia = calculer_prediction_ia(home.strip(), away.strip())
        
        from datetime import datetime
        return {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "data": resultat_ia
        }
        
    except Exception as e:
        # Capture des anomalies de calcul pour éviter le crash du serveur
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Une erreur interne est survenue lors de la modélisation mathématique : {str(e)}"
        )

# Démarrage automatique du serveur si le fichier est exécuté directement
if __name__ == "__main__":
    print("🚀 Démarrage du serveur FastAPI de PRONOS-APP...")
    # uvicorn s'occupe de faire tourner l'API sur le port 8000 avec rechargement automatique en développement
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)