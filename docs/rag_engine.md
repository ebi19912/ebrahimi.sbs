# RAG Engine (`rag_utils.py`)

The `rag_utils.py` file acts as the Retrieval-Augmented Generation (RAG) microservice. It allows the AI models to "read" the SQL database and answer questions based on the candidate's factual information.

## How it Works

1. **Data Fetching (`fetch_data_from_db`)**
   - Connects to the SQLite database via Flask context.
   - Extracts all data (Profile, Skills, Projects, Resume Items).
   - Formats the data into standardized strings and wraps them in LangChain `Document` objects.

2. **Vector Indexing (`initialize_vector_db`)**
   - **Chunking:** Uses `RecursiveCharacterTextSplitter` to break down large texts into smaller chunks (800 characters) with overlap (100 characters) to preserve context.
   - **Embedding:** Uses the open-source HuggingFace model `all-MiniLM-L6-v2` to convert these text chunks into dense numerical vectors.
   - **Storage:** Deletes any old vector database and creates a fresh **ChromaDB** instance stored locally in `instance/chroma_db`.

3. **Context Retrieval (`get_relevant_context`)**
   - When a user asks a question, this function takes the query and searches the Chroma vector database.
   - It performs a semantic similarity search to find the top `k` (e.g., 4) most relevant chunks.
   - The matched text is returned as a single string, which is then injected into the AI's system prompt in `app.py`.
