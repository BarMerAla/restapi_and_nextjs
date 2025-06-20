# restapi_and_nextjs

# Запуск backend   Windows
cd backend
python -m venv venv
pip install -r requirements.txt
venv\Scripts\activate
uvicorn src.main app --reload

# Запуск frontend
cd frontend
npm run dev
