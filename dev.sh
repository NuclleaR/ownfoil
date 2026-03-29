#!/bin/bash
set -e

cd "$(dirname "$0")"

if [ ! -f "./tw/tailwindcss" ]; then
    echo "Downloading Tailwind CSS + DaisyUI..."
    (cd tw && curl -sL daisyui.com/fast | bash)
fi

echo "Starting Tailwind CSS (watch mode)..."
./tw/tailwindcss -w -i tw/input.css -o app/static/css/main.css

echo "Starting Flask..."
# python app/app.py
uv run python app/app.py
