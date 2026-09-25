window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "09-interview",
    "number": "09",
    "folderName": "09-Practicing for Data Analyst Interviews",
    "title": "آمادگی و شبیه‌سازی مصاحبه‌های استخدامی",
    "subtitle": "تکنیک بلند فکر کردن، حل تست‌های SQL و دفاع از پروژه‌ها",
    "icon": "chat-right-quote",
    "category": "مسیر شغلی",
    "estimatedHours": 15,
    "filePath": "09-Practicing for Data Analyst Interviews/Interview_Handbook.md",
    "steps": [
        {
            "id": "09-interview-intro",
            "stepNumber": 1,
            "title": "ماهیت مصاحبه‌های فنی",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۰ دقیقه",
            "summary": "چرا شرکت‌ها مصاحبه زنده کدنویسی (Live Coding) برگزار می‌کنند؟",
            "contentHtml": "\n                <p>مدیران استخدام می‌خواهند مطمئن شوند که شما کلمات کلیدی رزومه را فقط کپی نکرده‌اید.</p>\n                <h3>محور اصلی مصاحبه‌های دیتا</h3>\n                <ul>\n                    <li><strong>تسلط بر SQL:</strong> نرم‌افزارهایی مثل تبلو یا پاور بی‌آی معمولاً در جلسه مصاحبه آزمون زنده ندارند، اما زبان SQL تقریباً همیشه به‌صورت زنده (لایو) ارزیابی می‌شود.</li>\n                    <li><strong>جلوگیری از هزینه‌های آموزش:</strong> استخدام فردی که مفاهیم را بلد نیست، برای شرکت ۴ ماه زمانِ آموزش مجدد هزینه دارد.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "در مصاحبه‌های دیتا، مهارت‌های ارتباطی و نحوه تشریح داده‌ها به اندازه کدنویسی اهمیت دارد."
            ]
        },
        {
            "id": "09-interview-think-out-loud",
            "stepNumber": 2,
            "title": "تکنیک طلایی بلند فکر کردن (Think Out Loud)",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۱۵ دقیقه",
            "summary": "بزرگ‌ترین خطای کارجویان: سکوت هنگام کدنویسی",
            "contentHtml": "\n                <p>مصاحبه‌کننده بیش از آنکه به دنبال سینتکس (Syntax) دقیق باشد، می‌خواهد **فرآیند تفکر و منطق حل مسئله شما** را بشنود.</p>\n                <h3>مراحل اجرای تکنیک:</h3>\n                <ol>\n                    <li><strong>شفاف‌سازی سوال:</strong> صورت مسئله را بلند بخوانید و مفروضات را تایید کنید. (مثلاً: آیا ستون تاریخ می‌تواند Null باشد؟)</li>\n                    <li><strong>استدلال توابع:</strong> دلیل انتخاب یک تابع را بگویید. (مثلاً: 'برای پیدا کردن ردیف‌های تکراری، به جای GROUP BY از تابع ROW_NUMBER استفاده می‌کنم چون خوانایی بهتری به من می‌دهد').</li>\n                    <li><strong>برخورد با ارور:</strong> اگر کدی ارور داد، سکوت و دستپاچگی ممنوع! ارور را با صدای بلند بخوانید و ریشه‌یابی کنید. این یک امتیاز مثبت است.</li>\n                </ol>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "شبیه‌سازی مصاحبه تحلیلی",
                    "industry": "توسعه شغلی",
                    "difficulty": "مقدماتی",
                    "scenario": "مصاحبه‌کننده از شما می‌پرسد: «چگونه از SQL یا Tableau استفاده کرده‌اید؟»",
                    "task": "تفاوت پاسخ ضعیف و قوی را بیان کنید.",
                    "hint": "ارجاع به پروژه واقعی",
                    "solutionLanguage": "markdown",
                    "solutionCode": "❌ پاسخ ضعیف: 'من در بوت‌کمپ یاد گرفتم و دستورات SQL را کامل بلدم.'\n\n✔ پاسخ قوی: 'در پروژه اخیرم روی داده‌های مسکن، ۲۰ هزار سطر را وارد دیتابیس کردم. از تابع CASE برای استانداردسازی آدرس‌ها استفاده کردم و با CTE مقادیر تکراری را حذف کردم. سپس همان دیتای تمیز را به تبلو وصل کردم و داشبوردی ساختم که توزیع قیمت‌ها را نشان می‌داد.'",
                    "solutionExplanation": "کارفرما نیازی به شنیدن نام ابزار ندارد، بلکه می‌خواهد بشنود که شما با آن ابزار چه مشکلی را حل کرده‌اید."
                }
            ],
            "keyTakeaways": [
                "سکوت مطلق در زمان نوشتن کد، مصاحبه‌کننده را نسبت به تسلط واقعی شما دچار شک می‌کند."
            ]
        },
        {
            "id": "09-interview-sql-medium",
            "stepNumber": 3,
            "title": "حل مسائل SQL (سطح متوسط)",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "جداسازی رشته‌ها و محاسبه درصدها در شرایط واقعی",
            "contentHtml": "\n                <p>سوالات سطح متوسط معمولاً روی توابع متنی و تجمیع‌های ریاضی تمرکز دارند.</p>\n                <h3>مسئله: تفکیک شناسه و نام</h3>\n                <p><strong>سناریو:</strong> به دلیل خطای ورود داده در سیستم، شناسه ۵ کاراکتری مشتری به نام او چسبیده است (مثلاً: <code>10123Alice</code>). کوئری بنویسید که شناسه و نام را جدا کند.</p>\n                <p><strong>تحلیل کلامی:</strong> چون طول شناسه همیشه ثابت و ۵ است، از تابع <code>SUBSTRING</code> استفاده می‌کنیم.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "حل مسئلہ تفکیک",
                    "language": "sql",
                    "code": "SELECT \n    SUBSTRING(combined_data, 1, 5) AS id,\n    SUBSTRING(combined_data, 6) AS first_name\nFROM customer_raw_data;"
                },
                {
                    "title": "محاسبه درصد تعدیل نیرو",
                    "language": "sql",
                    "code": "SELECT \n    company,\n    ROUND((employees_fired / total_employees) * 100, 2) AS layoff_percentage\nFROM company_layoffs\nORDER BY layoff_percentage DESC;"
                }
            ],
            "industryExercises": [],
            "keyTakeaways": [
                "همیشه قبل از استفاده از تقسیم در محاسبه درصدها، احتمال صفر بودن مخرج (Zero Division) را در نظر بگیرید و به مصاحبه‌کننده بگویید که حواستان به آن هست."
            ]
        },
        {
            "id": "09-interview-sql-hard",
            "stepNumber": 4,
            "title": "حل مسائل پیشرفته SQL (توابع پنجره‌ای)",
            "badge": "درس ۳",
            "isIntroOrSetup": false,
            "estimatedTime": "۴۵ دقیقه",
            "summary": "نحوه استفاده از Window Functions در مسائل رتبه‌بندی و مقایسه",
            "contentHtml": "\n                <p>اکثر شرکت‌های برتر برای ارزیابی سطح ارشد، مستقیماً به سراغ توابع پنجره‌ای (Window Functions) می‌روند.</p>\n                <h3>مسئله: سومین خرید هر مشتری</h3>\n                <p><strong>سناریو:</strong> می‌خواهیم دقیقاً سومین خرید هر مشتری را بر اساس تاریخ سفارش پیدا کنیم.</p>\n                <p><strong>تحلیل کلامی:</strong> برای این کار نیازمند رتبه‌بندی درون‌گروهی هستیم. با استفاده از تابع <code>ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY order_date)</code> به هر تراکنش یک شماره می‌دهیم، سپس با یک <strong>CTE</strong>، آن‌هایی که رتبه‌شان ۳ است را استخراج می‌کنیم.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "شناسایی سومین تراکنش",
                    "language": "sql",
                    "code": "WITH RankedPurchases AS (\n    SELECT \n        customer_id,\n        order_date,\n        amount,\n        ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY order_date ASC) as purchase_rank\n    FROM customer_transactions\n)\nSELECT *\nFROM RankedPurchases\nWHERE purchase_rank = 3;"
                }
            ],
            "industryExercises": [
                {
                    "title": "نوسانات دمایی با LAG",
                    "industry": "همه صنایع",
                    "difficulty": "پیشرفته",
                    "scenario": "تاریخ‌هایی را پیدا کنید که دمای هوا نسبت به روز گذشته بیشتر بوده است.",
                    "task": "چگونه به سطر قبلی دسترسی پیدا می‌کنید؟",
                    "hint": "تابع دسترسی به قبل.",
                    "solutionLanguage": "sql",
                    "solutionCode": "WITH TempData AS (\n    SELECT \n        record_date,\n        temperature,\n        LAG(temperature, 1) OVER (ORDER BY record_date) AS prev_temperature\n    FROM weather_records\n)\nSELECT record_date FROM TempData\nWHERE temperature > prev_temperature;",
                    "solutionExplanation": "مصاحبه‌کنندگان عاشق تابع LAG() و LEAD() برای مقایسه سطر فعلی با سطر قبلی/بعدی هستند. این کار نیاز به Self Join را کاملا برطرف می‌کند."
                }
            ],
            "keyTakeaways": [
                "توابع ROW_NUMBER و LAG پرکاربردترین مفاهیم مصاحبه‌های سخت هستند و نشان‌دهنده تسلط شما بر منطق پیشرفته SQL می‌باشند."
            ]
        }
    ]
});