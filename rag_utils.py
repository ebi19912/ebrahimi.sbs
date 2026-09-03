import os
# --- تغییرات جدید در Import ها ---
from langchain_text_splitters import RecursiveCharacterTextSplitter # مسیر جدید
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document # مسیر جدید
from models import Project, ResumeItem, Skill, Profile

# مسیر دیتابیس برداری به صورت مطلق (Absolute path to the vector database)
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance', 'chroma_db')

# مدل امبدینگ (Embedding model)
# این مدل متن‌ها را به بردارهای عددی تبدیل می‌کند تا در دیتابیس برداری قابل جستجو باشند
embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def fetch_data_from_db(app):
    """
    اتصال به دیتابیس و تبدیل داده‌ها به آبجکت‌های Document
    """
    documents = []
    
    with app.app_context():
        # 1. پروفایل
        profile = Profile.query.first()
        if profile:
            text = f"Candidate Profile:\nName: {profile.full_name}\nAbout: {profile.about_me}\nContact: {profile.contact_info}"
            documents.append(Document(page_content=text, metadata={"source": "Profile", "type": "bio"}))

        # 2. مهارت‌ها
        skills = Skill.query.all()
        if skills:
            skills_list = ", ".join([f"{s.name} ({s.level}%)" for s in skills])
            text = f"Technical Skills and Expertise:\n{skills_list}"
            documents.append(Document(page_content=text, metadata={"source": "Skills List", "type": "skill"}))

        # 3. پروژه‌ها
        projects = Project.query.all()
        for p in projects:
            text = (f"Project Title: {p.title}\n"
                    f"Status: {p.status}\n"
                    f"Summary: {p.short_description}\n"
                    f"Full Details: {p.full_content}\n"
                    f"Links: GitHub: {p.github_link}, Video: {p.video_link}")
            documents.append(Document(page_content=text, metadata={"source": p.title, "type": "project"}))

        # 4. تجربیات
        items = ResumeItem.query.all()
        for item in items:
            text = (f"Resume Item ({item.category}):\n"
                    f"Title: {item.title}\n"
                    f"Organization: {item.organization}\n"
                    f"Date/Duration: {item.duration}\n"
                    f"Description: {item.description}")
            documents.append(Document(page_content=text, metadata={"source": item.title, "type": "experience"}))
            
    return documents

def initialize_vector_db(app):
    """
    ساخت و مقداردهی اولیه دیتابیس برداری (ChromaDB)
    این تابع اطلاعات را از دیتابیس SQL می‌خواند، آن‌ها را به قطعات کوچک تقسیم کرده
    و در دیتابیس برداری برای جستجوی معنایی (Semantic Search) ذخیره می‌کند.
    """
    print("Fetching data from SQL Database...")
    raw_docs = fetch_data_from_db(app)
    
    if not raw_docs:
        print("No data found in SQL database to index.")
        return

    # تکه تکه کردن متن‌ها
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks = text_splitter.split_documents(raw_docs)

    # پاکسازی دیتابیس قبلی
    if os.path.exists(DB_PATH):
        try:
            db = Chroma(persist_directory=DB_PATH, embedding_function=embedding_function)
            db.delete_collection()
        except Exception as e:
            print(f"Could not delete old DB collection: {e}")

    # ذخیره در ChromaDB
    Chroma.from_documents(
        documents=chunks,
        embedding=embedding_function,
        persist_directory=DB_PATH
    )
    print(f"Vector DB updated! Indexed {len(chunks)} chunks from SQL Database.")

def get_relevant_context(query, k=4):
    """
    جستجوی متون مرتبط در دیتابیس برداری (RAG retrieval step)
    به دنبال شبیه‌ترین قطعات متنی به سوال کاربر می‌گردد.
    :param query: سوال کاربر (User query)
    :param k: تعداد نتایج بازگشتی (Number of documents to retrieve)
    :return: متن تجمیع شده نتایج (Aggregated context text)
    """
    if not os.path.exists(DB_PATH):
        return ""
        
    db = Chroma(persist_directory=DB_PATH, embedding_function=embedding_function)
    results = db.similarity_search(query, k=k)
    
    context_text = "\n\n---\n\n".join([doc.page_content for doc in results])
    return context_text