import serial
import sqlite3
import time
ser = serial.Serial('/dev/cu.usbmodem11101', 9600)


conn = sqlite3.connect("sensor_data.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS readings (
    timestamp TEXT,
    temperature REAL,
    humidity REAL
)
""")

print("Logging started...")

while True:
    try:
        line = ser.readline().decode('utf-8').strip()

        if line:
            temp, hum = map(float, line.split(","))

            timestamp = time.strftime('%Y-%m-%d %H:%M:%S')

            cur.execute("INSERT INTO readings VALUES (?, ?, ?)",
                        (timestamp, temp, hum))
            conn.commit()

            print(f"{timestamp} | Temp: {temp} | Hum: {hum}")

    except Exception as e:
        print("Error:", e)