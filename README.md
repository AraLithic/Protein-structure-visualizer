# Protein-structure-visualizer by Umair

## Protein & Mycelium Bioplastic — Starter

This guide provides instructions for setting up and running the project locally.

### Quick Start (Local)

To begin, you need to create and activate a Python virtual environment to manage dependencies separately from your system's Python installation.

# Project Run Instructions

This document explains how to stop, restart, and run the project locally without reinstalling dependencies.

---


# 🛑 How to Stop the Project

If the backend and frontend are running in terminals:

In each terminal, press:

```
Ctrl + C
```

This safely stops:

* FastAPI backend (uvicorn)
* Frontend HTTP server

Nothing is deleted. Your virtual environment and installed packages remain intact.

---

# 🔁 How to Restart the Project Later

## Step 1 — Navigate to Project Folder

```
cd ~/Projects/ProtienStrVis
```

---

## Step 2 — Activate Virtual Environment

```
source .venv/bin/activate
```

⚠️ You do NOT need to reinstall requirements unless:

* You deleted the `.venv` folder
* You modified `requirements.txt`

---

## Step 3 — Start Backend Server

```
uvicorn app:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

Swagger documentation available at:

```
http://127.0.0.1:8000/docs
```

---

## Step 4 — Start Frontend Server (New Terminal)

Open a second terminal in the same project folder and run:

```
python3 -m http.server 5500
```

Then open in browser:

```
http://localhost:5500
```

---

# 🧠 Important Concept

The `.venv` folder contains all installed dependencies.

As long as `.venv` exists, you do not need to reinstall packages.

If `.venv` is deleted, recreate it using:

```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

# 🚀 Optional: Create Quick Start Script (Backend)

Create a file named `run_backend.sh`:

```
#!/bin/bash
source .venv/bin/activate
uvicorn app:app --reload
```

Make it executable:

```
chmod +x run_backend.sh
```

Run it with:

```
./run_backend.sh
```

---

You are now ready to stop and restart the project anytime without reinstalling dependencies.
