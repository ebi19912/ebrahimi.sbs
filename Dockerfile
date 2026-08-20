FROM python:3.12-slim

WORKDIR /app

# Install system dependencies if required (e.g. for psycopg2, pillow)
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure upload/demo directories exist
RUN mkdir -p static/uploads static/demos

# Expose port for Gunicorn
EXPOSE 5000

# Run Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
