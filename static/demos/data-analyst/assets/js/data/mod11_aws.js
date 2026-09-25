window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "11-aws",
    "number": "11",
    "folderName": "11-AWS",
    "title": "رایانش ابری کلان‌داده با Amazon AWS",
    "subtitle": "تسلط بر اکوسیستم داده آمازون: S3، Redshift، Athena و Glue",
    "icon": "server",
    "category": "ابری و پیشرفته",
    "estimatedHours": 12,
    "filePath": "11-AWS/AWS_Handbook.md",
    "steps": [
        {
            "id": "11-aws-intro",
            "stepNumber": 1,
            "title": "مقدمه: چرا آمازون (AWS)؟",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۰ دقیقه",
            "summary": "بزرگترین پلتفرم ابری دنیا و تفاوت آن با Azure",
            "contentHtml": "\n                <p>آمازون وب‌سرویس (AWS) بزرگترین و بالغ‌ترین ارائه‌دهنده خدمات ابری در جهان است.</p>\n                <h3>جایگاه در بازار</h3>\n                <p>در حالی که آژور بیشتر در شرکت‌های سنتی و مایکروسافت‌محور استفاده می‌شود، AWS انتخاب اول استارتاپ‌ها، شرکت‌های تکنولوژی‌محور و پروژه‌های متن‌باز (Open-Source) است.</p>\n                <br>\n                <h3>گواهینامه‌های ارزشمند</h3>\n                <p>داشتن گواهینامه‌هایی مثل <code>AWS Certified Cloud Practitioner</code> یا <code>Data Engineer</code> شانس استخدام را در این شرکت‌ها چند برابر می‌کند.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "بیشتر شرکت‌هایی که روی اکوسیستم لینوکس و پایتون کار می‌کنند، زیرساخت خود را روی AWS بنا می‌کنند."
            ]
        },
        {
            "id": "11-aws-core-services",
            "stepNumber": 2,
            "title": "۴ سرویس حیاتی AWS در تحلیل داده",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "آشنایی با S3، Redshift، Glue و Athena",
            "contentHtml": "\n                <p>برای تبدیل شدن به مهندس یا تحلیلگر داده در ابر، تسلط بر این ۴ سرویس الزامی است:</p>\n                <ul>\n                    <li><strong>Amazon S3 (Data Lake):</strong> هارد بی‌نهایت ابری. محل فرود اولیه تمام فایل‌های خام (CSV, JSON, عکس).</li>\n                    <li><strong>AWS Glue (ETL):</strong> ربات کارگر آمازون! دیتای خام را از S3 می‌گیرد، با پایتون تمیز می‌کند و ذخیره می‌کند.</li>\n                    <li><strong>Amazon Redshift (Warehouse):</strong> انبار داده فوق‌سریع برای کوئری‌های سنگین. دیتابیسی که داشبوردها به آن وصل می‌شوند.</li>\n                    <li><strong>Amazon Athena (Serverless Query):</strong> جذاب‌ترین ابزار! به شما اجازه می‌دهد مستقیماً روی فایل متنی داخل S3 دستور SQL بنویسید (بدون نیاز به دیتابیس).</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "تفاوت S3 با دیتابیس",
                    "industry": "همه صنایع",
                    "difficulty": "مقدماتی",
                    "scenario": "مدیر می‌گوید: چرا دیتای کاربران را در S3 ذخیره نکنیم تا هزینه کمتر شود؟",
                    "task": "چرا نمی‌توان از S3 به عنوان دیتابیس اپلیکیشن استفاده کرد؟",
                    "hint": "ساختار فایل در برابر تراکنش",
                    "solutionLanguage": "markdown",
                    "solutionCode": "«چون S3 یک Object Storage (ذخیره‌ساز فایل) است، نه یک دیتابیس تراکنشی (OLTP). ما نمی‌توانیم مثل SQL دستور UPDATE بزنیم تا فقط شماره موبایل یک کاربر عوض شود؛ بلکه باید کل فایل را دانلود، ویرایش و دوباره آپلود کنیم. S3 برای دیتای تحلیلی است، نه تراکنشی.»",
                    "solutionExplanation": "درک تفاوت Object Storage با دیتابیس، یکی از مبانی رایانش ابری است."
                }
            ],
            "keyTakeaways": [
                "تمام پروژه‌های دیتایی آمازون از S3 شروع می‌شوند."
            ]
        },
        {
            "id": "11-aws-architecture",
            "stepNumber": 3,
            "title": "معماری داده در AWS",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "نحوه چیدن قطعات پازل (پایپ‌لاین داده)",
            "contentHtml": "\n                <p>مسیر حرکت داده در پروژه‌های واقعی آمازون (Data Pipeline):</p>\n                <ol>\n                    <li>ورود داده‌های خام از سایت به <strong>Amazon S3 (Raw Bucket)</strong>.</li>\n                    <li>سرویس <strong>AWS Glue</strong> داده‌ها را باز کرده، مقادیر Null را حذف کرده و فرمت آن‌ها را به Parquet تغییر می‌دهد.</li>\n                    <li>داده‌های تمیز در <strong>Amazon S3 (Cleansed Bucket)</strong> ذخیره می‌شوند.</li>\n                    <li>داده‌ها در <strong>Redshift</strong> لود می‌شوند تا داشبوردهای Tableau آپدیت شوند.</li>\n                </ol>\n            ",
            "codeBlocks": [
                {
                    "title": "متن تخصصی رزومه",
                    "language": "markdown",
                    "code": "«طراحی پایپ‌لاین ETL با AWS Glue جهت تبدیل فایل‌های CSV به Parquet و ذخیره‌سازی در Amazon S3 برای بهینه‌سازی کوئری‌های Athena.»"
                }
            ],
            "industryExercises": [],
            "keyTakeaways": [
                "استفاده هوشمندانه از نام سرویس‌های به هم پیوسته (مثل S3 به Glue به Redshift) در رزومه، تسلط عملیاتی شما را ثابت می‌کند."
            ]
        },
        {
            "id": "11-aws-parquet-athena",
            "stepNumber": 4,
            "title": "فرمت Parquet و کوئری‌گیری در Athena",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "راز کاهش ۹۰ درصدی هزینه‌ها در رایانش ابری",
            "contentHtml": "\n                <p>این مبحث یکی از پرتکرارترین سوالات مصاحبه‌های ابری است.</p>\n                <h3>مشکل فرمت CSV</h3>\n                <p>فایل‌های CSV ساختار سطری (Row-based) دارند. وقتی در ابر روی ۱۰۰ ستون کوئری می‌زنید تا فقط میانگین ستون 'سن' را بگیرید، کل فایل اسکن می‌شود و آمازون هزینه کامل را از شما می‌گیرد.</p>\n                <br>\n                <h3>راه حل: Apache Parquet</h3>\n                <p>فرمت پارکت ساختار ستونی (Columnar) دارد. اگر کوئری فقط ستون 'سن' را بخواهد، فقط همان ستون از روی هارد خوانده می‌شود. این کار سرعت <strong>Amazon Athena</strong> را صدها برابر کرده و هزینه‌ها را شدیداً کاهش می‌دهد.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "محاسبه هزینه Athena",
                    "industry": "مهندسی داده",
                    "difficulty": "حرفه‌ای",
                    "scenario": "آمازون در سرویس Athena به ازای هر ترابایت دیتایی که هنگام اجرای کوئری اسکن می‌شود، پول دریافت می‌کند.",
                    "task": "چرا استفاده از عبارت `SELECT *` در Athena ممنوع و کشنده است؟",
                    "hint": "اسکن کامل",
                    "solutionLanguage": "markdown",
                    "solutionCode": "«چون دستور `SELECT *` باعث می‌شود تمام ستون‌های فایل (حتی اگر فرمت آن Parquet باشد) اسکن شوند. این کار هزینه کوئری را به حداکثر ممکن می‌رساند. همیشه باید فقط نام ستون‌های مورد نیاز نوشته شود.»",
                    "solutionExplanation": "نوشتن کوئری‌های بهینه (Cost-optimized) در محیط کلود، ارزشمندترین مهارت یک تحلیلگر است."
                }
            ],
            "keyTakeaways": [
                "در محیط ابری، SQL بد ننوشتن فقط باعث کندی نمی‌شود، بلکه مستقیماً پول شرکت را هدر می‌دهد!"
            ]
        }
    ]
});