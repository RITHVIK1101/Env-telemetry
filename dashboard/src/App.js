import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:8000/data")
        .then(res => res.json())
        .then(res => setData(res.data))
        .catch(err => console.error("Fetch error:", err));
    };

    fetchData(); // initial load
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  // 🔁 Reverse safely (important for chart updates)
  const reversed = [...data].reverse();

  const labels = reversed.map(row => row[0]);
  const temps = reversed.map(row => row[1]);
  const hums = reversed.map(row => row[2]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temps,
        borderColor: "red",
        tension: 0.3
      },
      {
        label: "Humidity (%)",
        data: hums,
        borderColor: "blue",
        tension: 0.3
      }
    ]
  };

  // 🌧️ Servo logic (same as Arduino)
  const latest = data[0];
  const servoOn = latest && latest[2] > 50;

  return (
    <div style={{ padding: 20 }}>
      <h1>Sensor Dashboard</h1>

      <h2>
        Status:{" "}
        <span style={{ color: servoOn ? "blue" : "green" }}>
          {servoOn ? "🌧️ RAIN (Servo ON)" : "☀️ CLEAR (Servo OFF)"}
        </span>
      </h2>

      <Line key={data.length} data={chartData} />

      {/* 📜 RAW DATA */}
      <h3>Recent Data</h3>
      {data.map((row, i) => (
        <p key={i}>
          {row[0]} | Temp: {row[1]}°C | Hum: {row[2]}%
        </p>
      ))}
    </div>
  );
}

export default App;