# Database Models (`models.py`)

The `models.py` file defines the relational database schema using **Flask-SQLAlchemy**.

## Models

### 1. `Admin`
Handles the authentication credentials for the CMS.
- **Fields:** `id`, `username`, `password`
- **Note:** The `password` field stores the `bcrypt` hashed password for security. It inherits from `UserMixin` to integrate seamlessly with Flask-Login.

### 2. `Profile`
Stores the candidate's personal information. Typically, there is only a single record in this table.
- **Fields:** `id`, `full_name`, `contact_info`, `address`, `about_me`, `interests`, `personality`, `hobbies`, `profile_pic`.

### 3. `ResumeItem`
A generic model used to store different sections of a resume.
- **Fields:** `id`, `category`, `title`, `organization`, `duration`, `description`, `order`.
- **Note:** The `category` field acts as an identifier (e.g., `'work'`, `'education'`, `'honor'`, `'paper'`) to distinguish the type of record. The `order` field manages the display sequence.

### 4. `Project`
Stores information about portfolio projects.
- **Fields:** `id`, `title`, `status`, `short_description`, `full_content`, `github_link`, `video_link`, `live_link`, `order`.

### 5. `Skill`
Stores technical skills and the proficiency level.
- **Fields:** `id`, `name`, `level`, `order`.
- **Note:** `level` is typically a percentage (0 to 100).
