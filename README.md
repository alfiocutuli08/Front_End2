# Auth Portal

Stack incluso:

- Frontend: React, Vite, TypeScript, Tailwind CSS, componenti stile shadcn/ui, Axios, React Router, Lucide React.
- Backend: Python, FastAPI, Pydantic, SQLAlchemy, SQLite, JWT.

## Frontend

```bash
npm install
npm run dev
```

Apri `http://127.0.0.1:5173`.

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API: `http://127.0.0.1:8000`
