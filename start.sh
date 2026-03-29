#!/bin/bash

# fn to stop with Ctrl+C
cleanup() {
    echo ""
    echo "Stop dev environment..."
    kill $PID_SERVER $PID_TAILWIND 2>/dev/null
    exit 0
}

# Set signal handler
trap cleanup INT TERM

if [ ! -f "./tw/tailwindcss" ]; then
    echo "Downloading Tailwind CSS + DaisyUI..."
    (cd tw && curl -sL daisyui.com/fast | bash)
fi

echo "Starting Tailwind CSS watcher..."
./tw/tailwindcss -w -i tw/input.css -o app/static/css/main.css &
PID_TAILWIND=$!

echo "Starting Flask server..."
uv run python app/app.py &
PID_SERVER=$!

echo ""
echo "✓ Both processes are running"
echo "  - Tailwind CSS: PID $PID_TAILWIND"
echo "  - Flask Server: PID $PID_SERVER"
echo ""
echo "Press Ctrl+C to stop"

#wait for both processes to finish
wait
