/* eslint-disable react/prop-types */
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // enregistre automatiquement les types de graphiques Chart.js

function PieChart({ chartData }) {
    return <Pie data={chartData} />;
}

export default PieChart;
