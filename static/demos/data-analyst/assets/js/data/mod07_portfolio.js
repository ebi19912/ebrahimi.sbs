window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "07-portfolio",
    "number": "07",
    "folderName": "07-Building a Portfolio Website",
    "title": "ساخت وب‌سایت پورتفولیو تحلیل داده",
    "subtitle": "میزبانی رایگان روی GitHub Pages، شخصی‌سازی قالب‌های HTML و نمایش پروژه‌ها",
    "icon": "globe",
    "category": "مسیر شغلی",
    "estimatedHours": 10,
    "filePath": "07-Building a Portfolio Website/Portfolio_Handbook.md",
    "steps": [
        {
            "id": "07-portfolio-intro",
            "stepNumber": 1,
            "title": "مقدمه: چرا وب‌سایت پورتفولیو؟",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۰ دقیقه",
            "summary": "تأثیر داشتن سایت اختصاصی روی شانس دعوت به مصاحبه",
            "contentHtml": "\n                <p>پورتفولیو پایگاهی متمرکز برای مستندسازی و نمایش مهارت‌های شما به مدیران استخدام است.</p>\n                <h3>دو مزیت حیاتی</h3>\n                <ul>\n                    <li><strong>افزایش شانس مصاحبه:</strong> کارفرما به جای خواندن ادعاهای متنی رزومه، روی لینک کلیک کرده و خروجی کدها و داشبوردهای شما را زنده می‌بیند.</li>\n                    <li><strong>تسلط در مصاحبه فنی:</strong> در پاسخ به سوالات مصاحبه، می‌توانید به جای کلی‌گویی، به چالش‌های حل‌شده در پروژه‌های واقعی خود ارجاع دهید.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "ساخت ۳ الی ۵ پروژه عمیق و کاربردی (مثلا با SQL، Python و Tableau) پیش از شروع ارسال رزومه‌ها الزامی است."
            ]
        },
        {
            "id": "07-portfolio-hosting",
            "stepNumber": 2,
            "title": "روش‌های پیاده‌سازی و میزبانی رایگان",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۱۵ دقیقه",
            "summary": "مقایسه سایت‌سازها با GitHub Pages",
            "contentHtml": "\n                <p>دو رویکرد اصلی برای راه‌اندازی سایت وجود دارد:</p>\n                <ul>\n                    <li><strong>سایت‌سازها (مثل Wix):</strong> راحت اما دارای محدودیت و تبلیغات در نسخه رایگان.</li>\n                    <li><strong>هاست ابری GitHub Pages (توصیه شده):</strong> ۱۰۰٪ رایگان، بدون تبلیغات، دامنه اختصاصی <code>username.github.io</code> و نشان‌دهنده تسلط شما به مفاهیم پایه Git/GitHub.</li>\n                </ul>\n                <br>\n                <h3>استفاده از قالب‌های آماده</h3>\n                <p>برای گیت‌هاب پیجز، نیازی نیست طراح وب باشید. از قالب‌های استاندارد و واکنش‌گرای سایت <strong>HTML5 UP</strong> (مانند قالب Massively) استفاده می‌کنیم.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "سوال مصاحبه: چرا گیت‌هاب پیجز؟",
                    "industry": "توسعه شغلی",
                    "difficulty": "مقدماتی",
                    "scenario": "مدیر استخدام از شما می‌پرسد چرا پورتفولیوی خود را روی گیت‌هاب پیجز بالا آورده‌اید به جای اینکه از پلتفرم‌های آماده یا یک وبلاگ ساده استفاده کنید؟",
                    "task": "بهترین پاسخ حرفه‌ای چیست؟",
                    "hint": "نمایش مهارت‌های جانبی",
                    "solutionLanguage": "markdown",
                    "solutionCode": "«استفاده از GitHub Pages به من این امکان را می‌دهد که علاوه بر نمایش پروژه‌ها، تسلط خود را بر سیستم کنترل نسخه (Git) و مدیریت مخازن (Repositories) نشان دهم که از مهارت‌های ضروری کار تیمی در تیم‌های دیتای مدرن است.»",
                    "solutionExplanation": "کارفرمایان به دنبال نشانه‌هایی از استقلال و دانش فنی فراتر از حد پایه هستند."
                }
            ],
            "keyTakeaways": [
                "دامین name.github.io در جامعه تک (Tech) به عنوان استاندارد پورتفولیوی توسعه‌دهندگان و مهندسان داده شناخته می‌شود."
            ]
        },
        {
            "id": "07-portfolio-html",
            "stepNumber": 3,
            "title": "شخصی‌سازی کدهای HTML",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "ویرایش Title، Header و لینک شبکه‌های اجتماعی",
            "contentHtml": "\n                <p>پس از دانلود فایل قالب (مثلاً Massively)، فایل <code>index.html</code> را در ادیتوری مثل VS Code باز می‌کنیم.</p>\n                <h3>۱. تنظیم متادیتا و هدر</h3>\n                <p>تگ <code>&lt;title&gt;</code> نام تب مرورگر را تغییر می‌دهد. در بخش <code>&lt;header&gt;</code> و <code>&lt;div id=\"intro\"&gt;</code> باید عنوان شغلی خود (مثلاً Data Analyst) را بنویسید.</p>\n                <br>\n                <h3>۲. لینک‌دهی به لینکدین و گیت‌هاب</h3>\n                <p>در بخش <code>&lt;ul class=\"icons\"&gt;</code> ویژگی <code>href</code> را به آدرس پروفایل لینکدین خود تغییر دهید. این مهم‌ترین راه ارتباطی کارفرمایان با شماست.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "نمونه تگ معرفی در HTML",
                    "language": "html",
                    "code": "<div id=\"intro\">\n    <h1>Data Analytics Portfolio<br />\n    By [Your Name]</h1>\n    <p>Data Analyst skilled in SQL, Tableau, and Python.</p>\n</div>"
                }
            ],
            "industryExercises": [
                {
                    "title": "بررسی لینک‌های شکسته",
                    "industry": "تضمین کیفیت (QA)",
                    "difficulty": "مقدماتی",
                    "scenario": "در قالب‌های آماده HTML، ویژگی href دکمه‌ها معمولاً روی مقدار '#' تنظیم شده است.",
                    "task": "اگر این علامت را تغییر ندهید چه اتفاقی می‌افتد؟",
                    "hint": "رفتار پیش‌فرض مرورگر",
                    "solutionLanguage": "markdown",
                    "solutionCode": "با کلیک روی دکمه، صفحه رفرش شده یا کاربر به بالای صفحه پرش می‌کند، اما هیچ سایتی باز نمی‌شود. این کار نشان‌دهنده بی‌دقتی در تست وب‌سایت است و اثر منفی شدیدی روی استخدام دارد.",
                    "solutionExplanation": "باید حتماً تمام علامت‌های '#' را با لینک‌های واقعی پروژه (لینک ریپازیتوری یا لینک تبلو پابلیک) جایگزین کنید."
                }
            ],
            "keyTakeaways": [
                "دکمه‌های قالب آماده را از حالت 'Full Story' به عباراتی مثل 'View Project' در HTML تغییر دهید."
            ]
        },
        {
            "id": "07-portfolio-projects",
            "stepNumber": 4,
            "title": "معماری بخش پروژه‌ها (Project Showcase)",
            "badge": "درس ۳",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "نحوه دسته‌بندی پروژه‌های شاخص و استاندارد در گریدها",
            "contentHtml": "\n                <p>پروژه‌ها معمولاً در دو قالب نمایش داده می‌شوند:</p>\n                <ul>\n                    <li><strong>پروژه ویژه (Featured Post):</strong> در بالاترین قسمت و به صورت بزرگ (مثلاً جامع‌ترین پروژه شما با SQL و Python).</li>\n                    <li><strong>پروژه‌های استاندارد (Posts Grid):</strong> به صورت کارت‌های مربعی زیر پروژه اصلی برای نشان دادن مهارت‌های متنوع (یک کارت برای اکسل، یک کارت برای تبلو و غیره).</li>\n                </ul>\n                <br>\n                <h3>نحوه لینک‌دهی استاندارد</h3>\n                <p>برای تجربه کاربری (UX) بهتر، <strong>سه نقطه کلیک‌پذیر</strong> بسازید: عنوان پروژه، تصویر پروژه، و دکمه 'View Project' باید همگی به یک <code>href</code> مشترک (مخزن گیت‌هاب پروژه) اشاره کنند.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "نمونه کارت پروژه در HTML",
                    "language": "html",
                    "code": "<article>\n    <header>\n        <h2><a href=\"https://github.com/...\">Covid-19 Data Exploration</a></h2>\n    </header>\n    <a href=\"https://github.com/...\" class=\"image fit\">\n        <img src=\"images/covid.jpg\" alt=\"\" />\n    </a>\n    <p>Data exploration of Covid-19 dataset using SQL Server Window Functions.</p>\n    <ul class=\"actions special\">\n        <li><a href=\"https://github.com/...\" class=\"button\">View Project</a></li>\n    </ul>\n</article>"
                }
            ],
            "industryExercises": [
                {
                    "title": "توضیح روایی (Narrative)",
                    "industry": "ارتباطات شغلی",
                    "difficulty": "مقدماتی",
                    "scenario": "یک کارفرما فقط ۵ ثانیه وقت دارد تا کارت پروژه شما را اسکن کند.",
                    "task": "چگونه توضیحات زیر کارت (تگ <p>) را بنویسید که جذاب باشد؟",
                    "hint": "اشاره به ابزار و دستاورد",
                    "solutionLanguage": "markdown",
                    "solutionCode": "به جای 'این پروژه کووید است'، بنویسید: 'تحلیل اکتشافی داده‌های پاندمی با استفاده از توابع تحلیلی پنجره‌ای در SQL Server و ساخت ویوهای تجمیعی جهت طراحی داشبورد.'",
                    "solutionExplanation": "کارفرما در یک نگاه باید نام تکنولوژی، میزان سختی و خروجی کار را ببیند."
                }
            ],
            "keyTakeaways": [
                "تصاویر پیش‌فرض قالب را با اسکرین‌شات‌های واقعی، واضح و جذاب از داشبوردها یا کدهای خود در پوشه images جایگزین کنید."
            ]
        },
        {
            "id": "07-portfolio-deployment",
            "stepNumber": 5,
            "title": "انتشار آنلاین روی GitHub Pages",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "نحوه پوش کردن کدها و راه‌اندازی هاست رایگان ابری",
            "contentHtml": "\n                <p>مرحله نهایی، قرار دادن کدهای HTML و تصاویر ویرایش‌شده روی اینترنت است.</p>\n                <h3>مراحل پیاده‌سازی</h3>\n                <ol>\n                    <li>یک مخزن عمومی (Public Repository) در گیت‌هاب دقیقاً با این نام بسازید: <code>yourusername.github.io</code></li>\n                    <li>فایل‌های ویرایش‌شده پورتفولیو را درون این مخزن آپلود کنید (از طریق Git Bash یا پنل وب).</li>\n                    <li>به بخش <strong>Settings > Pages</strong> در مخزن بروید.</li>\n                    <li>منبع (Source) را روی شاخه <code>main</code> (یا master) قرار داده و دکمه Save را بزنید.</li>\n                </ol>\n                <p>وب‌سایت شما ظرف ۵ دقیقه روی آدرس <code>https://yourusername.github.io</code> در دسترس کل دنیا قرار خواهد گرفت!</p>\n            ",
            "codeBlocks": [
                {
                    "title": "دستورات ترمینال برای آپلود سایت",
                    "language": "bash",
                    "code": "git init\ngit add .\ngit commit -m \"Initial commit of portfolio website\"\ngit branch -M main\ngit remote add origin https://github.com/<username>/<username>.github.io.git\ngit push -u origin main"
                }
            ],
            "industryExercises": [
                {
                    "title": "ادغام پورتفولیو در مسیر شغلی",
                    "industry": "استخدام",
                    "difficulty": "مقدماتی",
                    "scenario": "وب‌سایت شما با موفقیت آپلود شده است. حالا باید آن را به کارفرمایان نشان دهید.",
                    "task": "۳ مکان اصلی که باید این لینک درج شود کجاست؟",
                    "hint": "رزومه، شبکه اجتماعی،...",
                    "solutionLanguage": "markdown",
                    "solutionCode": "1. در **هدر رزومه** دقیقاً زیر نام و کنار شماره تماس و ایمیل.\n2. در پروفایل **لینکدین** در بخش Website Link (بالای صفحه) و همچنین پین کردن در بخش Featured.\n3. در فرم‌های اپلای شرکت‌ها (بخش Website/Portfolio).",
                    "solutionExplanation": "بدون پخش کردن لینک، زیباترین پورتفولیوی دنیا هم دیده نخواهد شد."
                }
            ],
            "keyTakeaways": [
                "همیشه قبل از ارسال رزومه، سایت را روی مرورگر موبایل خود چک کنید تا از واکنش‌گرا (Responsive) بودن آن و بهم نریختن متن‌ها مطمئن شوید."
            ]
        }
    ]
});