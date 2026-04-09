from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

# ✅ CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/data")
def get_data():
    conn = sqlite3.connect("sensor_data.db")
    cur = conn.cursor()

    # 🔥 MORE DATA FOR SMOOTH GRAPH
    cur.execute("SELECT * FROM readings ORDER BY timestamp DESC LIMIT 50")
    rows = cur.fetchall()

    return {"data": rows}