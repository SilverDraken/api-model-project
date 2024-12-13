import React, { useEffect, useState } from "react";
import PredictionForm from "./components/PredictionForm";

function App() {
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetch("http://localhost:8000/")
			.then((response) => response.json())
			.then((data) => setMessage(data.message));
	}, []);

	return (
		<div>
			<PredictionForm />
		</div>
	);
}

export default App;
