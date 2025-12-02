#!/usr/bin/env sh

# to use this env type either:
# . server.sh
# or
# source server.sh

python -m venv env
source env/bin/activate
pip install --upgrade pip
pip install fastapi fastapi[standard] psutil websockets

fastapi dev src/server/server.py
