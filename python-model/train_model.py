import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import yfinance as yf
import joblib

# === Settings ===
TICKER = "AAPL"
WINDOW_SIZE = 60
FORECAST_HORIZON = 1
EPOCHS = 100
BATCH_SIZE = 32

# === Step 1: Fetch data ===
df = yf.download(TICKER, period="5y", interval="1d", auto_adjust=True)
df = df.reset_index()[['Date', 'Close']].dropna()

# === Step 2: Preprocess ===
scaler = MinMaxScaler()
scaled = scaler.fit_transform(df[['Close']])
X, y = [], []
for i in range(len(scaled) - WINDOW_SIZE - FORECAST_HORIZON):
    X.append(scaled[i:i+WINDOW_SIZE])
    y.append(scaled[i+WINDOW_SIZE:i+WINDOW_SIZE+FORECAST_HORIZON])
X = np.array(X)
y = np.array(y)

# === Step 3: Split ===
split = int(0.8 * len(X))
X_train, y_train = X[:split], y[:split]

# === Step 4: Build Model ===
model = tf.keras.models.Sequential([
    tf.keras.layers.LSTM(200, return_sequences=True, input_shape=(WINDOW_SIZE, 1)),
    tf.keras.layers.Dropout(0.15),
    tf.keras.layers.LSTM(100),
    tf.keras.layers.Dropout(0.15),
    tf.keras.layers.Dense(50, activation='relu'),
    tf.keras.layers.Dense(FORECAST_HORIZON)
])
model.compile(optimizer='adam', loss=tf.keras.losses.MeanSquaredError())

# === Step 5: Train ===
model.fit(X_train, y_train, epochs=EPOCHS, batch_size=BATCH_SIZE)

# === Step 6: Save ===
model.save("lstm_model.h5")
joblib.dump(scaler, "scaler.pkl")

print("✅ Model and scaler saved: lstm_model.h5, scaler.pkl")
