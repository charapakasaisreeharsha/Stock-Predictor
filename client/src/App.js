import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

const TICKERS = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"];

export default function App() {
  const [ticker, setTicker] = useState("AAPL");
  const [inputTicker, setInputTicker] = useState("");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, days: 7 }),
      });
      const data = await res.json();
      if (data.error) {
        setErrorMessage("Ticker not found. Please try another.");
        setForecast(null);
      } else {
        setErrorMessage("");
        setForecast(data);
      }
    } catch (e) {
      setErrorMessage("Check the Ticker Symbol once again ");
      setForecast(null);
      console.error(e);
    }
    setLoading(false);
  };

  const chartData = () => {
    if (!forecast) return null;
    return {
      labels: forecast.dates,
      datasets: [
        {
          label: "7-Day Forecast",
          data: forecast.forecast,
          fill: true,
          borderColor: "#6a0dad",
          backgroundColor: "rgba(106, 13, 173, 0.2)",
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Forecast for ${ticker}`,
        font: { size: 20 },
      },
    },
  };

  const handleInputChange = (e) => {
    setInputTicker(e.target.value.toUpperCase());
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputTicker.trim() !== "") {
      setTicker(inputTicker.trim());
      setInputTicker("");
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          padding: "1.5rem 2rem",
          backgroundColor: "#6a0dad",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src="/assets/stock_icon.gif" alt="Stock Icon" style={{ height: "1.8rem", width: "1.8rem" }} />
          Stock Forecast Dashboard
        </h1>
      </header>

      {/* Modern Rounded Search Bar */}
      <form onSubmit={handleInputSubmit} style={{ display: "flex", justifyContent: "center", padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            border: "1px solid #6a0dad",
            borderRadius: "9999px",
            overflow: "hidden",
            maxWidth: "500px",
            width: "90%",
          }}
        >
          <input
            type="text"
            placeholder="Search stock ticker..."
            value={inputTicker}
            onChange={handleInputChange}
          style={{
            flex: 1,
            padding: "0.75rem 1.2rem",
            fontSize: "1rem",
            border: "none",
            outline: "none",
            fontFamily: "'Poppins', sans-serif",
          }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#6a0dad",
              color: "white",
              padding: "0.75rem 1.5rem",
              fontWeight: "bold",
              fontSize: "1rem",
              fontFamily: "'Poppins', sans-serif",
              border: "none",
              cursor: "pointer",
              transition: "0.3s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "#470775";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "#6a0dad";
              e.currentTarget.style.color = "white";
            }}
          >
            Predict
          </button>
        </div>
      </form>

      {/* Ticker Buttons */}
      <div style={{ display: "flex", justifyContent: "center", padding: "1rem", flexWrap: "wrap", gap: "1rem" }}>
        {TICKERS.map((sym) => (
          <button
            key={sym}
            onClick={() => setTicker(sym)}
            style={{
              padding: "0.6rem 1.2rem",
              border: "none",
              borderRadius: "6px",
              backgroundColor: ticker === sym ? "#6a0dad" : "#a084d1",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
              boxShadow: ticker === sym ? "0 4px 10px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Forecast Chart */}
      <main
        style={{
          maxWidth: 900,
          margin: "2rem auto",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {loading && <p style={{ textAlign: "center", fontWeight: "bold" }}>Loading forecast...</p>}

        {errorMessage && (
          <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{errorMessage}</p>
        )}

        {!loading && forecast && <Line data={chartData()} options={chartOptions} />}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "1rem", color: "#777" }}>
        <small>⚠️ Predictions are for informational purposes only and not financial advice.</small>
      </footer>
    </div>
  );
}
