. ./venv/bin/activate # Sourcing
rm -rf dist/
mkdir dist/
pip3 install -r requirements.txt -t dist/
cp main.py dist/
zip -r backend-build.zip dist/
