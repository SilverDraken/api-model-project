import React, { useState } from "react";
import "../styles/PredictionForm.css";

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    holiday: "",
    temp: "",
    hour: "",
    rain_1h: "",
    snow_1h: "",
    clouds_all: "",
    weather_main: "",
    weather_description: "",
    day: "",
    month: "",
    year: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message || "An error occurred during prediction.");
    }
  };

  return (
    <div className="form-container">
      <h1>Weather Prediction</h1>
      <form onSubmit={handleSubmit} className="prediction-form">
        {Object.keys(formData).map((key) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key.replace("_", " ").toUpperCase()}:</label>
            <input
              id={key}
              type={key === "temp" || key.includes("hour") || key === "year" || key === "month" || key === "clouds_all" ? "number" : "text"}
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit" className="submit-button">Predict</button>
      </form>

      {prediction && <div className="result">Prediction: {prediction}</div>}
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
};

export default PredictionForm;
