import React, { useState } from "react";
import { evaluateThreshold } from "../api";

const AlertThreshold = ({ city }) => {
	const [threshold, setThreshold] = useState("");
	const [alertMessage, setAlertMessage] = useState("");

	const handleThresholdCheck = async () => {
        console.log(city, threshold);
		const response = await evaluateThreshold(city, parseFloat(threshold));
        console.log(response);
		setAlertMessage(
			response.alert ? "Threshold breached!" : "No breach detected."
		);
	};

	return (
		<div className="p-4 bg-white shadow-md rounded-lg my-4">
			<h2 className="text-2xl font-semibold mb-4">Set Alert Threshold</h2>
			<input
				type="number"
				value={threshold}
				onChange={(e) => setThreshold(e.target.value)}
				placeholder="Enter temperature threshold"
				className="p-2 border rounded mr-2"
			/>
			<button
				onClick={handleThresholdCheck}
				className="bg-blue-500 text-white px-4 py-2 rounded"
			>
				Check Threshold
			</button>
			{alertMessage && (
				<p className="mt-4 text-red-600">{alertMessage}</p>
			)}
		</div>
	);
};

export default AlertThreshold;
