/* eslint-disable react/prop-types */
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // enregistre automatiquement les types de graphiques Chart.js

function LineChart({ chartData }) {
    return <Line data={chartData} />;
}

export default LineChart;
