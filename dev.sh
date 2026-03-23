#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Starting Tailwind CSS (watch mode)..."
cd app/static/css
./tailwindcss -i input.css -o output.css
cd ../../../

echo "Starting Flask..."
python app/app.py
