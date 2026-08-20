# Core Application (`app.py`)

The `app.py` file is the heart of the web application. It is built using the Flask web framework.

## Key Responsibilities

1. **Application Configuration:**
   - Initializes Flask app, configures the database (`sqlite:///database.db`), and sets the `SECRET_KEY` from environment variables.
   - Sets up the `UPLOAD_FOLDER` with an absolute path for safety.

2. **Extensions Initialization:**
   - `db.init_app(app)`: Initializes SQLAlchemy.
   - `bcrypt = Bcrypt(app)`: Initializes bcrypt for password hashing.
   - `login_manager = LoginManager(app)`: Initializes Flask-Login for session management.

3. **Public Routes:**
   - `/`: Renders the main portfolio website using data fetched from the database.
   - `/download_resume`: Generates a standard PDF resume using `xhtml2pdf`.

4. **Authentication Routes:**
   - `/login` & `/logout`: Handles admin authentication. It features a fallback mechanism that supports both legacy plain-text passwords and secure bcrypt hashes.
   - Includes a simple Math CAPTCHA to prevent brute-force attacks.

5. **Admin Routes (CMS):**
   - CRUD (Create, Read, Update, Delete) operations for `Project`, `ResumeItem`, `Skill`, and `Profile`.
   - `/admin/reorder`: A specific route to reorder items dynamically.
   - `/admin/profile` & `/admin/account`: To manage the personal profile and admin credentials.

6. **AI Integration Routes:**
   - `/api/chat`: Receives user messages, fetches context using `rag_utils.py`, and queries the AI model (via OpenRouter) to respond based on the portfolio data.
   - `/admin/ai-resume`: An admin tool that uses the RAG system to tailor the resume for a specific Job Description (JD).

7. **Background Tasks:**
   - Starts a background thread (`run_async_indexing`) upon startup to initialize the Vector Database without blocking the main web server.
