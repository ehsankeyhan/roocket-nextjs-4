import React from "react";
import { Bar } from "react-chartjs-2";
function BarChart({ chartData }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Amounts Chart</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "from 1403"
            },
            legend: {
              display: false
            },
          },
          scales: {
            x: {
                grid: {
                    drawOnChartArea: false
                }
            },
        }
        }}
      />
    </div>
  );
}
export default BarChart;