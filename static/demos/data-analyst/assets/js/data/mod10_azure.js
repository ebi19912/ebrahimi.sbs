window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "10-azure",
    "number": "10",
    "folderName": "10-Azure",
    "title": "رایانش ابری با Microsoft Azure",
    "subtitle": "معماری مدرن داده، Data Lake، Data Factory و اتصال به Power BI",
    "icon": "cloud-arrow-up",
    "category": "ابری و پیشرفته",
    "estimatedHours": 12,
    "filePath": "10-Azure/Azure_Handbook.md",
    "steps": [
        {
            "id": "10-azure-intro",
            "stepNumber": 1,
            "title": "مقدمه: چرا Azure؟",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۵ دقیقه",
            "summary": "تفاوت سرورهای محلی و ابری و جایگاه آژور در اکوسیستم مایکروسافت",
            "contentHtml": "\n                <p>رایانش ابری دیگر یک امتیاز نیست، بلکه یک الزام است.</p>\n                <h3>On-Premise در برابر Cloud</h3>\n                <ul>\n                    <li><strong>محلی (On-Prem):</strong> خرید سرور، استخدام مسئول شبکه، هزینه ثابت و محدودیت سخت‌افزاری.</li>\n                    <li><strong>ابری (Cloud):</strong> اجاره سرور از مایکروسافت، پرداخت به ازای مصرف (Pay-as-you-go) و ارتقای رم و هارد با یک کلیک.</li>\n                </ul>\n                <p>دلیل محبوبیت آژور این است که با <strong>SQL Server</strong>، <strong>Excel</strong> و <strong>Power BI</strong> یکپارچگی بومی (Native) و بی‌نظیری دارد.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "بسیاری از سازمان‌ها به دلیل مسائل امنیتی و یکپارچگی با محصولات ویندوزی، Azure را به AWS ترجیح می‌دهند."
            ]
        },
        {
            "id": "10-azure-storage",
            "stepNumber": 2,
            "title": "سرویس‌های ذخیره‌سازی ابری",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "تفاوت Blob Storage و Azure Data Lake Gen2",
            "contentHtml": "\n                <p>مرحله اول در فضای ابری، ذخیره داده‌های خام است.</p>\n                <h3>۱. Azure Blob Storage</h3>\n                <p>یک هارد بی‌نهایت در اینترنت برای نگهداری فایل‌های ساختارنیافته مثل تصاویر، ویدیوها و بک‌آپ‌ها. ساختار آن شامل Account > Container > Blob است.</p>\n                <br>\n                <h3>۲. Azure Data Lake Storage (ADLS Gen2)</h3>\n                <p>نسل پیشرفته Blob که مخصوص تحلیل <strong>کلان‌داده (Big Data)</strong> است. تفاوت اصلی آن داشتن <strong>Hierarchical Namespace</strong> است؛ یعنی مثل ویندوز دارای پوشه‌های واقعی است که سرعت خواندن داده‌ها را به شدت بالا می‌برد.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "Data Lake vs Data Warehouse",
                    "industry": "مهندسی داده",
                    "difficulty": "متوسط",
                    "scenario": "مدیر از شما می‌پرسد: چرا همه داده‌های خام را مستقیم وارد دیتابیس (Warehouse) نمی‌کنیم و اول آن‌ها را در Data Lake می‌ریزیم؟",
                    "task": "تفاوت کاربرد این دو را بگویید.",
                    "hint": "ساختار و هزینه",
                    "solutionLanguage": "markdown",
                    "solutionCode": "«دریاچه داده (Data Lake) برای ذخیره ارزان حجم عظیمی از داده‌های بدون ساختار و خام است. ما نمی‌دانیم آیا روزی به این داده‌ها نیاز داریم یا خیر. اما انبار داده (Warehouse) گران‌تر است و فقط برای داده‌های تمیز، ساختاریافته و آمادهِ گزارش‌گیری (Relational) استفاده می‌شود.»",
                    "solutionExplanation": "این یکی از پرتکرارترین سوالات مصاحبه برای مشاغل مرتبط با کلان‌داده است."
                }
            ],
            "keyTakeaways": [
                "Data Lake مانند یک انبار بزرگِ قطعات خام است، و Data Warehouse مانند یک فروشگاه لوکس که محصولات نهایی در آن چیده شده‌اند."
            ]
        },
        {
            "id": "10-azure-integration",
            "stepNumber": 3,
            "title": "یکپارچه‌سازی و پردازش (ADF & Synapse)",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "آشنایی با Azure Data Factory و Azure Synapse Analytics",
            "contentHtml": "\n                <h3>۱. Azure Data Factory (ADF)</h3>\n                <p>سرویس ارکستراسیون (Orchestration) و <strong>ETL</strong> است. با محیط بصری آن (Drag & Drop) می‌توانید پایپ‌لاین بسازید. مثلاً: فایل‌ها را از سرور بگیر، در صورت موفقیت به دیتابیس آژور بفرست.</p>\n                <br>\n                <h3>۲. Azure Synapse Analytics</h3>\n                <p>محیط یکپارچه‌ای که انبار داده‌های رابطه‌ای و موتور پردازش <strong>Spark</strong> را ترکیب کرده است. در سیناپس می‌توانید مستقیماً فایل‌های CSV داخل Data Lake را با دستورات SQL کوئری بگیرید (ویژگی Serverless SQL) بدون اینکه نیاز به بارگذاری آن‌ها در دیتابیس باشد.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "Pipeline در برابر Activity",
                    "industry": "توسعه ابری",
                    "difficulty": "مقدماتی",
                    "scenario": "در محیط Azure Data Factory در حال ساخت یک فرآیند انتقال داده هستید.",
                    "task": "تفاوت بین Pipeline و Activity چیست؟",
                    "hint": "ظرف در برابر وظیفه",
                    "solutionLanguage": "markdown",
                    "solutionCode": "پایپ‌لاین (Pipeline) ظرفی منطقی است که فرآیند کلی را در بر می‌گیرد (مثلاً فرآیند کپی روزانه فروش). اما اکتیویتی (Activity) تک‌تکِ وظایف اجرایی داخل آن پایپ‌لاین است (مانند Copy Data Activity یا اجرای یک Stored Procedure).",
                    "solutionExplanation": "یک پایپ‌لاین می‌تواند شامل ده‌ها اکتیویتی متصل به هم باشد."
                }
            ],
            "keyTakeaways": [
                "ADF کدنویسی نیاز ندارد، اما منطق چیدن بلاک‌ها و مدیریت خطا در آن بسیار مهم است."
            ]
        },
        {
            "id": "10-azure-architecture",
            "stepNumber": 4,
            "title": "معماری مدال (Medallion Architecture)",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "جریان عبور داده از لایه‌های برنز، نقره و طلا",
            "contentHtml": "\n                <p>در پروژه‌های واقعی، داده‌ها مستقیماً به داشبورد نمی‌روند، بلکه از ۳ لایه عبور می‌کنند:</p>\n                <ol>\n                    <li><strong>لایه برنز (Raw / Bronze):</strong> داده‌های خام و دست‌نخورده که توسط ADF مستقیماً از منابع خارجی در Data Lake ذخیره می‌شوند.</li>\n                    <li><strong>لایه نقره (Cleansed / Silver):</strong> داده‌های پالایش‌شده، فیلترشده و بدون مقادیر نال که با سیناپس پردازش شده‌اند.</li>\n                    <li><strong>لایه طلا (Curated / Gold):</strong> داده‌های تجمیع‌شده‌ی نهایی (کاملاً تجاری) که در دیتابیس ذخیره شده و آماده اتصال به داشبوردهای Power BI هستند.</li>\n                </ol>\n            ",
            "codeBlocks": [
                {
                    "title": "نمای کلی معماری ابری",
                    "language": "text",
                    "code": "CRM/Web --> ADF --> [Bronze Data Lake] --> Synapse/Spark --> [Silver Data Lake] --> SQL --> [Gold Database] --> Power BI"
                }
            ],
            "industryExercises": [
                {
                    "title": "اتصال Power BI به Azure",
                    "industry": "هوش تجاری",
                    "difficulty": "مقدماتی",
                    "scenario": "لایه طلایی داده‌های شما در Azure Synapse آماده شده است.",
                    "task": "چگونه داشبورد را به آن متصل می‌کنید؟",
                    "hint": "استفاده از Get Data بومی",
                    "solutionLanguage": "markdown",
                    "solutionCode": "در نرم‌افزار Power BI Desktop، روی دکمه Get Data کلیک کرده و تب Azure را انتخاب می‌کنیم. سپس با انتخاب Azure Synapse Analytics یا Azure SQL Database و وارد کردن Credentials سرور ابری، جداول را مستقیماً Import یا DirectQuery می‌کنیم.",
                    "solutionExplanation": "اتصال بومی (Native) بین سرویس‌های مایکروسافت، دلیل اصلی انتخاب Azure برای تیم‌های استفاده‌کننده از Power BI است."
                }
            ],
            "keyTakeaways": [
                "همیشه داده‌های خام (برنز) را نگه دارید. اگر در پردازش‌های لایه نقره اشتباهی رخ دهد، می‌توانید مجدداً از لایه برنز داده‌ها را بازسازی کنید."
            ]
        }
    ]
});