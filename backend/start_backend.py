#!/usr/bin/env python3
"""
Simple runner for StudentPulse Flask backend.
"""
import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import app

if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5000))
    print(f"==================================================")
    print(f"  StudentPulse Big Data & Cloud Backend")
    print(f"  Listening on: http://127.0.0.1:{port}")
    print(f"  Endpoints: /api/health, /api/students, /api/hadoop/run")
    print(f"==================================================")
    app.run(host="127.0.0.1", port=port, debug=False)
