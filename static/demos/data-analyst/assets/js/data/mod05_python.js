window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "05-python",
    "number": "05",
    "folderName": "05-Python",
    "title": "برنامه‌نویسی Python، اتوماسیون و Web Scraping",
    "subtitle": "کتابخانه Pandas، استخراج داده از وب با BeautifulSoup و تعامل با APIها",
    "icon": "code-square",
    "category": "فنی",
    "estimatedHours": 25,
    "filePath": "05-Python/Python_Handbook.md",
    "steps": [
        {
            "id": "05-python-intro",
            "stepNumber": 1,
            "title": "مقدمه: جایگاه پایتون در تحلیل داده",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۰ دقیقه",
            "summary": "پایتون به عنوان چسب اتصال تمام مراحل تحلیل داده از استخراج تا ماشین لرنینگ",
            "contentHtml": "\n                <p>پایتون (Python) یکی از منعطف‌ترین ابزارهای اکوسیستم داده است. در حالی که اکسل و تبلو ابزارهای فوق‌العاده‌ای برای گزارش‌گیری هستند، پایتون به شما اجازه می‌دهد مرزها را بشکنید:</p>\n                <ul>\n                    <li><strong>استخراج مستقیم داده:</strong> اسکرپ کردن سایت‌ها (Web Scraping) و اتصال به APIها.</li>\n                    <li><strong>دگرگون‌سازی کلان‌داده:</strong> کار با فایل‌های عظیمی که نرم‌افزارهای عادی را Crash می‌کنند، به کمک Pandas.</li>\n                    <li><strong>اتوماسیون:</strong> زمان‌بندی کدهای تکراری روزانه.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "شما با SQL رکوردها را از دیتابیس می‌گیرید، با تبلو داشبورد می‌سازید، و با پایتون کارهایی را اتوماتیک می‌کنید که هیچ ابزار بصری توان انجامش را ندارد."
            ]
        },
        {
            "id": "05-python-basics",
            "stepNumber": 2,
            "title": "انواع متغیرها و ساختارهای داده اصلی",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "تفاوت List، Tuple، Set و Dictionary در عمل",
            "contentHtml": "\n                <p>چهار ساختار اصلی در پایتون برای ذخیره داده‌ها وجود دارد:</p>\n                <ul>\n                    <li><strong>لیست (List):</strong> <code>[]</code> مرتب و تغییرپذیر.</li>\n                    <li><strong>تاپل (Tuple):</strong> <code>()</code> مرتب و <strong>غیرقابل تغییر</strong> (سریع‌تر و امن‌تر).</li>\n                    <li><strong>مجموعه (Set):</strong> <code>{{}}</code> <strong>بدون داده تکراری</strong>. بهترین روش برای پیدا کردن عناصر یکتا.</li>\n                    <li><strong>دیکشنری (Dictionary):</strong> <code>{{key: value}}</code> دارای ساختار کلید-مقدار، ایده‌آل برای ذخیره فرمت JSON.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "حذف خودکار موارد تکراری با Set",
                    "language": "python",
                    "code": "raw_ids = [101, 102, 103, 101, 102]\nclean_unique_ids = list(set(raw_ids))\nprint(clean_unique_ids) # [101, 102, 103]"
                }
            ],
            "industryExercises": [
                {
                    "title": "کدام ساختار داده مناسب است؟",
                    "industry": "همه صنایع",
                    "difficulty": "مقدماتی",
                    "scenario": "می‌خواهید طول و عرض جغرافیایی دفتر مرکزی شرکت را در یک متغیر ذخیره کنید. این مختصات هرگز در طول اجرای برنامه نباید تغییر کند.",
                    "task": "از بین List و Tuple کدام را انتخاب می‌کنید؟",
                    "hint": "امنیت و عدم تغییر",
                    "solutionLanguage": "markdown",
                    "solutionCode": "بهترین ساختار Tuple (تاپل) است. زیرا برخلاف لیست‌ها، پس از تعریف قابلیت append یا تغییر مقادیر در آن وجود ندارد (Immutable) که از تغییرات تصادفی در کد جلوگیری می‌کند.",
                    "solutionExplanation": "این یکی از رایج‌ترین سوالات مصاحبه است: 'تفاوت List و Tuple چیست؟'"
                }
            ],
            "keyTakeaways": [
                "همیشه برای داده‌های ثابت مثل مختصات، از Tuple استفاده کنید."
            ]
        },
        {
            "id": "05-python-logic",
            "stepNumber": 3,
            "title": "منطق برنامه‌نویسی و توابع",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "نوشتن شروط if/else و ایجاد توابع سفارشی",
            "contentHtml": "\n                <p>ساختارهای کنترلی در پایتون با تو رفتگی (Indentation) مشخص می‌شوند.</p>\n                <h3>توابع (Functions)</h3>\n                <p>توابع با کلمه کلیدی <code>def</code> تعریف می‌شوند. همچنین توابع یک‌خطی به نام <code>lambda</code> داریم که برای کار با دیتافریم‌های پانداس بسیار پرکاربرد هستند.</p>\n                <br>\n                <h3>حلقه‌ها (Loops)</h3>\n                <ul>\n                    <li><strong>For loop:</strong> برای حرکت روی لیست‌ها و دیکشنری‌ها.</li>\n                    <li><strong>While loop:</strong> برای تکرار تا زمانی که یک شرط نقض شود (مثلاً اجرای درخواست API تا زمان موفقیت).</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "پروژه مینی: ماشین حساب BMI",
                    "language": "python",
                    "code": "def calculate_bmi(weight_kg, height_m):\n    bmi = weight_kg / (height_m ** 2)\n    if bmi < 18.5:\n        return 'Underweight'\n    elif bmi < 25:\n        return 'Normal'\n    else:\n        return 'Overweight'"
                }
            ],
            "industryExercises": [
                {
                    "title": "فرمول‌نویسی دینامیک با Lambda",
                    "industry": "بانکداری",
                    "difficulty": "متوسط",
                    "scenario": "یک سیستم نیاز به تابعی برای اعمال مالیات ۹ درصدی دارد که می‌خواهید آن را به صورت ناشناس و یک‌خطی در یک محاسبه دیگر استفاده کنید.",
                    "task": "تابع مالیات را با lambda بنویسید.",
                    "hint": "lambda ورودی : خروجی",
                    "solutionLanguage": "python",
                    "solutionCode": "calculate_tax = lambda x: x * 0.09\nprint(calculate_tax(1000))  # 90.0",
                    "solutionExplanation": "توابع Lambda به خصوص همراه با متد .apply() در پانداس کاربرد فراوانی دارند."
                }
            ],
            "keyTakeaways": [
                "از لامبدا توابع یک‌خطی و موقت بسازید و از def برای توابع پیچیده و چندخطی."
            ]
        },
        {
            "id": "05-python-pandas",
            "stepNumber": 4,
            "title": "پانداس (Pandas): ستون فقرات تحلیل داده",
            "badge": "درس ۳",
            "isIntroOrSetup": false,
            "estimatedTime": "۴۵ دقیقه",
            "summary": "DataFrames، فیلترینگ با loc و iloc و متدهای تجمیعی",
            "contentHtml": "\n                <p>پانداس به پایتون قدرت یک دیتابیس یا یک اکسل بی‌نهایت را می‌دهد.</p>\n                <h3>آشنایی اولیه با داده</h3>\n                <ul>\n                    <li><code>df.head()</code> : دیدن ۵ سطر اول.</li>\n                    <li><code>df.info()</code> : بررسی انواع ستون‌ها و مقادیر Null.</li>\n                    <li><code>df.describe()</code> : خلاصه آماری (میانگین، مینیمم، ماکزیمم).</li>\n                </ul>\n                <br>\n                <h3>برش و انتخاب (Slicing)</h3>\n                <p>مهم‌ترین تفاوت متدها:</p>\n                <ul>\n                    <li><strong><code>.loc[]</code>:</strong> بر اساس <strong>نام</strong> سطر و ستون (Label-based).</li>\n                    <li><strong><code>.iloc[]</code>:</strong> بر اساس <strong>شماره ایندکس</strong> (Integer-based).</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "فیلتر چند شرطی",
                    "language": "python",
                    "code": "asian_giants = df[(df['Continent'] == 'Asia') & (df['Population'] > 100000000)]"
                }
            ],
            "industryExercises": [
                {
                    "title": "گروه‌بندی و تجمیع (Group By)",
                    "industry": "خرده‌فروشی",
                    "difficulty": "متوسط",
                    "scenario": "شما دیتافریمی از مشتریان دارید و می‌خواهید مجموع فروش (Sales) و میانگین سن (Age) را به تفکیک هر کشور (Country) محاسبه کنید.",
                    "task": "از متد groupby پانداس به همراه agg استفاده کنید.",
                    "hint": "متد .agg() دیکشنری می‌گیرد.",
                    "solutionLanguage": "python",
                    "solutionCode": "summary_df = df.groupby('Country').agg({\n    'Sales': 'sum',\n    'Age': 'mean'\n})",
                    "solutionExplanation": "این دقیقاً معادل دستور GROUP BY ... SUM(Sales), AVG(Age) در SQL است."
                }
            ],
            "keyTakeaways": [
                "هرگز از حلقه for برای ویرایش سطر به سطر در پانداس استفاده نکنید! پانداس برای عملیات برداری (Vectorized) ساخته شده است."
            ]
        },
        {
            "id": "05-python-data-cleaning",
            "stepNumber": 5,
            "title": "پروژه: پاک‌سازی داده‌های کثیف با پانداس",
            "badge": "درس ۴",
            "isIntroOrSetup": false,
            "estimatedTime": "۴۵ دقیقه",
            "summary": "حذف تکراری‌ها، Regex و مدیریت مقادیر NaN",
            "contentHtml": "\n                <p>در دنیای واقعی، داده‌ها پر از کاراکترهای اضافه، فاصله‌ها و اطلاعات ناقص هستند.</p>\n                <h3>گام‌های طلایی پاک‌سازی</h3>\n                <ol>\n                    <li><code>drop_duplicates()</code>: حذف رکوردهای دقیقاً یکسان.</li>\n                    <li>استفاده از متدهای متنی <code>str.strip()</code> و <code>str.replace()</code>.</li>\n                    <li>استفاده از عبارات باقاعده (Regex) برای نگه‌داشتن فقط اعداد (مثلاً در شماره تماس‌ها).</li>\n                    <li><code>dropna()</code> یا <code>fillna()</code>: مدیریت سلول‌های خالی (Null).</li>\n                </ol>\n            ",
            "codeBlocks": [
                {
                    "title": "پاکسازی شماره تلفن",
                    "language": "python",
                    "code": "# حذف هر کاراکتر غیرعددی\ndf['Phone'] = df['Phone'].astype(str).str.replace('[^0-9]', '', regex=True)"
                }
            ],
            "industryExercises": [
                {
                    "title": "تفکیک آدرس‌های پستی به ستون‌های مجزا",
                    "industry": "تجارت الکترونیک",
                    "difficulty": "پیشرفته",
                    "scenario": "در یک ستون به نام Address، مقادیری مثل '123 Main St, New York, 10001' قرار دارد. می‌خواهیم آن را به سه ستون Street, State و ZipCode بشکنیم.",
                    "task": "نحوه تفکیک و گسترش (Expand) یک ستون در پانداس با کاما چیست؟",
                    "hint": "استفاده از str.split با پارامتر expand=True",
                    "solutionLanguage": "python",
                    "solutionCode": "split_address = df['Address'].str.split(',', n=2, expand=True)\ndf['Street'] = split_address[0].str.strip()\ndf['State'] = split_address[1].str.strip()\ndf['Zip_Code'] = split_address[2].str.strip()",
                    "solutionExplanation": "پارامتر expand=True لیست‌های تفکیک‌شده را به ستون‌های جدید یک DataFrame تبدیل می‌کند."
                }
            ],
            "keyTakeaways": [
                "عملیات‌های استرینگ در پانداس (مانند df['col'].str.lower) فقط برای ستون‌هایی با تایپ object یا string کار می‌کنند."
            ]
        },
        {
            "id": "05-python-eda",
            "stepNumber": 6,
            "title": "تحلیل اکتشافی (EDA) و مصورسازی (Seaborn)",
            "badge": "درس ۵",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "یافتن همبستگی‌ها و Outlierها با Matplotlib",
            "contentHtml": "\n                <p>تحلیل اکتشافی (Exploratory Data Analysis) به معنای کاوش داده پیش از ساخت داشبورد است.</p>\n                <ul>\n                    <li><strong>Heatmap:</strong> بهترین نمودار برای کشف Correlation (همبستگی خطی) بین چند متغیر عددی.</li>\n                    <li><strong>Boxplot:</strong> نمودار جعبه‌ای؛ ایده‌آل برای یافتن داده‌های پرت (Outliers) و دیدن توزیع آماری.</li>\n                    <li><strong>Line Plot:</strong> برای تحلیل روندهای زمانی (Time Series).</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "رسم Heatmap",
                    "language": "python",
                    "code": "import seaborn as sns\nimport matplotlib.pyplot as plt\n\ncorrelation_matrix = df.corr(numeric_only=True)\nsns.heatmap(correlation_matrix, annot=True, cmap='Blues')\nplt.show()"
                }
            ],
            "industryExercises": [
                {
                    "title": "شناسایی Outliers با نمودار",
                    "industry": "بیمه",
                    "difficulty": "مقدماتی",
                    "scenario": "مدیر می‌خواهد بداند آیا در داده‌های پرداختی خسارت (Claims)، ارقام بسیار نامتعارف و پرت وجود دارد یا خیر.",
                    "task": "کدام نمودار را رسم می‌کنید؟",
                    "hint": "نمودار جعبه و خط",
                    "solutionLanguage": "markdown",
                    "solutionCode": "بهترین انتخاب Boxplot است. نقاطی که خارج از 'سبیل'های (Whiskers) این نمودار قرار می‌گیرند، نشانگر Outlier های آماری هستند.",
                    "solutionExplanation": "نمودارهای Boxplot در تحلیل آماری و پاک‌سازی داده بسیار ارزشمندند."
                }
            ],
            "keyTakeaways": [
                "استفاده از Seaborn بسیار زیباتر و خلاصه‌تر از متدهای پایه Matplotlib است."
            ]
        },
        {
            "id": "05-python-webscraping",
            "stepNumber": 7,
            "title": "وب‌اسکرپینگ با BeautifulSoup",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۴۵ دقیقه",
            "summary": "استخراج جداول ویکی‌پدیا و قیمت محصولات دیجی‌کالا/آمازون",
            "contentHtml": "\n                <p>هر جا که دکمه دانلود CSV وجود نداشت، وب‌اسکرپینگ راه چاره است!</p>\n                <h3>ساختار وب‌اسکرپینگ</h3>\n                <ol>\n                    <li><code>requests.get(url)</code>: دریافت کدهای HTML خام صفحه وب.</li>\n                    <li><code>BeautifulSoup(html, 'html.parser')</code>: تبدیل کدهای به هم ریخته به یک درخت قابل جستجو (DOM).</li>\n                    <li><code>soup.find('table')</code> یا <code>soup.find_all('tr')</code>: استخراج تگ‌ها و کلاس‌های خاص.</li>\n                </ol>\n                <p>در پروژه‌ای عملی، جدول ۵۰۰ شرکت برتر آمریکا از ویکی‌پدیا با پیدا کردن سطرها (tr) و سلول‌ها (td) استخراج شده و وارد DataFrame پانداس می‌گردد.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "اسکرپ یک تگ متنی با کلاس",
                    "language": "python",
                    "code": "response = requests.get('https://example.com')\nsoup = BeautifulSoup(response.text, 'html.parser')\nprice = soup.find('span', class_='price-value').text.strip()"
                }
            ],
            "industryExercises": [
                {
                    "title": "جلوگیری از مسدود شدن (Block) در وب‌اسکرپینگ",
                    "industry": "همه صنایع",
                    "difficulty": "پیشرفته",
                    "scenario": "وب‌سایت‌ها درخواست‌هایی که از ربات‌های پایتون ارسال می‌شود را شناسایی و مسدود می‌کنند (خطای 403 Forbidden).",
                    "task": "مهم‌ترین ترفند برای عبور از این سد چیست؟",
                    "hint": "پارامتری در هدر درخواست HTTP.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "ارسال پارامتر `User-Agent` در Header درخواست. با این کار به سرور اعلام می‌کنید که درخواست از طرف یک مرورگر واقعی (مثل کروم در ویندوز) آمده است نه یک اسکریپت پایتون.",
                    "solutionExplanation": "همیشه `headers={'User-Agent': 'Mozilla/5.0...'}` را در requests.get() قرار دهید."
                }
            ],
            "keyTakeaways": [
                "یادگیری تگ‌های پایه HTML (مانند div, span, table, tr, td) پیش‌نیاز قطعی وب‌اسکرپینگ است."
            ]
        },
        {
            "id": "05-python-api-automation",
            "stepNumber": 8,
            "title": "اتوماسیون API و پایپ‌لاین پیوسته",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۵۰ دقیقه",
            "summary": "اتصال به REST APIs و ذخیره دوره‌ای در فایل CSV (Append)",
            "contentHtml": "\n                <p>درج اتوماتیک داده‌های زنده به پورتفولیوی شما ارزش فوق‌العاده‌ای می‌دهد.</p>\n                <h3>اتصال به API</h3>\n                <ul>\n                    <li>برخلاف اسکرپینگ سایت‌های خام، API ها دیتای آماده و تمیز با فرمت <strong>JSON</strong> برمی‌گردانند.</li>\n                    <li>می‌توانید با استفاده از <code>pd.json_normalize()</code> فایل‌های تودرتوی JSON را مستقیم به جدول تبدیل کنید.</li>\n                </ul>\n                <br>\n                <h3>پایپ‌لاین اضافه شونده (Append Mode)</h3>\n                <p>برای ساخت فایل تاریخچه قیمت (مثلا بیت‌کوین در هر دقیقه)، فایل CSV را با حالت <code>mode='a'</code> در پانداس باز می‌کنیم تا ردیف جدید فقط به انتها اضافه شود.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "اضافه کردن به CSV بدون پاک شدن",
                    "language": "python",
                    "code": "import datetime\ndf_latest['timestamp'] = datetime.datetime.now()\ndf_latest.to_csv('Automated_Data.csv', mode='a', header=False, index=False)"
                }
            ],
            "industryExercises": [
                {
                    "title": "توضیح پروژه اتوماسیون در مصاحبه",
                    "industry": "توسعه شغلی",
                    "difficulty": "حرفه‌ای",
                    "scenario": "مدیر فنی از شما می‌پرسد چگونه داده‌های زنده رمزارزها را ذخیره می‌کردید.",
                    "task": "به صورت فنی فرآیند را توضیح دهید.",
                    "hint": "ذکر نام پکیج‌ها و فرمت فایل.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "«من یک اسکریپت در پایتون با حلقه `while` یا `time.sleep` نوشتم. با کتابخانه `requests` هر ۵ دقیقه دیتای JSON را از REST API می‌گرفتم، با `pandas` تبدیل به دیتافریم می‌کردم، و آن را با مد `append` روی یک فایل CSV ذخیره می‌کردم.»",
                    "solutionExplanation": "کارفرما به دنبال مفاهیم کلیدی است: JSON, API Endpoints, Automated Appending."
                }
            ],
            "keyTakeaways": [
                "API ها (وب‌سرویس‌ها) بهترین، تمیزترین و ایمن‌ترین روش برای دریافت دیتا از سازمان‌ها هستند."
            ]
        }
    ]
});