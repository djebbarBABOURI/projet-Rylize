/* eslint-disable react/prop-types */
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // enregistre automatiquement les types de graphiques Chart.js

function BarChart({ chartData }) {
    return <Bar data={chartData} />;
}

export default BarChart;
