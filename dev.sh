#!/bin/bash
set -e

cd "$(dirname "$0")"

if [ ! -f "./tw/tailwindcss-cli" ]; then
    echo "Downloading Tailwind CSS + DaisyUI..."
    cp tw/input.css tw/input.css.bak
    (cd tw && curl -sL daisyui.com/fast | bash)
    mv tw/input.css.bak tw/input.css
fi

echo "Starting Tailwind CSS (watch mode)..."
(cd tw && ./tailwindcss-cli -w -i input.css -o ../app/static/css/main.css)

echo "Starting Flask..."
# python app/app.py
uv run python app/app.py
