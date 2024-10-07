from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import serial
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set the serial port and baud rate
serial_port = 'COM3'  # Update this with your Arduino's serial port
baud_rate = 115200

# Initialize the serial connection
arduino_data = serial.Serial(serial_port, baud_rate, timeout=1)

# Wait for the serial connection to be established
time.sleep(2)

@app.route('/get_data', methods=['GET'])
def get_data():
    try:
        # Read data from Arduino as binary
        arduino_data.write(b'R')  # Send a command to Arduino to request data
        data_packet = arduino_data.readline().strip()

        # Process and parse data
        data_values = [float(value) for value in data_packet.split(b',')]
        sensor1_value, sensor2_value = data_values

        # Return the data as JSON with CORS headers
        response = jsonify({
            'sensor1_value': sensor1_value,
            'sensor2_value': sensor2_value
        })
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow requests from any origin
        return response

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to fetch data from Arduino'}), 500

if __name__ == '__main__':
    app.run(host='192.168.172.157', port=5000)
