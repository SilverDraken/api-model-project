from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sklearn.tree import DecisionTreeRegressor
import joblib
import os
import pandas as pd
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model_path = os.path.join(os.getcwd(), "decision_tree.pkl")


try:
    model = joblib.load(model_path)
    print("Modèle chargé avec succès.")
except FileNotFoundError:
    model = None
    print("Erreur : Le fichier modèle est introuvable.")

@app.get("/")
async def read_root():
    return {"message": "Bienvenue sur FastAPI avec Docker !"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

class PredictionInput(BaseModel):
    holiday: str
    temp: float
    hour: int
    rain_1h: float
    snow_1h: float
    clouds_all: int
    weather_main: str
    weather_description: str
    day: str
    month: int
    year: int

@app.post("/predict")
async def read_predict(input_data: PredictionInput):
    if model is None:
        return {"error": "Model not loaded!"}
    
    try:
        # Convert input to DataFrame
        sample_data = pd.DataFrame([input_data.dict()])
        prediction = model.predict(sample_data)
        return {"prediction": prediction.tolist()}
    except Exception as e:
        return {"error": f"Prediction error: {str(e)}"}
