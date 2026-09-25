window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "01-sql",
    "number": "01",
    "folderName": "01-SQL",
    "title": "کوئری‌نویسی حرفه‌ای با پایگاه داده MySQL",
    "subtitle": "یادگیری گام به گام SQL از مفاهیم پایه تا توابع پنجره‌ای و رویه‌های ذخیره شده",
    "icon": "database",
    "category": "فنی",
    "estimatedHours": 15,
    "filePath": "01-SQL/SQL_Handbook.md",
    "steps": [
        {
            "id": "01-sql-intro",
            "stepNumber": 1,
            "title": "مقدمه و نقشه راه جامع (Data Analytics Roadmap)",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۰ دقیقه",
            "summary": "نقشه راه مسیر گام‌به‌گام یادگیری تا ورود به بازار کار تحلیل داده",
            "contentHtml": "\n                <p>این نقشه راه، مسیر گام‌به‌گام یادگیری تا ورود به بازار کار تحلیل داده را تبیین می‌کند:</p>\n                <br>\n                <h3>تسلط بر ۵ مهارت فنی پایه</h3>\n                <ul>\n                    <li><strong>پایگاه داده (SQL):</strong> هسته اصلی و مهم‌ترین مهارت یک تحلیل‌گر برای مدیریت، پالایش و استخراج داده‌ها از جداول پایگاه داده به شمار می‌رود.</li>\n                    <li><strong>ابزارهای هوش تجاری (BI):</strong> نرم‌افزارهای تجسم داده نظیر Tableau و Power BI جهت تبدیل داده‌های خام به داشبوردهای مدیریتی کاربرد دارند.</li>\n                    <li><strong>نرم‌افزار Microsoft Excel:</strong> کاربری پیشرفته اکسل برای پاکسازی مقدماتی، مرتب‌سازی و تحلیل‌های اولیه سریع داده‌ها مورد نیاز است.</li>\n                    <li><strong>زبان برنامه‌نویسی Python:</strong> جهت تحلیل‌های داده‌ای پیشرفته، محاسبات پیچیده و اتوماسیون فرآیندها استفاده می‌شود.</li>\n                    <li><strong>سرویس‌های ابری (Cloud Platforms):</strong> کسب شناخت عملیاتی از پلتفرم‌های ارائه‌دهنده سرویس‌های ابری مانند AWS، GCP یا Microsoft Azure.</li>\n                </ul>\n                <br>\n                <h3>استراتژی جذب و کاریابی</h3>\n                <p>نباید فرآیند کاریابی را منحصراً به ارسال فرم در سایت‌های آگهی استخدام محدود کنید. اثربخش‌ترین استراتژی شغلی، برقراری ارتباط شبکه‌ای هدفمند با استخدام‌کنندگان (Recruiters) در شبکه لینکدین (LinkedIn) است.</p>\n                <p><strong>زمان‌بندی فرآیند (حدود ۶ ماه):</strong></p>\n                <ul>\n                    <li>یادگیری مهارت‌های فنی: ۳ تا ۴ ماه.</li>\n                    <li>ساخت پروژه‌ها و تکمیل پورتفولیو: ۳ تا ۶ هفته.</li>\n                    <li>فرآیند مصاحبه و جستجوی کار: ۲ تا ۴ ماه.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "تمرکز بر روی ساخت پورتفولیو واقعی",
                "ارتباط موثر در لینکدین به جای ارسال رزومه کورکورانه"
            ]
        },
        {
            "id": "01-sql-setup",
            "stepNumber": 2,
            "title": "راه‌اندازی سرور، پیش‌نیازها و محیط MySQL Workbench",
            "badge": "راه‌اندازی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۵ دقیقه",
            "summary": "نصب MySQL و آشنایی با محیط Workbench برای اجرای کوئری‌ها",
            "contentHtml": "\n                <p>پیش از اجرای کوئری‌ها، پیکربندی صحیح سرور و محیط توسعه پایگاه داده ضروری است.</p>\n                <ul>\n                    <li><strong>دانلود:</strong> دریافت بسته از وب‌سایت رسمی MySQL (بخش Downloads/Installer).</li>\n                    <li><strong>نوع نصب (Setup Type):</strong> گزینه Developer Default نیازهای اکثر کاربران را تأمین می‌کند.</li>\n                    <li><strong>اتصال به سرور:</strong> اتصال به محیط دیتابیس از طریق بخش پیش‌فرض Local Instance برقرار می‌شود.</li>\n                    <li><strong>راه‌اندازی ساختار دیتابیس:</strong> به جای وارد کردن دستی ساختارها، فایل اسکریپت SQL پروژه را در Workbench باز کرده و با دکمه آذرخش اجرا کنید تا جداول و داده‌ها ساخته شوند.</li>\n                </ul>\n                <br>\n                <h3>تمایز دکمه‌های اجرای دستور (آذرخش‌ها)</h3>\n                <ul>\n                    <li><strong>آذرخش با علامت «I»:</strong> منحصراً دستور یا کدی را اجرا می‌کند که نشانگر ماوس (Cursor) روی خط آن قرار گرفته است.</li>\n                    <li><strong>آذرخش خالی (ساده):</strong> تمامی دستورات موجود در محیط ویرایشگر اسکریپت را از بالا به پایین به صورت یک‌جا اجرا می‌نماید.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "استفاده از آذرخش علامت I برای اجرای خط به خط کدها",
                "اهمیت حفظ رمز عبور root در هنگام نصب"
            ]
        },
        {
            "id": "01-sql-select",
            "stepNumber": 3,
            "title": "مبانی استخراج داده با دستور SELECT و محاسبات پایه",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "یادگیری ساختار پایه SELECT، انتخاب ستون‌ها و محاسبات روی مقادیر",
            "contentHtml": "\n                <p>دستور <code>SELECT</code> سنگ‌بنای اصلی استخراج اطلاعات از پایگاه داده به شمار می‌رود.</p>\n                <ul>\n                    <li><strong>نماد ستاره (*):</strong> به منظور استخراج هم‌زمان تمامی ستون‌ها.</li>\n                    <li><strong>تعیین نام دیتابیس:</strong> برای جلوگیری از ابهام بهتر است نام دیتابیس همراه با نام جدول قید شود (مثلاً <code>parks_and_recreation.employee_demographics</code>).</li>\n                    <li><strong>محاسبات عددی مستقیم:</strong> سیستم بر اساس قانون اولویت ریاضیات (PEMDAS) محاسبات را انجام می‌دهد.</li>\n                    <li><strong>کلیدواژه DISTINCT:</strong> جهت حذف رکوردهای تکراری و نمایش مقادیر منحصر‌به‌فرد.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "استخراج تمام ستون‌ها",
                    "language": "sql",
                    "code": "SELECT * \nFROM parks_and_recreation.employee_demographics;"
                },
                {
                    "title": "انتخاب ستون‌های خاص و محاسبات",
                    "language": "sql",
                    "code": "SELECT \n  first_name, \n  last_name, \n  age, \n  (age + 10) * 10 AS calculated_age \nFROM parks_and_recreation.employee_demographics;"
                },
                {
                    "title": "نمایش مقادیر یکتا",
                    "language": "sql",
                    "code": "SELECT DISTINCT gender \nFROM parks_and_recreation.employee_demographics;"
                }
            ],
            "industryExercises": [
                {
                    "title": "استخراج حاشیه سود محصولات",
                    "industry": "خرده‌فروشی (Retail)",
                    "difficulty": "مقدماتی",
                    "scenario": "شما تحلیل‌گر داده یک فروشگاه اینترنتی هستید. مدیریت می‌خواهد سود خالص هر محصول را ببیند.",
                    "task": "کوئری بنویسید که نام محصول، قیمت فروش، قیمت خرید و سود خالص (تفاضل قیمت فروش و خرید) را از جدول محصولات استخراج کند.",
                    "hint": "از عملگر تفریق مستقیماً در جلوی SELECT استفاده کنید و نام مستعار profit بدهید.",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT \n  product_name, \n  sale_price, \n  cost_price, \n  (sale_price - cost_price) AS profit \nFROM store_db.products;",
                    "solutionExplanation": "در اینجا با قرار دادن پرانتز (اختیاری ولی خواناتر) تفاضل را محاسبه کردیم. از AS برای نام‌گذاری خروجی استفاده می‌شود."
                }
            ],
            "keyTakeaways": [
                "همیشه در کوئری‌های بزرگ به جای SELECT * ستون‌های مورد نیاز را نام ببرید.",
                "DISTINCT روی ترکیب ستون‌ها هم کار می‌کند."
            ]
        },
        {
            "id": "01-sql-where",
            "stepNumber": 4,
            "title": "فیلتر کردن ردیف‌ها با عبارت شرطی WHERE",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۵ دقیقه",
            "summary": "استفاده از عملگرهای منطقی و LIKE برای جستجوی دقیق داده‌ها",
            "contentHtml": "\n                <p>عبارت <code>WHERE</code> به تحلیل‌گر اجازه می‌دهد سطرها را بر اساس شروط معین استخراج و فیلتر نماید.</p>\n                <ul>\n                    <li>عملگرهای مقایسه‌ای: <code>=</code>, <code>!=</code>, <code>></code>, <code><</code></li>\n                    <li>عملگرهای منطقی: <code>AND</code>, <code>OR</code>, <code>NOT</code></li>\n                    <li>فرمت تاریخ: MySQL تاریخ را طبق ساختار <code>YYYY-MM-DD</code> ارزیابی می‌کند.</li>\n                    <li>الگوهای متنی (LIKE): استفاده از <code>%</code> به جای چند کاراکتر و <code>_</code> به جای یک کاراکتر.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "فیلتر ترکیبی تاریخ و رشته",
                    "language": "sql",
                    "code": "SELECT * \nFROM employee_demographics \nWHERE birth_date > '1985-01-01' \n  AND gender != 'Female';"
                },
                {
                    "title": "جستجو با الگو (LIKE)",
                    "language": "sql",
                    "code": "-- نام‌هایی که با 'a' شروع شده و حداقل ۲ کاراکتر بعد از آن دارند\nSELECT * \nFROM employee_demographics \nWHERE first_name LIKE 'a__%';"
                }
            ],
            "industryExercises": [
                {
                    "title": "شناسایی مشتریان غیرفعال پرخطر",
                    "industry": "بانکداری",
                    "difficulty": "متوسط",
                    "scenario": "بانک می‌خواهد مشتریانی که از سال ۲۰۲۰ تراکنشی نداشته‌اند اما موجودی آن‌ها بالای ۵۰۰۰۰ است را شناسایی کند تا با آن‌ها تماس بگیرد.",
                    "task": "کوئری بنویسید تا مشتریانی با تاریخ آخرین تراکنش کوچکتر از '2020-01-01' و بالانس بیش از ۵۰۰۰۰ استخراج شوند.",
                    "hint": "از عملگرهای > و < به همراه AND استفاده کنید.",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT customer_id, full_name, balance, last_transaction_date \nFROM bank_db.customers \nWHERE last_transaction_date < '2020-01-01' \n  AND balance > 50000;",
                    "solutionExplanation": "استفاده از فرمت ایزو برای تاریخ (YYYY-MM-DD) بسیار مهم است. اعداد نباید درون کوتیشن قرار گیرند."
                }
            ],
            "keyTakeaways": [
                "استفاده از پرانتز هنگام ترکیب AND و OR حیاتی است تا اولویت‌ها درست ارزیابی شوند."
            ]
        },
        {
            "id": "01-sql-groupby",
            "stepNumber": 5,
            "title": "گروه‌بندی داده‌ها (GROUP BY) و مرتب‌سازی (ORDER BY)",
            "badge": "درس ۳",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "تجمیع اطلاعات با توابع آماری (COUNT, SUM, AVG) و مرتب‌سازی",
            "contentHtml": "\n                <p>از دستور <code>GROUP BY</code> برای تجمیع ردیف‌هایی که در یک یا چند ستون مقدار یکسانی دارند استفاده می‌شود.</p>\n                <p>قاعده اساسی: هر ستونی که در SELECT قید شده و درون یک تابع تجمعی قرار ندارد، الزاماً باید در GROUP BY نیز ذکر شود.</p>\n                <ul>\n                    <li>توابع تجمعی: <code>AVG()</code>, <code>SUM()</code>, <code>MAX()</code>, <code>MIN()</code>, <code>COUNT()</code></li>\n                    <li>مرتب‌سازی: <code>ORDER BY</code> به صورت صعودی (ASC) یا نزولی (DESC)</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "توابع تجمعی",
                    "language": "sql",
                    "code": "SELECT \n  gender, \n  AVG(age) AS avg_age, \n  MAX(age) AS max_age, \n  MIN(age) AS min_age, \n  COUNT(age) AS total_count \nFROM employee_demographics \nGROUP BY gender;"
                },
                {
                    "title": "مرتب‌سازی",
                    "language": "sql",
                    "code": "SELECT * \nFROM employee_demographics \nORDER BY gender ASC, age DESC;"
                }
            ],
            "industryExercises": [
                {
                    "title": "عملکرد فروش نمایندگی‌ها",
                    "industry": "صنعت خودرو",
                    "difficulty": "متوسط",
                    "scenario": "مدیر فروش می‌خواهد مجموع فروش هر شعبه را ببیند و آن‌ها را از بیشترین فروش به کمترین مرتب کند.",
                    "task": "کوئری بنویسید که branch_id و مجموع sale_amount را نشان داده و بر اساس فروش مرتب کند.",
                    "hint": "از SUM() و GROUP BY branch_id استفاده کرده و ORDER BY DESC روی نتیجه تابع بزنید.",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT \n  branch_id, \n  SUM(sale_amount) AS total_sales \nFROM auto_dealership.sales \nGROUP BY branch_id \nORDER BY total_sales DESC;",
                    "solutionExplanation": "ترتیب اجرای منطقی: دیتابیس ابتدا جداول را از FROM می‌گیرد، سپس GROUP BY انجام می‌دهد، مقادیر SUM را محاسبه می‌کند و در نهایت ORDER BY را روی نتایج تجمعی اعمال می‌کند."
                }
            ],
            "keyTakeaways": [
                "اجتناب از عددگذاری به جای نام ستون در ORDER BY (مثلا ORDER BY 2) برای حفظ پایداری کد در آینده."
            ]
        },
        {
            "id": "01-sql-having",
            "stepNumber": 6,
            "title": "تمایز ساختاری میان عبارات WHERE و HAVING",
            "badge": "درس ۴",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "تفاوت فیلتر کردن ردیف‌های خام قبل از گروه‌بندی با فیلتر کردن نتایج توابع تجمعی",
            "contentHtml": "\n                <p><strong>تفاوت چرخه ارزیابی:</strong></p>\n                <ul>\n                    <li>دستور <code>WHERE</code> فیلترها را در سطح سطرهای خام (Row-level) و قبل از پردازش دستور GROUP BY اعمال می‌نماید.</li>\n                    <li>دستور <code>HAVING</code> منحصراً برای فیلتر کردن مقادیر محاسباتی حاصل از توابع تجمعی (مانند خروجی AVG) ساخته شده و پس از مرحله گروه‌بندی اجرا می‌شود.</li>\n                </ul>\n                <p>در پرس‌وجوهای پیچیده می‌توان از هر دو دستور در کنار هم بهره گرفت.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "ترکیب WHERE و HAVING",
                    "language": "sql",
                    "code": "SELECT \n  occupation, \n  AVG(salary) AS avg_salary \nFROM employee_salary \nWHERE occupation LIKE '%manager%' -- فیلتر سطری قبل از گروه‌بندی\nGROUP BY occupation \nHAVING AVG(salary) > 75000;       -- فیلتر تجمعی بعد از گروه‌بندی"
                }
            ],
            "industryExercises": [
                {
                    "title": "شناسایی مشتریان پرمصرف اینترنت",
                    "industry": "مخابرات (Telco)",
                    "difficulty": "پیشرفته",
                    "scenario": "شرکت مخابرات می‌خواهد مشتریان پرمصرف (بیش از ۵۰۰ گیگابایت در ماه گذشته) را در شهر 'تهران' پیدا کند تا به آن‌ها پکیج ویژه پیشنهاد دهد.",
                    "task": "کاربران تهرانی را فیلتر کنید، حجم مصرفی آن‌ها را SUM کنید، و در نهایت افرادی که مصرف کل آن‌ها > 500 است را جدا کنید.",
                    "hint": "شهر = 'Tehran' در WHERE قرار می‌گیرد، اما شرط SUM(data_usage) > 500 در HAVING.",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT \n  customer_id, \n  SUM(data_usage) AS total_usage \nFROM telco.internet_sessions \nWHERE city = 'Tehran' \nGROUP BY customer_id \nHAVING SUM(data_usage) > 500;",
                    "solutionExplanation": "فیلتر شهر قبل از تجمیع حجم داده اعمال می‌شود که باعث کاهش بار پردازشی سرور است. شرط ۵۰۰ گیگابایت به خاطر نیاز به محاسبه مجموع، ناگزیر باید در HAVING بیاید."
                }
            ],
            "keyTakeaways": [
                "هرگز توابع تجمعی مثل SUM یا COUNT را مستقیماً داخل WHERE استفاده نکنید؛ باعث خطای سینتکس می‌شود."
            ]
        },
        {
            "id": "01-sql-limit",
            "stepNumber": 7,
            "title": "کنترل ردیف‌های خروجی (LIMIT) و نام مستعار (Aliasing)",
            "badge": "درس ۵",
            "isIntroOrSetup": false,
            "estimatedTime": "۱۵ دقیقه",
            "summary": "محدود کردن خروجی‌ها (مثلا یافتن ۳ نفر اول) و نام‌گذاری بهتر ستون‌ها",
            "contentHtml": "\n                <p>مشخص کردن سقف مشخصی از ردیف‌ها برای نمایش با <code>LIMIT</code> امکان‌پذیر است.</p>\n                <ul>\n                    <li>ترکیب با ORDER BY جهت استخراج رکوردهای تاپ (Top-N).</li>\n                    <li>استفاده از <strong>آفست (Offset)</strong>: مثلا <code>LIMIT 2, 1</code> یعنی ۲ ردیف را رها کن و ۱ ردیف بعدی را بیاور.</li>\n                    <li>کلمه کلیدی <strong>AS</strong> برای نام مستعار موقت به ستون‌ها استفاده می‌شود تا خوانایی گزارش بهتر شود.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "استفاده از LIMIT",
                    "language": "sql",
                    "code": "-- پیدا کردن ۳ نفر از مسن‌ترین کارمندان\nSELECT first_name, last_name, age \nFROM employee_demographics \nORDER BY age DESC \nLIMIT 3;"
                },
                {
                    "title": "استفاده از OFFSET",
                    "language": "sql",
                    "code": "-- رها کردن ۲ ردیف اول و بازگرداندن ۱ ردیف بعدی\nSELECT * \nFROM employee_demographics \nORDER BY age DESC \nLIMIT 2, 1;"
                }
            ],
            "industryExercises": [
                {
                    "title": "۵ ویدئوی پربازدید یوتیوب",
                    "industry": "رسانه (Media)",
                    "difficulty": "مقدماتی",
                    "scenario": "به عنوان تحلیلگر یک کانال یوتیوب، باید ۵ ویدئویی که بیشترین میزان بازدید (views) را در سال جاری داشته‌اند لیست کنید.",
                    "task": "بر اساس بازدید مرتب کرده و سپس فقط ۵ تای اول را محدود کنید.",
                    "hint": "ORDER BY views DESC LIMIT 5",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT \n  video_id, \n  title, \n  views AS total_views \nFROM youtube_channel.videos \nWHERE upload_year = 2024 \nORDER BY views DESC \nLIMIT 5;",
                    "solutionExplanation": "ترکیب ORDER BY و LIMIT پرکاربردترین تکنیک برای ساخت داشبوردهای Top 10 یا گزارشات رتبه‌بندی است."
                }
            ],
            "keyTakeaways": [
                "همیشه هنگام استفاده از LIMIT، دستور ORDER BY را هم قید کنید وگرنه دیتابیس ردیف‌های تصادفی بازمی‌گرداند!"
            ]
        },
        {
            "id": "01-sql-joins",
            "stepNumber": 8,
            "title": "پیوند و اتصال جداول (Joins)",
            "badge": "درس ۶",
            "isIntroOrSetup": false,
            "estimatedTime": "۴۵ دقیقه",
            "summary": "اتصال چندین جدول به صورت Inner، Left، Right و Self Join",
            "contentHtml": "\n                <p>دستور JOIN داده‌های چند جدول متمایز را بر مبنای ستون‌های مرتبط پیوند می‌دهد.</p>\n                <ul>\n                    <li><strong>INNER JOIN:</strong> فقط سطرهایی را استخراج می‌کند که مقادیر کلید در هر دو جدول متناظر باشند.</li>\n                    <li><strong>LEFT JOIN:</strong> تمامی رکوردهای جدول اول بازگردانده شده و اگر ردیفی تطابق نداشت مقدار NULL قرار می‌گیرد.</li>\n                    <li><strong>RIGHT JOIN:</strong> مشابه حالت بالا، اما جدول پایه سمت راست است.</li>\n                    <li><strong>SELF JOIN:</strong> ترکیب سطرهای یک جدول با سطرهای دیگر همان جدول (مثلا جدول پرسنل برای پیدا کردن مدیر هر شخص).</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "Inner Join و نام مستعار جداول",
                    "language": "sql",
                    "code": "SELECT \n  dem.employee_id, \n  dem.first_name, \n  sal.occupation, \n  sal.salary \nFROM employee_demographics AS dem \nINNER JOIN employee_salary AS sal \n  ON dem.employee_id = sal.employee_id;"
                },
                {
                    "title": "Left Join",
                    "language": "sql",
                    "code": "SELECT dem.first_name, sal.salary \nFROM employee_demographics AS dem \nLEFT JOIN employee_salary AS sal \n  ON dem.employee_id = sal.employee_id;"
                },
                {
                    "title": "Multiple Joins",
                    "language": "sql",
                    "code": "SELECT dem.first_name, dept.department_name \nFROM employee_demographics AS dem \nJOIN employee_salary AS sal \n  ON dem.employee_id = sal.employee_id \nJOIN parks_departments AS dept \n  ON sal.dept_id = dept.department_id;"
                }
            ],
            "industryExercises": [
                {
                    "title": "مشتریانی که خرید نکرده‌اند",
                    "industry": "تجارت الکترونیک (E-commerce)",
                    "difficulty": "پیشرفته",
                    "scenario": "تیم مارکتینگ لیستی از کاربرانی که در سایت ثبت‌نام کرده‌اند اما تاکنون هیچ سفارشی ثبت نکرده‌اند نیاز دارد تا کد تخفیف بفرستد.",
                    "task": "از یک LEFT JOIN بین جدول کاربران (users) و سفارشات (orders) استفاده کنید و کاربرانی که در جدول سفارشات پیدا نمی‌شوند را لیست کنید.",
                    "hint": "WHERE orders.order_id IS NULL",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT \n  u.user_id, \n  u.email \nFROM website.users u \nLEFT JOIN website.orders o \n  ON u.user_id = o.user_id \nWHERE o.order_id IS NULL;",
                    "solutionExplanation": "الگوی LEFT JOIN + IS NULL مشهورترین روش برای پیدا کردن رکوردها در جدول A است که در جدول B وجود ندارند (Anti-Join)."
                }
            ],
            "keyTakeaways": [
                "استفاده از نام مستعار برای جداول (مانند u برای users) باعث کوتاه‌تر شدن کوئری و پیشگیری از خطای Ambiguous Column Error می‌شود."
            ]
        },
        {
            "id": "01-sql-union",
            "stepNumber": 9,
            "title": "ترکیب عمودی نتایج با UNION و UNION ALL",
            "badge": "درس ۷",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "تفاوت اتصال افقی (JOIN) با تجمیع عمودی رکوردها (UNION)",
            "contentHtml": "\n                <p>اتصالات (Joins) جداول را به شکل افقی متصل می‌کنند، در حالی که دستور UNION نتایج چند کوئری SELECT را به صورت عمودی و زیر هم تجمیع می‌نماید.</p>\n                <ul>\n                    <li><strong>UNION:</strong> مشابه Union Distinct عمل کرده و داده‌های تکراری را حذف می‌کند.</li>\n                    <li><strong>UNION ALL:</strong> بدون حذف داده‌های مشابه، تمامی ردیف‌ها را در خروجی ثبت می‌نماید (سریع‌تر است).</li>\n                </ul>\n                <p>تکنیک برچسب‌گذاری (Labeling): با افزودن یک ستون ثابت متنی در دستورات SELECT می‌توان خروجی‌ها را طبقه‌بندی کرد.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "تجمیع عمودی با لیبل‌گذاری",
                    "language": "sql",
                    "code": "SELECT first_name, last_name, 'Old Lady' AS Label \nFROM employee_demographics \nWHERE age > 40 AND gender = 'Female' \nUNION \nSELECT first_name, last_name, 'Old Man' AS Label \nFROM employee_demographics \nWHERE age > 40 AND gender = 'Male' \nORDER BY first_name, last_name;"
                }
            ],
            "industryExercises": [
                {
                    "title": "ادغام لیست سیاه کارمندان و مشتریان",
                    "industry": "امنیت و حسابرسی",
                    "difficulty": "متوسط",
                    "scenario": "تیم امنیت می‌خواهد ایمیل‌های کارمندان مسدود شده و کاربران تعلیق شده سایت را در یک لیست یکپارچه بررسی کند.",
                    "task": "ایمیل‌ها را از جدول blocked_employees و suspended_users کوئری گرفته و آن‌ها را عمودی به هم وصل کنید. نیازی به نمایش تکراری‌ها نیست.",
                    "hint": "از UNION استفاده کنید، نه UNION ALL.",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT email \nFROM hr.blocked_employees \nUNION \nSELECT email \nFROM auth.suspended_users;",
                    "solutionExplanation": "چون از UNION ساده استفاده شده، اگر ایمیلی مشترک باشد فقط یک‌بار نمایش داده می‌شود. ستون‌ها در هر دو کوئری باید دیتاتایپ یکسان داشته باشند."
                }
            ],
            "keyTakeaways": [
                "تعداد ستون‌ها در تمامی بخش‌های UNION باید برابر باشد و ترتیب آن‌ها همخوانی داشته باشد."
            ]
        },
        {
            "id": "01-sql-string",
            "stepNumber": 10,
            "title": "توابع کار با داده‌های متنی (String Functions)",
            "badge": "درس ۸",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "تمیزکاری و استانداردسازی رشته‌ها با REPLACE, CONCAT, TRIM و ...",
            "contentHtml": "\n                <p>این توابع ابزارهای حیاتی تحلیل‌گر جهت تمیزکاری و آماده‌سازی رشته‌ها هستند:</p>\n                <ul>\n                    <li><code>LENGTH(col)</code>: شمارش تعداد کاراکترها</li>\n                    <li><code>UPPER() / LOWER()</code>: استانداردسازی حروف کوچک و بزرگ</li>\n                    <li><code>TRIM()</code>: حذف فاصله‌های خالی اضافی</li>\n                    <li><code>SUBSTRING(col, start, length)</code>: برش رشته (مثل جداسازی ماه تولد از تاریخ)</li>\n                    <li><code>REPLACE(col, 'old', 'new')</code>: جایگزینی کاراکترها</li>\n                    <li><code>CONCAT(col1, ' ', col2)</code>: الصاق ستون‌ها به یکدیگر</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "استفاده ترکیبی از توابع متنی",
                    "language": "sql",
                    "code": "SELECT \n  first_name, \n  UPPER(first_name) AS upper_name, \n  SUBSTRING(birth_date, 6, 2) AS birth_month, \n  REPLACE(first_name, 'a', 'z') AS modified_name, \n  CONCAT(first_name, ' ', last_name) AS full_name \nFROM employee_demographics;"
                }
            ],
            "industryExercises": [
                {
                    "title": "پاکسازی شماره تلفن‌های کاربران",
                    "industry": "پشتیبانی امور مشتریان",
                    "difficulty": "متوسط",
                    "scenario": "کاربران شماره‌های خود را با خط تیره وارد کرده‌اند (مثلا 555-123-4567). CRM فقط اعداد خالص می‌پذیرد.",
                    "task": "با کمک توابع متنی خط تیره‌ها را حذف کرده و فقط اعداد را خروجی بگیرید.",
                    "hint": "از تابع REPLACE استفاده کنید.",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT \n  user_id, \n  phone_number AS original_phone, \n  REPLACE(phone_number, '-', '') AS clean_phone \nFROM crm.customer_contact;",
                    "solutionExplanation": "تابع REPLACE بسیار قدرتمند است. اگر کاربران از کاراکترهای دیگر مثل پرانتز استفاده می‌کردند، باید REPLACE های تودرتو می‌نوشتیم."
                }
            ],
            "keyTakeaways": [
                "توابع رشته‌ای به شدت در مرحله Data Cleaning پیش از انتقال به ابزارهای BI کاربرد دارند."
            ]
        },
        {
            "id": "01-sql-case",
            "stepNumber": 11,
            "title": "منطق‌های شرطی با دستور CASE",
            "badge": "درس ۹",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "نوشتن شروط پیچیده (If-Else) درون کوئری و تولید ستون‌های محاسباتی داینامیک",
            "contentHtml": "\n                <p>دستور <code>CASE</code> امکان پیاده‌سازی منطق‌های شرطی را فراهم می‌آورد:</p>\n                <ul>\n                    <li>طبقه‌بندی داده‌ها (مثلا جوان، میانسال، سالمند).</li>\n                    <li>محاسبات عددی شرطی (محاسبه پورسانت متفاوت بر اساس تارگت فروش).</li>\n                </ul>\n                <p>ساختار شرطی حتماً با کلیدواژه CASE آغاز شده و الزاماً با کلمه کلیدی END بسته می‌شود.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "طبقه‌بندی سنی",
                    "language": "sql",
                    "code": "SELECT first_name, age, \n  CASE \n    WHEN age < 30 THEN 'Young' \n    WHEN age BETWEEN 31 AND 50 THEN 'Middle-aged' \n    ELSE 'Senior' \n  END AS age_bracket \nFROM employee_demographics;"
                },
                {
                    "title": "محاسبه پاداش وابسته به دپارتمان",
                    "language": "sql",
                    "code": "SELECT employee_id, salary, dept_id, \n  CASE \n    WHEN dept_id = 6 THEN salary * 0.10 \n    ELSE 0 \n  END AS bonus \nFROM employee_salary;"
                }
            ],
            "industryExercises": [
                {
                    "title": "تعیین سطح وفاداری مشتری",
                    "industry": "صنعت هواپیمایی",
                    "difficulty": "پیشرفته",
                    "scenario": "ایرلاین می‌خواهد وضعیت مسافران را آپدیت کند: بالای ۵۰ پرواز = VIP، بین ۲۰ تا ۵۰ = Gold، کمتر از ۲۰ = Standard.",
                    "task": "با ستون flight_count، یک CASE بنویسید که سطح مسافر را در ستونی به نام loyalty_tier چاپ کند.",
                    "hint": "WHEN flight_count > 50 THEN 'VIP'...",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT \n  passenger_id, \n  flight_count, \n  CASE \n    WHEN flight_count > 50 THEN 'VIP' \n    WHEN flight_count >= 20 THEN 'Gold' \n    ELSE 'Standard' \n  END AS loyalty_tier \nFROM airline.passengers;",
                    "solutionExplanation": "توجه کنید که ارزیابی شرایط در CASE از بالا به پایین است. بنابراین وقتی شرط >50 بررسی شد، در خط بعدی نیازی به نوشتن BETWEEN نیست و فقط >=20 کفایت می‌کند."
                }
            ],
            "keyTakeaways": [
                "همیشه یک بلوک ELSE بنویسید تا از تولید مقادیر NULL برای حالت‌های پیش‌بینی‌نشده جلوگیری شود."
            ]
        },
        {
            "id": "01-sql-subqueries",
            "stepNumber": 12,
            "title": "زیرپرس‌وجوها (Subqueries)",
            "badge": "درس ۱۰",
            "isIntroOrSetup": false,
            "estimatedTime": "۴۵ دقیقه",
            "summary": "نوشتن کوئری‌های تودرتو در بخش‌های WHERE، SELECT و FROM",
            "contentHtml": "\n                <p>زیرپرس‌وجو به کوئری‌هایی اطلاق می‌شود که درون ساختار یک کوئری دیگر محصور شده‌اند:</p>\n                <ul>\n                    <li><strong>زیرپرس‌وجو در بند WHERE:</strong> باید الزاماً صرفاً یک ستون واحد بازگرداند.</li>\n                    <li><strong>زیرپرس‌وجو در بند SELECT:</strong> باید مقداری اسکالر (واحد) بازگرداند.</li>\n                    <li><strong>زیرپرس‌وجو در بند FROM (جداول مشتق‌شده):</strong> هر جدول مشتق‌شده در FROM باید بدون استثنا دارای یک نام مستعار (Alias) باشد.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "فیلتر بر اساس کوئری داخلی (WHERE)",
                    "language": "sql",
                    "code": "SELECT * \nFROM employee_demographics \nWHERE employee_id IN (\n  SELECT employee_id \n  FROM employee_salary \n  WHERE dept_id = 1\n);"
                },
                {
                    "title": "مقایسه با میانگین کل (SELECT)",
                    "language": "sql",
                    "code": "SELECT employee_id, salary, \n  (SELECT AVG(salary) FROM employee_salary) AS avg_company_salary \nFROM employee_salary;"
                },
                {
                    "title": "محاسبات چندمرحله‌ای (FROM)",
                    "language": "sql",
                    "code": "SELECT AVG(max_age) AS avg_max \nFROM (\n  SELECT gender, MAX(age) AS max_age \n  FROM employee_demographics \n  GROUP BY gender\n) AS sub_table;"
                }
            ],
            "industryExercises": [
                {
                    "title": "پیدا کردن حقوق‌های بالاتر از میانگین دپارتمان",
                    "industry": "منابع انسانی (HR)",
                    "difficulty": "حرفه‌ای",
                    "scenario": "منابع انسانی لیستی از کارمندانی می‌خواهد که حقوق آن‌ها از میانگین حقوق کل شرکت بالاتر است.",
                    "task": "با استفاده از ساب‌کوئری در بخش WHERE کارمندانی با حقوق بالاتر از میانگین را پیدا کنید.",
                    "hint": "WHERE salary > (SELECT AVG(salary)...)",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT \n  first_name, \n  last_name, \n  salary \nFROM hr.employee_salary \nWHERE salary > ( \n  SELECT AVG(salary) \n  FROM hr.employee_salary \n);",
                    "solutionExplanation": "ساب‌کوئری یکبار مقدار اسکالر (میانگین کل) را محاسبه می‌کند و سپس کوئری اصلی تمام سطرها را با آن مقدار مقایسه می‌کند."
                }
            ],
            "keyTakeaways": [
                "ساب‌کوئری‌ها در FROM در محیط‌های کاری به شدت رایج هستند، اما برای کدهای طولانی بهتر است از CTE استفاده کنید."
            ]
        },
        {
            "id": "01-sql-window",
            "stepNumber": 13,
            "title": "توابع پنجره‌ای (Window Functions)",
            "badge": "درس ۱۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۶۰ دقیقه",
            "summary": "محاسبات پیشرفته (Rolling Total، رتبه‌بندی) بدون کاهش ابعاد جدول",
            "contentHtml": "\n                <p>برخلاف <code>GROUP BY</code> که ردیف‌ها را ادغام می‌کند، توابع پنجره‌ای استقلال سطرها را حفظ می‌کنند.</p>\n                <ul>\n                    <li><code>PARTITION BY</code>: محاسبات آماری به تفکیک دسته‌های مختلف (مثلا میانگین فروش هر کشور کنار اسم کشورها).</li>\n                    <li><code>ORDER BY</code> درون پنجره: برای ساخت مجموع تجمعی (Rolling Total).</li>\n                    <li>توابع رتبه‌بندی: <code>ROW_NUMBER()</code>، <code>RANK()</code>، و <code>DENSE_RANK()</code>.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "مجموع تجمعی حقوق به تفکیک جنسیت",
                    "language": "sql",
                    "code": "SELECT dem.gender, sal.salary, \n  SUM(sal.salary) OVER(PARTITION BY dem.gender ORDER BY dem.employee_id) AS rolling_total \nFROM employee_demographics dem \nJOIN employee_salary sal ON dem.employee_id = sal.employee_id;"
                },
                {
                    "title": "سیستم‌های رتبه‌بندی",
                    "language": "sql",
                    "code": "SELECT employee_id, salary, \n  ROW_NUMBER() OVER(ORDER BY salary DESC) AS row_num, \n  RANK() OVER(ORDER BY salary DESC) AS rank_num, \n  DENSE_RANK() OVER(ORDER BY salary DESC) AS dense_rank_num \nFROM employee_salary;"
                }
            ],
            "industryExercises": [
                {
                    "title": "رتبه‌بندی محصولات هر دسته‌بندی",
                    "industry": "تجارت الکترونیک",
                    "difficulty": "حرفه‌ای",
                    "scenario": "می‌خواهیم ارزان‌ترین و گران‌ترین محصولات هر دسته (Category) را بدون از دست دادن اطلاعات خود محصول پیدا کنیم.",
                    "task": "با DENSE_RANK محصولات را درون هر دسته (PARTITION BY) بر اساس قیمت نزولی رتبه‌بندی کنید.",
                    "hint": "DENSE_RANK() OVER(PARTITION BY category_id ORDER BY price DESC)",
                    "solutionLanguage": "sql",
                    "solutionCode": "SELECT \n  product_name, \n  category_id, \n  price, \n  DENSE_RANK() OVER(PARTITION BY category_id ORDER BY price DESC) AS price_rank \nFROM store.products;",
                    "solutionExplanation": "استفاده از PARTITION BY باعث می‌شود که سیستمِ رتبه‌دهی برای هر دسته‌بندی مجدداً از عدد ۱ شروع شود. در مصاحبه‌ها بسیار سوال می‌شود!"
                }
            ],
            "keyTakeaways": [
                "توابع پنجره‌ای کلیدی‌ترین مهارت SQL برای ورود به شغل تحلیل‌گر داده است. بدون آن مصاحبه رد می‌شوید!"
            ]
        },
        {
            "id": "01-sql-cte",
            "stepNumber": 14,
            "title": "عبارات جدول مشترک (CTEs)",
            "badge": "درس ۱۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "نوشتن کدهای تمیزتر و جایگزینی ساب‌کوئری‌های تو در تو با WITH",
            "contentHtml": "\n                <p>CTE به شما امکان می‌دهد یک بلوک محاسباتی از زیرپرس‌وجو را نام‌گذاری کرده و در کوئری اصلی استفاده کنید.</p>\n                <ul>\n                    <li>با کلیدواژه <code>WITH</code> آغاز می‌شود.</li>\n                    <li>خوانایی کدها را برای همکاران تیم به شدت بالا می‌برد.</li>\n                    <li>می‌توان چندین CTE مختلف را پشت‌سرهم تعریف کرد (با ویرگول جدا می‌شوند).</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "تعریف یک CTE ساده",
                    "language": "sql",
                    "code": "WITH CTE_Example AS (\n  SELECT gender, AVG(salary) AS avg_sal \n  FROM employee_demographics dem \n  JOIN employee_salary sal ON dem.employee_id = sal.employee_id \n  GROUP BY gender\n)\nSELECT * FROM CTE_Example;"
                },
                {
                    "title": "استفاده از چندین CTE",
                    "language": "sql",
                    "code": "WITH CTE_Demographics AS (\n  SELECT employee_id, gender FROM employee_demographics\n),\nCTE_Salary AS (\n  SELECT employee_id, salary FROM employee_salary\n)\nSELECT * FROM CTE_Demographics d JOIN CTE_Salary s ON d.employee_id = s.employee_id;"
                }
            ],
            "industryExercises": [
                {
                    "title": "محاسبه درصد سوددهی",
                    "industry": "مالی",
                    "difficulty": "پیشرفته",
                    "scenario": "مدیر مالی می‌خواهد مجموع درآمد (Revenue) و مجموع هزینه‌ها (Cost) را محاسبه کرده و در نهایت حاشیه سود (Margin) را نشان دهد. کوئری تو در تو خوانا نیست.",
                    "task": "دو CTE مجزا (یکی برای مجموع درآمد، یکی برای مجموع هزینه) بنویسید و در کوئری نهایی آن‌ها را تفریق کنید.",
                    "hint": "WITH TotalRev AS (...), TotalCost AS (...) SELECT ...",
                    "solutionLanguage": "sql",
                    "solutionCode": "WITH Revenue AS (\n  SELECT SUM(amount) AS total_revenue FROM finance.incomes\n),\nCosts AS (\n  SELECT SUM(amount) AS total_cost FROM finance.expenses\n)\nSELECT \n  r.total_revenue, \n  c.total_cost, \n  (r.total_revenue - c.total_cost) AS net_margin \nFROM Revenue r, Costs c;",
                    "solutionExplanation": "در اینجا چون هر دو CTE صرفا یک سطر (مجموع) بازمی‌گردانند، نیازی به JOIN کردن با کلید خاصی نیست (Cross Join انجام می‌شود) و محاسبات بسیار خوانا می‌شود."
                }
            ],
            "keyTakeaways": [
                "کدهای محیط واقعی (صنعتی) اکثرا هزار خطی هستند؛ بدون CTE دیباگ کردن آن‌ها غیرممکن است."
            ]
        },
        {
            "id": "01-sql-temp-tables",
            "stepNumber": 15,
            "title": "جداول موقت (Temporary Tables)",
            "badge": "درس ۱۳",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "ایجاد جداول موقت برای نگهداری داده‌های سنگین در طول نشست فعال",
            "contentHtml": "\n                <p>جداول موقت تنها در نشست (Session) فعال فعلی وجود دارند و به محض قطع ارتباط نابود می‌شوند.</p>\n                <p>موارد کاربرد: نگهداری خروجی محاسبات سنگین و پرهزینه برای استفاده مکرر در چندین کوئری مختلف.</p>\n                <ul>\n                    <li><strong>روش اول:</strong> تعریف دستی با <code>CREATE TEMPORARY TABLE</code>.</li>\n                    <li><strong>روش دوم:</strong> ساخت و پر کردن خودکار از روی جدول دیگر با استفاده از <code>CREATE TEMPORARY TABLE ... SELECT ...</code></li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "ساخت خودکار جدول موقت",
                    "language": "sql",
                    "code": "CREATE TEMPORARY TABLE salary_over_50k \nSELECT * FROM employee_salary \nWHERE salary >= 50000;\n\nSELECT * FROM salary_over_50k;"
                }
            ],
            "industryExercises": [
                {
                    "title": "پایپ‌لاین پردازش داده موقت",
                    "industry": "مهندسی داده",
                    "difficulty": "متوسط",
                    "scenario": "کوئری استخراج مشتریان فعال بیش از ۵ دقیقه طول می‌کشد. برای گزارش‌گیری به این لیست سه بار نیاز دارید.",
                    "task": "مشتریان فعال (last_login > 2024) را درون یک Temp Table بریزید تا در کوئری‌های بعدی به سرعت از آن استفاده کنید.",
                    "hint": "CREATE TEMPORARY TABLE active_users SELECT ...",
                    "solutionLanguage": "sql",
                    "solutionCode": "CREATE TEMPORARY TABLE temp_active_users \nSELECT user_id, email, last_login \nFROM crm.users \nWHERE last_login >= '2024-01-01';\n\n-- اکنون این جدول در مموری سریع است\nSELECT COUNT(*) FROM temp_active_users;",
                    "solutionExplanation": "تفاوت اصلی با CTE این است که CTE فقط در دستور متصل به خودش معتبر است، اما جدول موقت در طول کل سشن دیتابیس زنده می‌ماند."
                }
            ],
            "keyTakeaways": [
                "در پایگاه‌های داده تحلیلی مدرن ابری (مانند BigQuery)، استفاده از CTE و پردازش‌های In-memory جایگزین Temp Tableهای کلاسیک شده است."
            ]
        },
        {
            "id": "01-sql-stored-proc",
            "stepNumber": 16,
            "title": "روال‌های ذخیره‌شده (Stored Procedures)",
            "badge": "درس ۱۴",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "نوشتن رویه‌های ذخیره شده برای اجرای خودکار کدهای پرکاربرد با پارامتر",
            "contentHtml": "\n                <p>روال‌های ذخیره‌شده کدهای آماده SQL هستند که روی سرور دیتابیس ذخیره می‌شوند تا بارها فراخوانی شوند.</p>\n                <ul>\n                    <li>با <code>CREATE PROCEDURE</code> ایجاد و با <code>CALL</code> اجرا می‌شوند.</li>\n                    <li>نقش حیاتی DELIMITER: تغییر موقت <code>;</code> به <code>$$</code> تا بدنه روال یکپارچه کامپایل شود.</li>\n                    <li>امکان استفاده از پارامترهای ورودی (IN) برای تولید کدهای داینامیک.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "ساخت و فراخوانی رویه",
                    "language": "sql",
                    "code": "DELIMITER $$ \nCREATE PROCEDURE get_employee_salary(IN p_employee_id INT) \nBEGIN \n  SELECT employee_id, salary \n  FROM employee_salary \n  WHERE employee_id = p_employee_id; \nEND $$ \nDELIMITER ; \n\n-- فراخوانی روال\nCALL get_employee_salary(1);"
                }
            ],
            "industryExercises": [],
            "keyTakeaways": [
                "استفاده از پیشوند p_ برای نام پارامترها (مثل p_user_id) ضروری است تا با نام ستون‌ها تداخل پیدا نکند."
            ]
        },
        {
            "id": "01-sql-triggers",
            "stepNumber": 17,
            "title": "خودکارسازی با تریگرها (Triggers) و رویدادها (Events)",
            "badge": "درس ۱۵",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "واکنش خودکار پایگاه داده به تغییرات ردیف‌ها و اجرای کوئری در زمان‌های مشخص",
            "contentHtml": "\n                <p><strong>تریگرها (Triggers):</strong> قطعه کدی که در پاسخ به رخدادهای دستکاری داده (INSERT، UPDATE، DELETE) روی یک جدول مشخص به صورت آنی اجرا می‌شود.</p>\n                <p><strong>رویدادها (Events):</strong> فرآیندهایی که وابسته به فعالیت کاربر نبوده و بر اساس تقویم زمان‌بندی (Schedule) اجرا می‌شوند.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "ساخت یک تریگر AFTER INSERT",
                    "language": "sql",
                    "code": "DELIMITER $$ \nCREATE TRIGGER trg_after_salary_insert \n  AFTER INSERT ON employee_salary \n  FOR EACH ROW \nBEGIN \n  INSERT INTO employee_demographics (employee_id, first_name) \n  VALUES (NEW.employee_id, NEW.first_name); \nEND $$ \nDELIMITER ;"
                },
                {
                    "title": "ایجاد یک رویداد زمان‌بندی شده",
                    "language": "sql",
                    "code": "DELIMITER $$ \nCREATE EVENT evt_retire_elderly_employees \nON SCHEDULE EVERY 30 DAY \nDO \nBEGIN \n  DELETE FROM employee_demographics WHERE age >= 60; \nEND $$ \nDELIMITER ;"
                }
            ],
            "industryExercises": [],
            "keyTakeaways": [
                "برای دسترسی به داده‌ای که همین الان INSERT شده در بدنه تریگر از کلیدواژه NEW و برای ردیفی که DELETE شده از OLD استفاده کنید."
            ]
        },
        {
            "id": "01-sql-final-project",
            "stepNumber": 18,
            "title": "پروژه صنعتی: فرآیند End-to-End پاکسازی داده‌ها (Data Cleaning)",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۱۲۰ دقیقه",
            "summary": "اجرای کامل سناریوی دنیای واقعی برای پاکسازی پایگاه داده شرکت",
            "contentHtml": "\n                <p>در پروژه‌های واقعی، ۸۰ درصد زمان شما صرف آماده‌سازی داده (Data Cleaning) می‌شود. در این پروژه ما چهار گام اصلی را روی جدول فرضی <code>world_layoffs</code> انجام می‌دهیم:</p>\n                <ol>\n                    <li>حذف ردیف‌های تکراری (Remove Duplicates)</li>\n                    <li>استانداردسازی اطلاعات (Standardize Data - توابع String و Date)</li>\n                    <li>برخورد با مقادیر Null و خالی (Null and Blank values)</li>\n                    <li>حذف ستون‌ها و ردیف‌های غیرقابل استفاده</li>\n                </ol>\n            ",
            "codeBlocks": [
                {
                    "title": "۱. شناسایی رکوردهای تکراری با ROW_NUMBER",
                    "language": "sql",
                    "code": "WITH duplicate_cte AS (\n  SELECT *, \n    ROW_NUMBER() OVER(\n      PARTITION BY company, location, industry, total_laid_off, date\n    ) AS row_num \n  FROM layoffs_staging\n)\nSELECT * FROM duplicate_cte WHERE row_num > 1;"
                },
                {
                    "title": "۲. استانداردسازی فیلد صنعت (Industry)",
                    "language": "sql",
                    "code": "UPDATE layoffs_staging \nSET industry = 'Crypto' \nWHERE industry LIKE 'Crypto%';"
                },
                {
                    "title": "۳. پر کردن مقادیر Null با استفاده از SELF JOIN",
                    "language": "sql",
                    "code": "UPDATE layoffs_staging t1 \nJOIN layoffs_staging t2 \n  ON t1.company = t2.company \nSET t1.industry = t2.industry \nWHERE t1.industry IS NULL \n  AND t2.industry IS NOT NULL;"
                }
            ],
            "industryExercises": [],
            "keyTakeaways": [
                "هرگز تغییرات پاکسازی را مستقیماً روی جدول اصلی پروداکشن (Raw Data) انجام ندهید. همیشه یک جدول Staging بسازید."
            ]
        },
        {
            "id": "01-sql-final-eda",
            "stepNumber": 19,
            "title": "پروژه صنعتی: تحلیل اکتشافی داده‌ها (EDA)",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۹۰ دقیقه",
            "summary": "کاوش داده‌های تمیز شده برای یافتن الگوها، ترندها و بینش‌های تجاری",
            "contentHtml": "\n                <p>پس از Data Cleaning، وارد فاز <strong>Exploratory Data Analysis (EDA)</strong> می‌شویم. هدف ما استخراج Insights تجاری است:</p>\n                <ul>\n                    <li>کدام شرکت‌ها بیشترین تعدیل نیرو را داشته‌اند؟</li>\n                    <li>ترند تعدیل نیرو در صنایع مختلف در گذر زمان چگونه بوده است؟</li>\n                    <li>محاسبه Rolling Total مجموع اخراجی‌ها بر اساس ماه.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "بیشترین تعدیل بر اساس صنعت",
                    "language": "sql",
                    "code": "SELECT industry, SUM(total_laid_off) \nFROM layoffs_staging \nGROUP BY industry \nORDER BY 2 DESC;"
                },
                {
                    "title": "مجموع تجمعی اخراجی‌ها در هر ماه (Rolling Total)",
                    "language": "sql",
                    "code": "WITH Rolling_Total AS (\n  SELECT SUBSTRING(date,1,7) AS `month`, SUM(total_laid_off) AS total_off \n  FROM layoffs_staging \n  WHERE SUBSTRING(date,1,7) IS NOT NULL \n  GROUP BY `month`\n)\nSELECT `month`, total_off, \n  SUM(total_off) OVER(ORDER BY `month`) AS rolling_total \nFROM Rolling_Total;"
                }
            ],
            "industryExercises": [
                {
                    "title": "تحلیل کمپین فروش - خروجی برای داشبورد",
                    "industry": "همه صنایع",
                    "difficulty": "حرفه‌ای",
                    "scenario": "مدیر اجرایی (CEO) یک گزارش از شما می‌خواهد که بهترین ماه فروش هر سال را به همراه میزان فروش آن نمایش دهد.",
                    "task": "ابتدا با استفاده از توابع تجمعی و GROUP BY فروش هر ماه در هر سال را حساب کنید. سپس با استفاده از توابع پنجره‌ای (DENSE_RANK) بهترین ماه هر سال را استخراج کنید.",
                    "hint": "نیاز به دو CTE دارید. اولی برای تجمیع فروش در سطح سال-ماه، دومی برای رتبه‌دهی.",
                    "solutionLanguage": "sql",
                    "solutionCode": "WITH MonthlySales AS (\n  SELECT \n    YEAR(order_date) AS order_year, \n    MONTH(order_date) AS order_month, \n    SUM(sales_amount) AS total_sales \n  FROM sales \n  GROUP BY YEAR(order_date), MONTH(order_date)\n),\nRankedSales AS (\n  SELECT \n    order_year, \n    order_month, \n    total_sales,\n    DENSE_RANK() OVER(PARTITION BY order_year ORDER BY total_sales DESC) as rnk\n  FROM MonthlySales\n)\nSELECT order_year, order_month, total_sales \nFROM RankedSales \nWHERE rnk = 1;",
                    "solutionExplanation": "این دقیقاً کوئری‌ای است که در داشبوردهای BI پشت پرده اجرا می‌شود و تسلط بر آن شما را در زمره تحلیل‌گران ارشد قرار می‌دهد."
                }
            ],
            "keyTakeaways": [
                "تحلیل اکتشافی (EDA) به معنی سوال پرسیدن از داده است. همیشه سعی کنید پیش از نوشتن کوئری، سوال تجاری را به دقت روی کاغذ رسم کنید."
            ]
        }
    ]
});