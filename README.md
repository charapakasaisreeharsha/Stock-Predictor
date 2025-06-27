# 📈 Stock Price Predictor using LSTM

This project is a full-stack web application that predicts stock prices for the next 7 days using a deep learning model based on Long Short-Term Memory (LSTM) networks. It allows users to input any valid stock ticker symbol and visualize both historical and predicted stock trends in an intuitive format.

---

## 🚀 Features

- 🔍 Predicts stock prices for any given stock ticker
- 📊 Interactive charts using Chart.js
- ⚙️ Real-time data retrieval from Yahoo Finance via `yfinance`
- 🧠 LSTM-based pre-trained deep learning model
- 🌐 Full-stack architecture: React + Node.js + Flask + Python

---

## 🧠 Technologies Used

| Layer        | Stack                            |
|-------------|-----------------------------------|
| Frontend    | React.js, Chart.js                |
| Middleware  | Node.js, Express.js               |
| Backend     | Flask (Python)                    |
| Model       | TensorFlow/Keras (LSTM)           |
| Data Source | Yahoo Finance API via `yfinance`  |

---

## 🖥️ System Architecture

```text
User Input (React) → Node.js (API Middleware) → Flask (Backend) → LSTM Model
                                     ↓
                         Yahoo Finance API (Data Source)
