from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import tensorflow as tf
import joblib
import yfinance as yf
from datetime import timedelta
import traceback

app = Flask(__name__)
CORS(app)

WINDOW_SIZE = 60
model = tf.keras.models.load_model("lstm_model.h5", compile=False)
scaler = joblib.load("scaler.pkl")

def fetch_data(ticker):
    df = yf.download(ticker, period="5y", interval="1d", auto_adjust=True)
    df = df.reset_index()
    df = df[['Date', 'Close']].dropna()
    df['Date'] = pd.to_datetime(df['Date'])
    return df

@app.route("/forecast", methods=["POST"])
def forecast():
    try:
        ticker = request.json.get("ticker", "").upper()
        days = int(request.json.get("days", 2))  # Default to 2 days: today + tomorrow

        print(f"[INFO] Forecasting next {days} days for: {ticker}")
        df = fetch_data(ticker)
        if df.empty:
            return jsonify({"error": f"No data found for ticker: {ticker}"}), 404

        scaled = scaler.transform(df[['Close']])
        last_60 = scaled[-WINDOW_SIZE:]

        forecast_vals = []
        input_seq = last_60.copy()

        for _ in range(days):
            pred = model.predict(input_seq.reshape(1, WINDOW_SIZE, 1), verbose=0)[0, 0]
            forecast_vals.append(pred)
            input_seq = np.append(input_seq[1:], [[pred]], axis=0)

        padded = np.zeros((days, 1))
        padded[:, 0] = np.array(forecast_vals)
        predicted_prices = scaler.inverse_transform(padded)[:, 0]

        last_date = df['Date'].max()
        future_dates = [(last_date + timedelta(days=i+1)).strftime("%Y-%m-%d") for i in range(days)]

        return jsonify({
            "dates": future_dates,
            "forecast": predicted_prices.tolist()
        })

    except Exception as e:
        print("[ERROR]", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
