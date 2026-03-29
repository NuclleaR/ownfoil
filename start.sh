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

if [ ! -f "./tw/tailwindcss-cli" ]; then
    echo "Downloading Tailwind CSS + DaisyUI..."
    cp tw/input.css tw/input.css.bak
    (cd tw && curl -sL daisyui.com/fast | bash)
    mv tw/input.css.bak tw/input.css
    mv tw/tailwindcss tw/tailwindcss-cli
fi

echo "Starting Flask server..."
uv run python app/app.py &
PID_SERVER=$!

echo "Starting Tailwind CSS watcher..."
echo "Press Ctrl+C to stop"
./tw/tailwindcss-cli -w -i tw/input.css -o app/static/css/main.css
