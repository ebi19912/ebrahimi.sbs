window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "02-excel",
    "number": "02",
    "folderName": "02-Excel",
    "title": "تحلیل داده و داشبوردسازی در Microsoft Excel",
    "subtitle": "از مفاهیم اولیه تا فرمول‌نویسی پیشرفته، XLOOKUP، پیوت تیبل و ساخت داشبورد تعاملی",
    "icon": "sheet",
    "category": "فنی",
    "estimatedHours": 12,
    "filePath": "02-Excel/Excel_Handbook.md",
    "steps": [
        {
            "id": "02-excel-intro",
            "stepNumber": 1,
            "title": "مقدمه: جایگاه اکسل در زیست‌بوم تحلیل داده",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۰ دقیقه",
            "summary": "چرا با وجود پایتون و SQL، همچنان اکسل برای تحلیلگر داده حیاتی است؟",
            "contentHtml": "\n                <p>اکسل یکی از بنیادین‌ترین، محبوب‌ترین و دردسترس‌ترین ابزارهای تحلیل داده در سازمان‌ها است.</p>\n                <h3>چرا اکسل برای تحلیلگر داده حیاتی است؟</h3>\n                <ul>\n                    <li><strong>زبان مشترک با مدیران و ذی‌نفعان (Stakeholders):</strong> بسیاری از مدیران تمایلی به بررسی کدهای پایتون یا کوئری‌های SQL ندارند؛ خروجی نهایی اغلب به‌صورت گزارش اکسل است.</li>\n                    <li><strong>بررسی سریع داده‌ها (Ad-hoc Analysis):</strong> برای مجموعه‌داده‌های کوچک تا متوسط، اکسل سریع‌ترین محیط برای کاوش، مرتب‌سازی و اعتبارسنجی است.</li>\n                    <li><strong>عملیات پاک‌سازی سبک (Light ETL):</strong> اصلاح فرمت‌های ناقص، حذف فاصله‌های اضافی و یکپارچه‌سازی متون در اکسل بسیار روان انجام می‌شود.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "اکسل زبان مشترک بین تیم فنی و تیم‌های کسب‌وکار (بیزینس) است."
            ]
        },
        {
            "id": "02-excel-architecture",
            "stepNumber": 2,
            "title": "معماری حرفه‌ای فایل کار و اصول بهداشت داده",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۱۵ دقیقه",
            "summary": "ساختاردهی شیت‌ها، ارجاع‌دهی نسبی/مطلق و درک انواع داده",
            "contentHtml": "\n                <h3>۱. معماری حرفه‌ای ورک‌بوک (Workbook Structure)</h3>\n                <p>یکی از نشانه‌های تمایز یک تحلیلگر مبتدی از حرفه‌ای، نحوه ساختاردهی شیت‌های فایل اکسل است. هرگز داده‌های خام را مستقیماً دستکاری نکنید:</p>\n                <ul>\n                    <li><strong><code>Raw Data</code> (داده خام):</strong> کپی دست‌نخورده. همیشه قفل یا غیرفعال بماند.</li>\n                    <li><strong><code>Working Sheet</code> (شیت کاری):</strong> فضایی برای پاک‌سازی و فرمول‌نویسی.</li>\n                    <li><strong><code>Pivot Tables / Calculations</code>:</strong> برای ایجاد جداول محوری و محاسبات تجمعی.</li>\n                    <li><strong><code>Dashboard</code>:</strong> فضای بصری تمیز با نمودارها و اسلایسرها.</li>\n                </ul>\n                <br>\n                <h3>۲. مفهوم ارجاع‌دهی نسبی و مطلق (علامت $)</h3>\n                <ul>\n                    <li><strong>کاملاً نسبی <code>A1</code>:</strong> ستون و سطر هر دو شناورند.</li>\n                    <li><strong>کاملاً مطلق <code>$A$1</code>:</strong> فرمول به هر کجا کپی شود، دقیقاً به سلول A1 اشاره می‌کند.</li>\n                    <li><strong>قفل سطر <code>A$1</code>:</strong> سطر ثابت است.</li>\n                    <li><strong>قفل ستون <code>$A1</code>:</strong> ستون ثابت است.</li>\n                </ul>\n                <br>\n                <h3>۳. منطق پنهان تاریخ در اکسل</h3>\n                <p>تاریخ در اکسل در حقیقت <strong>یک عدد صحیح متوالی (Serial Number)</strong> است که از مبدأ ۱ ژانویه ۱۹۰۰ شماره‌گذاری شده است. زمان نیز بخش اعشاری همان عدد است. اگر فرمت یک تاریخ به General تغییر کند، عدد معادل آن نمایان می‌شود.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "قفل کردن نرخ مالیات در فاکتور",
                    "industry": "مالی",
                    "difficulty": "مقدماتی",
                    "scenario": "در سلول B1 نرخ مالیات (مثلاً ۹٪) نوشته شده است و در ستون D لیستی از قیمت محصولات را دارید.",
                    "task": "چگونه فرمولی بنویسیم که قیمت هر محصول در نرخ مالیات ضرب شود و با درگ کردن (Drag) فرمول به پایین، خطایی رخ ندهد؟",
                    "hint": "سلول B1 باید کاملاً مطلق شود.",
                    "solutionLanguage": "excel",
                    "solutionCode": "=D2 * $B$1",
                    "solutionExplanation": "با زدن کلید F4 روی B1، سلول قفل می‌شود. وقتی به پایین درگ می‌کنید D2 به D3 تبدیل می‌شود اما B1 ثابت می‌ماند."
                }
            ],
            "keyTakeaways": [
                "برای تغییر سریع وضعیت ارجاع (دلار)، پس از کلیک روی آدرس سلول کلید F4 را فشار دهید."
            ]
        },
        {
            "id": "02-excel-cleaning-text",
            "stepNumber": 3,
            "title": "توابع پاک‌سازی متنی و حذف داده‌های تکراری",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "استفاده از Remove Duplicates، TRIM، PROPER، UPPER و LOWER",
            "contentHtml": "\n                <p>بیش از ۶۰ درصد از زمان تحلیلگر داده صرف فرآیند پاک‌سازی داده‌های کثیف (Dirty Data) می‌شود.</p>\n                <h3>۱. حذف و شناسایی تکراری‌ها</h3>\n                <ul>\n                    <li><strong>شناسایی بصری:</strong> تب <code>Home</code> -> <code>Conditional Formatting</code> -> <code>Highlight Cells Rules</code> -> <code>Duplicate Values</code>.</li>\n                    <li><strong>حذف قطعی:</strong> تب <code>Data</code> -> <code>Remove Duplicates</code>.</li>\n                </ul>\n                <br>\n                <h3>۲. توابع پاک‌سازی متنی</h3>\n                <p>اصلاح ناهماهنگی‌های متنی (Extra spaces, case issues):</p>\n                <ul>\n                    <li><code>=TRIM(text)</code>: تمامی فاصله‌های اضافی قبل، بعد و میان کلمات را حذف می‌کند.</li>\n                    <li><code>=PROPER(text)</code>: حرف اول هر کلمه را بزرگ و مابقی را کوچک می‌کند.</li>\n                    <li><code>=UPPER(text)</code> / <code>=LOWER(text)</code>: تمام حروف را بزرگ یا کوچک می‌کند.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "پاک‌سازی نام مشتریان",
                    "language": "excel",
                    "code": "=PROPER(TRIM(A2))"
                }
            ],
            "industryExercises": [
                {
                    "title": "استانداردسازی کدهای ملی/پستی",
                    "industry": "بیمه",
                    "difficulty": "مقدماتی",
                    "scenario": "کاربران هنگام ثبت‌نام، کدهای پستی خود را گاهی با فاصله تایپ کرده‌اند (مثلاً ' 12345 678 ').",
                    "task": "از چه فرمولی برای حذف تمام این فواصل هرز استفاده می‌کنید تا فقط کد تمیز بماند؟",
                    "hint": "از تابع TRIM استفاده کنید.",
                    "solutionLanguage": "excel",
                    "solutionCode": "=TRIM(A2)",
                    "solutionExplanation": "توجه: پس از اعمال فرمول، حتماً ستون را کپی کرده و Paste Special -> Values انجام دهید تا فرمول از بین رفته و دیتا ثابت شود."
                }
            ],
            "keyTakeaways": [
                "همیشه بعد از فرمول‌نویسی برای پاک‌سازی، از میانبر Ctrl + Alt + V برای تبدیل فرمول به مقدار ثابت (Values) استفاده کنید."
            ]
        },
        {
            "id": "02-excel-replace-binning",
            "stepNumber": 4,
            "title": "یکپارچه‌سازی با Find & Replace و دسته‌بندی با IF",
            "badge": "درس ۳",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "استانداردسازی مخفف‌ها و ایجاد سطل‌های داده (Binning) با توابع شرطی",
            "contentHtml": "\n                <h3>۱. یکپارچه‌سازی مقادیر با Find and Replace (Ctrl + H)</h3>\n                <p>برای استانداردسازی نام‌ها یا مقادیر اختصاری:</p>\n                <ul>\n                    <li>تبدیل <code>M</code> به <code>Male</code> و <code>F</code> به <code>Female</code>.</li>\n                    <li><strong>هشدار ایمنی:</strong> فقط محدوده همان ستون مورد نظر را انتخاب کنید؛ در غیر این صورت حروف M در سایر ستون‌ها (مانند عنوان Marital Status) نیز تغییر می‌کنند.</li>\n                </ul>\n                <br>\n                <h3>۲. گروه‌بندی داده‌ها (Binning) با فرمول‌های شرطی</h3>\n                <p>برای تبدیل متغیرهای پیوسته (مانند سن یا درآمد) به گروه‌های دسته‌ای:</p>\n            ",
            "codeBlocks": [
                {
                    "title": "دسته‌بندی سنی",
                    "language": "excel",
                    "code": "=IF(L2 > 54, \"Old\", IF(L2 >= 31, \"Middle Age\", \"Adolescent\"))"
                }
            ],
            "industryExercises": [
                {
                    "title": "برچسب‌گذاری درآمد مشتریان",
                    "industry": "بانکداری",
                    "difficulty": "متوسط",
                    "scenario": "دپارتمان مارکتینگ نیاز دارد که مشتریان بر اساس ستون C (درآمد) دسته‌بندی شوند. زیر ۳۰ هزار = Low، بین ۳۰ تا ۷۰ هزار = Medium، و بالای ۷۰ هزار = High.",
                    "task": "یک فرمول Nested IF برای این دسته‌بندی بنویسید.",
                    "hint": "از شرط بزرگتر شروع کنید و به پایین بیایید.",
                    "solutionLanguage": "excel",
                    "solutionCode": "=IF(C2 >= 70000, \"High\", IF(C2 >= 30000, \"Medium\", \"Low\"))",
                    "solutionExplanation": "ارزیابی IF از چپ به راست است. وقتی چک کردیم >= 70000 نیست، در IF دوم نیازی به نوشتن < 70000 نداریم."
                }
            ],
            "keyTakeaways": [
                "استفاده از IFهای تودرتو (Nested IF) روش اصلی Data Binning در اکسل پیش از بردن داده به Pivot Table است."
            ]
        },
        {
            "id": "02-excel-aggregation-ifs",
            "stepNumber": 5,
            "title": "توابع تجمیعی شرطی (SUMIFS, COUNTIFS)",
            "badge": "درس ۴",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "تسلط بر قلب تپنده فرمول‌نویسی آماری در اکسل",
            "contentHtml": "\n                <p>توابع پایه شامل <code>SUM()</code>, <code>AVERAGE()</code>, <code>MAX()</code>, <code>MIN()</code> و <code>COUNT()</code> هستند. اما قدرت اکسل در توابع شرطی است.</p>\n                <br>\n                <h3>۱. تابع SUMIF و SUMIFS</h3>\n                <ul>\n                    <li><strong><code>SUMIF(range, criteria, [sum_range])</code>:</strong> برای تک‌شرطی.</li>\n                    <li><strong><code>SUMIFS(sum_range, criteria_range1, criteria1, ...)</code>:</strong> برای چندشرطی. ستون جمع شونده <strong>همیشه در ابتدا</strong> می‌آید.</li>\n                </ul>\n                <br>\n                <h3>۲. تابع COUNTIF و COUNTIFS</h3>\n                <p>ساختار مشابهی دارند اما برای شمارش تعداد ردیف‌ها استفاده می‌شوند.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "SUMIFS چند شرطی",
                    "language": "excel",
                    "code": "=SUMIFS(Salary_Col, Department_Col, \"IT\", Gender_Col, \"Male\")"
                },
                {
                    "title": "COUNTIF ساده",
                    "language": "excel",
                    "code": "=COUNTIF(G2:G10, \">45000\")"
                }
            ],
            "industryExercises": [
                {
                    "title": "محاسبه پاداش بخش فروش",
                    "industry": "خرده‌فروشی",
                    "difficulty": "حرفه‌ای",
                    "scenario": "در ستون B نام منطقه (Region) و در ستون D میزان فروش (Sales) قرار دارد.",
                    "task": "فرمول مجموع فروش در منطقه 'North' را با فرض اینکه داده‌ها در ردیف ۲ تا ۱۰۰ هستند بنویسید.",
                    "hint": "در تابع SUMIF، اول محدوده شرط، بعد خود شرط، و در آخر محدوده جمع داده می‌شود.",
                    "solutionLanguage": "excel",
                    "solutionCode": "=SUMIF(B2:B100, \"North\", D2:D100)",
                    "solutionExplanation": "این تابع بسیار قدرتمند است، اما امروزه اکثر تحلیل‌گران ترجیح می‌دهند به جای نوشتن SUMIFS های طولانی، از Pivot Table استفاده کنند."
                }
            ],
            "keyTakeaways": [
                "در SUMIFS محدوده جمع اول است، در SUMIF محدوده جمع آخر است! همیشه از SUMIFS استفاده کنید تا عادتتان یکسان بماند."
            ]
        },
        {
            "id": "02-excel-xlookup",
            "stepNumber": 6,
            "title": "توابع جستجو: خداحافظ VLOOKUP، سلام XLOOKUP!",
            "badge": "درس ۵",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "معایب VLOOKUP و قدرت بلامنازع تابع XLOOKUP در اتصال داده‌ها",
            "contentHtml": "\n                <h3>۱. محدودیت‌های مرگبار VLOOKUP در تحلیل داده</h3>\n                <ul>\n                    <li><strong>الزام به جستجوی چپ به راست:</strong> VLOOKUP نمی‌تواند به ستون‌های سمت چپ خود نگاه کند.</li>\n                    <li><strong>آسیب‌پذیری در اثر درج ستون:</strong> با اضافه شدن یک ستون جدید، عدد ایندکس ستون‌ها به‌هم می‌ریزد و فرمول خراب می‌شود.</li>\n                </ul>\n                <br>\n                <h3>۲. پادشاه مدرن جستجو: تابع XLOOKUP</h3>\n                <p>اکسل با معرفی <code>XLOOKUP</code> تمامی معایب VLOOKUP را برطرف کرد.</p>\n                <p>سینتکس: <code>=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])</code></p>\n                <ul>\n                    <li><strong>جستجو به سمت چپ (Left Lookup):</strong> بدون هیچ محدودیتی.</li>\n                    <li><strong>بازگرداندن چندین ستون:</strong> با انتخاب یک بازه عریض برای return_array.</li>\n                    <li><strong>مدیریت پیش‌فرض خطا:</strong> دارای آرگومان if_not_found به جای ترکیب با IFERROR.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "یک جستجوی ساده و امن با XLOOKUP",
                    "language": "excel",
                    "code": "=XLOOKUP(A3, A2:A10, C2:C10, \"یافت نشد\")"
                }
            ],
            "industryExercises": [
                {
                    "title": "جستجوی ایمیل بر اساس شماره فاکتور",
                    "industry": "عمومی",
                    "difficulty": "پیشرفته",
                    "scenario": "در شیت A شناسه فاکتور دارید. در شیت B، ستون C شناسه فاکتور است و ستون A ایمیل مشتری است.",
                    "task": "چگونه با XLOOKUP ایمیل مشتری را پیدا می‌کنید؟ (اگر VLOOKUP بود غیرممکن بود!)",
                    "hint": "lookup_array برابر ستون C و return_array برابر ستون A خواهد بود.",
                    "solutionLanguage": "excel",
                    "solutionCode": "=XLOOKUP(A2, SheetB!C:C, SheetB!A:A, \"No Email\")",
                    "solutionExplanation": "قدرت XLOOKUP در استقلال آرایه‌های جستجو و بازگشت است. نیازی به شمارش ستون‌ها نیست و هرگز با اضافه کردن ستون جدید خراب نمی‌شود."
                }
            ],
            "keyTakeaways": [
                "اگر از نسخه‌های جدید اکسل (Office 365 / 2021) استفاده می‌کنید، استفاده از VLOOKUP در محیط کار منسوخ شده تلقی می‌شود."
            ]
        },
        {
            "id": "02-excel-pivot",
            "stepNumber": 7,
            "title": "تحلیل پیشرفته با Pivot Tables (جداول محوری)",
            "badge": "درس ۶",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۵ دقیقه",
            "summary": "شالوده ساخت داشبورد: استفاده از Pivot Table برای تجمیع داینامیک داده‌ها",
            "contentHtml": "\n                <p>جدول محوری ابزار نهایی تحلیلگران برای خلاصه‌سازی سریع داده‌ها بدون نیاز به فرمول‌نویسی است و معادل عبارت <code>GROUP BY</code> در زبان SQL عمل می‌کند.</p>\n                <br>\n                <h3>چهار ناحیه اصلی Pivot Table Fields</h3>\n                <ol>\n                    <li><strong>Rows (سطرها):</strong> ابعاد کیفی دسته‌بندی (مانند کشور، نوع شغل).</li>\n                    <li><strong>Columns (ستون‌ها):</strong> بعد دوم دسته‌بندی برای ایجاد جداول متقاطع.</li>\n                    <li><strong>Values (مقادیر):</strong> ارقام و معیارهای عددی که عملیات ریاضی روی آن‌ها انجام می‌شود (مانند Sum of Sales).</li>\n                    <li><strong>Filters (فیلترها):</strong> فیلتر کردن کلی جدول محوری.</li>\n                </ol>\n                <br>\n                <h3>تکنیک‌های کلیدی</h3>\n                <ul>\n                    <li>تغییر محاسبه از Sum به Average (گزینه Summarize Values By).</li>\n                    <li>نمایش درصد از کل (گزینه Show Values As % of Grand Total).</li>\n                    <li>Drill-Down با قرار دادن دو فیلد زیر هم در بخش Rows.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "ماتریس فروش سالانه",
                    "industry": "مدیریت استراتژیک",
                    "difficulty": "متوسط",
                    "scenario": "مدیرعامل یک ماتریس می‌خواهد که در سطرها نام 'کشورها'، در ستون‌ها 'سال‌ها' و در سلول‌ها 'مجموع فروش' باشد.",
                    "task": "چگونه این چیدمان را در Pivot Table تنظیم می‌کنید؟",
                    "hint": "درک جایگاه Rows و Columns در منوی Field List.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "1. Country را بکشید و در بخش **Rows** رها کنید.\n2. Year را بکشید و در بخش **Columns** رها کنید.\n3. Sales را بکشید و در بخش **Values** رها کنید (به صورت پیش‌فرض Sum می‌شود).",
                    "solutionExplanation": "این چیدمان را Cross-tabulation می‌نامند که مقایسه روندها را در ابعاد مختلف بسیار ساده می‌کند."
                }
            ],
            "keyTakeaways": [
                "همیشه قبل از ساخت Pivot Table، داده‌های خود را به یک Excel Table رسمی (Ctrl + T) تبدیل کنید تا با آپدیت داده‌ها، پیوت تیبل هم داینامیک به‌روز شود."
            ]
        },
        {
            "id": "02-excel-project-dashboard",
            "stepNumber": 8,
            "title": "پروژه صنعتی: طراحی داشبورد تعاملی (Bike Buyers)",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۶۰ دقیقه",
            "summary": "صفر تا صد ساخت یک پورتفولیو پروجکت کامل (Data Cleaning تا Interactive Dashboard)",
            "contentHtml": "\n                <p>سناریو: ۱۰۰۰ سطر شامل ویژگی‌های جمعیتی افراد و وضعیت خرید دوچرخه (Yes/No). هدف: ساخت داشبورد تعاملی برای مدیران.</p>\n                <br>\n                <h3>مرحله ۱ و ۲: پاک‌سازی و مهندسی داده</h3>\n                <ul>\n                    <li>Remove Duplicates بر اساس شناسه مشتری.</li>\n                    <li>استانداردسازی مخفف‌ها در جنسیت و وضعیت تاهل (M/F و S/M) با Ctrl+H.</li>\n                    <li>ساخت ستون رده سنی (Adolescent, Middle Age, Old) با IF.</li>\n                </ul>\n                <br>\n                <h3>مرحله ۳: ساخت ۳ جدول محوری اختصاصی (Pivot Tables)</h3>\n                <ol>\n                    <li><strong>میانگین درآمد خریداران:</strong> سطر=Gender، ستون=Purchased Bike، مقادیر=Average of Income.</li>\n                    <li><strong>رفتار مسافت تردد:</strong> سطر=Commute Distance، ستون=Purchased Bike، مقادیر=Count of Purchased Bike.</li>\n                    <li><strong>سهم رده‌های سنی:</strong> سطر=Age Brackets، ستون=Purchased Bike، مقادیر=Count.</li>\n                </ol>\n                <br>\n                <h3>مرحله ۴ و ۵: گرافیک داشبورد و اتصال اسلایسرها</h3>\n                <ul>\n                    <li>رسم نمودارهای Clustered Column و Line Chart از پیوت تیبل‌ها.</li>\n                    <li>ایجاد شیت جدید <code>Dashboard</code>، خاموش کردن Gridlines و چینش نمودارها با تم تیره.</li>\n                    <li>ایجاد Slicer روی Marital Status و Region.</li>\n                    <li><strong>گام حیاتی:</strong> کلیک‌راست روی اسلایسرها -> <code>Report Connections</code> -> تیک زدن هر ۳ جدول محوری برای داینامیک شدن کل داشبورد.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "ارائه داستان داده (Storytelling)",
                    "industry": "همه صنایع",
                    "difficulty": "حرفه‌ای",
                    "scenario": "در جلسه مصاحبه شغلی، مصاحبه‌کننده از شما می‌خواهد که نتیجه داشبوردتان را در یک جمله مدیریتی بیان کنید.",
                    "task": "چگونه به جای توضیح نحوه ساخت اکسل، از Insight های تجاری حرف می‌زنید؟",
                    "hint": "تمرکز بر خروجی نهایی، روندها و مخاطب هدف کسب‌وکار.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "«تحلیل داشبورد ما نشان داد افراد میانسال (۳۱ تا ۵۴ سال) که مسافت تردد آن‌ها کمتر از ۲ مایل است و میانگین درآمدی بالاتر از ۶۵ هزار دلار دارند، بالاترین نرخ تبدیل (Conversion Rate) برای خرید دوچرخه را دارا هستند. پیشنهاد مارکتینگ باید روی این سگمنت متمرکز شود.»",
                    "solutionExplanation": "کارفرمایان به دنبال فردی نیستند که فقط بلد باشد روی دکمه‌های اکسل کلیک کند؛ آن‌ها کسی را می‌خواهند که بتواند داده‌ها را به 'ارزش تجاری' و 'اقدام عملی' تبدیل کند."
                }
            ],
            "keyTakeaways": [
                "همیشه گزینه Report Connections در Slicer ها را بررسی کنید، وگرنه اسلایسر فقط روی یک نمودار کار می‌کند!"
            ]
        }
    ]
});