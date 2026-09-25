window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "12-databricks",
    "number": "12",
    "folderName": "12-Databricks",
    "title": "انقلاب Data Lakehouse با Databricks",
    "subtitle": "اجرای کدهای PySpark، فرمت Delta Lake و معماری قدرتمند Medallion",
    "icon": "box",
    "category": "ابری و پیشرفته",
    "estimatedHours": 14,
    "filePath": "12-Databricks/Databricks_Handbook.md",
    "steps": [
        {
            "id": "12-databricks-intro",
            "stepNumber": 1,
            "title": "مقدمه: مشکل بزرگ دنیای داده",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۰ دقیقه",
            "summary": "چرا نه Data Lake کافی بود و نه Data Warehouse؟",
            "contentHtml": "\n                <p>پیش از دیتابریکس، شرکت‌ها با یک دوراهی بزرگ مواجه بودند:</p>\n                <ul>\n                    <li><strong>Data Lake:</strong> ارزان بود و برای فایل‌های خام عالی کار می‌کرد، اما سرعت پایینی داشت و نمی‌شد روی آن مستقیماً با SQL گزارش‌گیری کرد.</li>\n                    <li><strong>Data Warehouse:</strong> برای گزارش‌گیری با SQL و داشبوردها عالی بود، اما گران بود و داده‌های بدون ساختار (تصویر، لاگ) را قبول نمی‌کرد.</li>\n                </ul>\n                <br>\n                <h3>راه حل: Data Lakehouse</h3>\n                <p>دیتابریکس این دو دنیا را ادغام کرد. حالا می‌توانید امکانات یک دیتابیس لوکس را مستقیماً روی فایل‌های ارزان‌قیمتِ دریاچه داده (S3 یا Azure Data Lake) داشته باشید.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "دیتابریکس یک نرم‌افزار نیست، یک لایه پردازشی در فضای ابری است که بر بستر AWS، Azure یا GCP اجرا می‌شود."
            ]
        },
        {
            "id": "12-databricks-spark",
            "stepNumber": 2,
            "title": "هسته مرکزی: Apache Spark و PySpark",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "تفاوت پردازش روی یک لپ‌تاپ با پردازش روی ۱۰۰۰ سرور",
            "contentHtml": "\n                <p>کتابخانه‌هایی مثل Pandas همه دیتا را روی رَم یک کامپیوتر لود می‌کنند. پس اگر فایل ۵۰ ترابایتی داشته باشید، سیستم Crash می‌کند.</p>\n                <h3>Spark چیست؟</h3>\n                <p>اسپارک موتور پردازش توزیع‌شده (Distributed Computing) است. وقتی به اسپارک می‌گویید یک فایل را فیلتر کن، آن را به ۱۰۰۰ تکه تقسیم کرده و به ۱۰۰۰ کامپیوتر کارگر در کلود می‌فرستد. همه همزمان کار را انجام می‌دهند و در ۱ ثانیه جواب برمی‌گردد.</p>\n                <h3>محیط Notebook دیتابریکس</h3>\n                <p>در دیتابریکس می‌توانید در یک نوت‌بوک، یک سلول را با پایتون (<code>%python</code>) بنویسید و سلول بعدی را با زبان SQL (<code>%sql</code>)!</p>\n            ",
            "codeBlocks": [
                {
                    "title": "PySpark در برابر SQL",
                    "language": "python",
                    "code": "# PySpark\ndf_filtered = df.filter(df.age > 30)\n\n# معادل آن در سلول بعدی با SQL\n%sql\nSELECT * FROM customers WHERE age > 30"
                }
            ],
            "industryExercises": [
                {
                    "title": "Pandas یا PySpark؟",
                    "industry": "همه صنایع",
                    "difficulty": "مقدماتی",
                    "scenario": "مدیر از شما می‌خواهد یک فایل CSV دو مگابایتی را تمیز کنید. شما بلافاصله دیتابریکس و PySpark را پیشنهاد می‌دهید.",
                    "task": "چرا این کار از نظر مهندسی اشتباه است؟",
                    "hint": "هزینه کلاستر",
                    "solutionLanguage": "markdown",
                    "solutionCode": "«برای داده‌های کوچک (Small Data) مثل ۲ مگابایت، استفاده از اسپارک اشتباه مطلق است! بالا آوردن سرورهای ابری برای تقسیم این داده کوچک خودش زمان‌بر و پرهزینه است. در اینجا کتابخانه Pandas روی یک کامپیوتر معمولی سریع‌ترین و بهترین انتخاب است.»",
                    "solutionExplanation": "اسپارک (Spark) فقط برای کلان‌داده (Big Data) طراحی شده است."
                }
            ],
            "keyTakeaways": [
                "دیتابریکس کلاسترهای سرور را وقتی کار شما تمام شد، به‌طور خودکار خاموش می‌کند (Auto-termination) تا هزینه اضافی به گردن شرکت نیفتد."
            ]
        },
        {
            "id": "12-databricks-delta",
            "stepNumber": 3,
            "title": "فرمت انقلابی Delta Lake",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "نحوه آپدیت کردن فایل‌های متنی و سفر در زمان (Time Travel)",
            "contentHtml": "\n                <p>چگونه دیتابریکس توانست ویژگی‌های دیتابیس را روی فایل‌ها پیاده کند؟ با فرمت متن‌باز <strong>Delta Lake</strong>.</p>\n                <h3>ویژگی‌های فرمت دلتا</h3>\n                <ul>\n                    <li><strong>تراکنش (ACID):</strong> در حالت عادی شما نمی‌توانید یک فایل متنی در کلود را <code>UPDATE</code> کنید. اما اگر با فرمت دلتا ذخیره شود، می‌توانید دقیقاً مثل دیتابیس روی آن دستور آپدیت بزنید!</li>\n                    <li><strong>سفر در زمان (Time Travel):</strong> دلتا لاگ تمام تغییرات را نگه می‌دارد. اگر اشتباهاً جدولی را پاک کردید، با یک دستور SQL می‌توانید نسخهِ ۲ روز پیش را بازیابی کنید!</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "سفر در زمان در دلتا",
                    "language": "sql",
                    "code": "-- برگرداندن جدول به نسخه سوم\nSELECT * FROM customers VERSION AS OF 3;\n\n-- برگرداندن جدول به وضعیت هفته گذشته\nSELECT * FROM customers TIMESTAMP AS OF '2026-01-01 10:00:00';"
                }
            ],
            "industryExercises": [
                {
                    "title": "تفاوت Parquet و Delta",
                    "industry": "توسعه ابری",
                    "difficulty": "پیشرفته",
                    "scenario": "هر دوی این فرمت‌ها ساختار ستونی (Columnar) دارند و سرعت کوئری‌ها را بالا می‌برند.",
                    "task": "پس فرمت Delta چه فرقی با Parquet دارد؟",
                    "hint": "فایل‌های لاگ",
                    "solutionLanguage": "markdown",
                    "solutionCode": "«فرمت دلتا در زیرساخت خودش دقیقاً همان فایل‌های Parquet است! اما با این تفاوت که دلتا یک پوشه مخفی به نام `_delta_log` در کنار فایل‌ها می‌سازد که سابقه تراکنش‌ها (چه کسی چه زمانی آپدیت کرده) را ثبت می‌کند. این لاگ است که سفر در زمان را ممکن می‌سازد.»",
                    "solutionExplanation": "درک مفهوم Transaction Log کلید فهمیدن دلتا لیک است."
                }
            ],
            "keyTakeaways": [
                "در دیتابریکس، هر جدولی که می‌سازید به طور پیش‌فرض با فرمت Delta ذخیره می‌شود."
            ]
        },
        {
            "id": "12-databricks-medallion",
            "stepNumber": 4,
            "title": "معماری مدالیون (Medallion Architecture)",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "لایه برنز (خام)، نقره (پالایش‌شده) و طلا (آماده داشبورد)",
            "contentHtml": "\n                <p>دیتابریکس خالق معماری <strong>Medallion</strong> است. در این معماری، کیفیت داده‌ها به صورت مرحله‌ای بالا می‌رود:</p>\n                <ol>\n                    <li><strong>لایه برنز (Bronze):</strong> داده‌های خام و دقیقاً مطابق منبع (بدون هیچ تغییری) که با فرمت Delta ذخیره می‌شوند.</li>\n                    <li><strong>لایه نقره (Silver):</strong> در این لایه با کدهای PySpark، مقادیر Null حذف می‌شوند، فرمت تاریخ‌ها یکسان می‌شود و دیتای تکراری دور ریخته می‌شود.</li>\n                    <li><strong>لایه طلا (Gold):</strong> لایه تجارت! جداول نقره با هم Join می‌شوند تا جداول تجمیعی نهایی ساخته شوند. نرم‌افزارهای Power BI یا Tableau مستقیماً به این لایه متصل می‌شوند.</li>\n                </ol>\n            ",
            "codeBlocks": [
                {
                    "title": "متن تخصصی رزومه",
                    "language": "markdown",
                    "code": "«توسعه پایپ‌لاین‌های ETL توزیع‌شده با PySpark جهت انتقال و پالایش میلیون‌ها رکورد از لایه Bronze به Silver و پیاده‌سازی جداول نهایی با فرمت Delta Lake در لایه Gold.»"
                }
            ],
            "industryExercises": [],
            "keyTakeaways": [
                "هرگز داشبورد (BI) را به لایه نقره یا برنز وصل نکنید! داشبوردها فقط حق دارند دیتای تمیز و تجمیع‌شده را از لایه طلایی (Gold) بخوانند."
            ]
        }
    ]
});