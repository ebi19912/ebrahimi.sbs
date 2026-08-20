# Ebrahimi Website (AI-Powered Portfolio & Resume Builder)

This is a personal portfolio and resume builder web application written in Python using the **Flask** framework. It incorporates a **Retrieval-Augmented Generation (RAG)** pipeline to power an AI chatbot that answers questions based on the candidate's portfolio data.

## Features
- **Portfolio Website:** Displays profile, projects, skills, and resume items.
- **Admin Dashboard:** A built-in CMS (Content Management System) to manage portfolio content (Projects, Resume Items, Skills, Profile).
- **AI Chatbot:** An intelligent assistant powered by LangChain and OpenRouter that answers visitor questions about your experience based on your actual data.
- **PDF Resume Generation:** Generates an AI-tailored resume or a standard manual resume in PDF format.
- **Secure Authentication:** Uses `Flask-Bcrypt` for secure password hashing.

## Project Structure
- `app.py`: The core Flask application, routing, and authentication logic.
- `models.py`: Database schema and SQLAlchemy models.
- `rag_utils.py`: The RAG engine handling vector embeddings and context retrieval.
- `forms.py`: Reserved for future use (Flask-WTF forms).
- `static/`: Static assets (CSS, JS, images, uploaded files).
- `templates/`: HTML templates for the website and admin panel.
- `docs/`: Microservice documentation.

## Installation and Setup

1. **Clone the repository and navigate to it.**
2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   FLASK_SECRET_KEY=your_very_secure_secret_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. **Initialize Database:**
   The database will automatically initialize when you start the app. The default admin credentials are:
   - Username: `admin`
   - Password: `123` *(Make sure to change this after your first login!)*
5. **Run the Application:**
   ```bash
   python app.py
   ```
6. **Access the Site:**
   - Public Site: `http://localhost:5000`
   - Admin Panel: `http://localhost:5000/login`

## Microservices Documentation
Detailed documentation for each logic component can be found in the `docs/` folder:
- [Core Application (app.py)](docs/app_core.md)
- [Database Models (models.py)](docs/database_models.md)
- [RAG Engine (rag_utils.py)](docs/rag_engine.md)
