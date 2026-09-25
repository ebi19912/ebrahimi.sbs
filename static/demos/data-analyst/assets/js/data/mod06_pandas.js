window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "06-pandas",
    "number": "06",
    "folderName": "06-Pandas",
    "title": "تحلیل پیشرفته و Data Cleaning با Pandas",
    "subtitle": "از GroupBy تا Merge و تمیزکاری حرفه‌ای دیتا با یکی از قدرتمندترین کتابخانه‌های پایتون",
    "icon": "database",
    "category": "فنی",
    "estimatedHours": 18,
    "filePath": "06-Pandas/Pandas_Handbook.md",
    "steps": [
        {
            "id": "06-pandas-intro",
            "stepNumber": 1,
            "title": "مقدمه: جایگاه پانداس در چرخه حیات داده",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۰ دقیقه",
            "summary": "پانداس چیست و چرا از اکسل یا SQL برای پاک‌سازی کلان‌داده استفاده نمی‌کنیم؟",
            "contentHtml": "\n                <p>پانداس ستون فقرات کار با داده‌های ساختاریافته در زبان پایتون است.</p>\n                <h3>چرا Pandas؟</h3>\n                <ul>\n                    <li>اکسل در یک میلیون سطر هنگ می‌کند، اما پانداس میلیون‌ها رکورد را در رم پردازش می‌کند.</li>\n                    <li>در SQL برای تمیزکاری‌های متنی پیچیده (مثل Regex و حذف کاراکترهای هرز) محدودیت دارید، اما در پانداس دسترسی کامل به موتور پایتون فراهم است.</li>\n                    <li><strong>ساختارهای اصلی:</strong> <code>Series</code> (ستون تک‌بعدی) و <code>DataFrame</code> (جدول دوبعدی).</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "Pandas چسب میان پایگاه‌داده (SQL) و داشبوردها (Power BI/Tableau) است. دیتای کثیف وارد پانداس شده و دیتای تمیز برای داشبوردها صادر می‌شود."
            ]
        },
        {
            "id": "06-pandas-ingestion",
            "stepNumber": 2,
            "title": "ورود و ارزیابی اولیه داده‌ها (Data Ingestion)",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۱۵ دقیقه",
            "summary": "خواندن فایل‌ها (CSV, Excel) و متدهای بازرسی اولیه",
            "contentHtml": "\n                <p>پانداس برای انواع فرمت‌های فایلی، متدهای اختصاصی و پرسرعت دارد.</p>\n                <h3>متدهای خواندن و نوشتن</h3>\n                <ul>\n                    <li><code>pd.read_csv('file.csv')</code> : برای فایل‌های کاما-سپریتد.</li>\n                    <li><code>pd.read_excel('file.xlsx')</code> : برای اکسل.</li>\n                    <li><code>df.to_csv('output.csv', index=False)</code> : برای ذخیره خروجی. <strong>همیشه index=False را بگذارید تا شماره سطرهای اضافی ذخیره نشوند.</strong></li>\n                </ul>\n                <br>\n                <h3>ارزیابی اولیه داده</h3>\n                <ul>\n                    <li><code>df.head()</code> و <code>df.info()</code> و <code>df.describe()</code> : مثلث طلایی برای شناخت داده‌ها، انواع تایپ‌ها و شمارش Nullها.</li>\n                    <li><code>df.shape</code> : نمایش ابعاد (تعداد سطر و ستون).</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "شناسایی مقادیر گمشده",
                    "industry": "همه صنایع",
                    "difficulty": "مقدماتی",
                    "scenario": "یک فایل با صدها ستون دریافت کرده‌اید و می‌خواهید بدانید در هر ستون دقیقاً چند سلول خالی (Null) وجود دارد.",
                    "task": "دستور پانداس برای این کار چیست؟",
                    "hint": "ترکیب دو متد",
                    "solutionLanguage": "python",
                    "solutionCode": "df.isnull().sum()",
                    "solutionExplanation": "متد isnull به جای هر سلول True یا False می‌گذارد. با اجرای sum روی آن، تعداد Trueها (خالی‌ها) برای هر ستون جمع زده می‌شود."
                }
            ],
            "keyTakeaways": [
                "همیشه قبل از هر تغییری، df.info() را چک کنید تا مطمئن شوید ستون‌های عددی به عنوان object (متن) شناخته نشده باشند."
            ]
        },
        {
            "id": "06-pandas-slicing",
            "stepNumber": 3,
            "title": "شاخص‌گذاری و فیلترسازی شرطی (loc vs iloc)",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "تفاوت دسترسی برچسب‌محور و اندیس‌محور در DataFrame",
            "contentHtml": "\n                <h3>تفاوت بنیادین در Slicing</h3>\n                <p>این یکی از مهم‌ترین سوالات مصاحبه است:</p>\n                <ul>\n                    <li><strong><code>.loc[]</code> (Label-based):</strong> بر اساس برچسب یا نام متنی سطرها و ستون‌ها کار می‌کند. (مثلاً سطرِ 'Iran' و ستون 'Population')</li>\n                    <li><strong><code>.iloc[]</code> (Integer-based):</strong> کاملاً بر مبنای موقعیت و شماره اندیس عددی کار می‌کند. (مثلاً سطرِ 5 و ستونِ 2)</li>\n                </ul>\n                <br>\n                <h3>فیلترهای چندشرطی</h3>\n                <p>در پانداس برای شرط AND از <code>&</code> و برای شرط OR از <code>|</code> استفاده می‌شود و <strong>هر شرط باید داخل پرانتز باشد</strong>.</p>\n            ",
            "codeBlocks": [
                {
                    "title": "فیلتر پیشرفته با پانداس",
                    "language": "python",
                    "code": "# مشتریان فعال با خرید بالای هزار دلار\nactive_vip = df[(df['Status'] == 'Active') & (df['Total_Purchase'] > 1000)]\n\n# جستجوی متنی (LIKE)\nus_states = df[df['State'].str.contains('New', na=False)]"
                }
            ],
            "industryExercises": [
                {
                    "title": "فیلتر بر اساس لیست مقادیر",
                    "industry": "خرده‌فروشی",
                    "difficulty": "متوسط",
                    "scenario": "مدیر فروش لیستی از ۵ شناسه محصول خاص به شما داده است: `[101, 105, 109, 112, 120]`. می‌خواهد فقط فروش این محصولات را فیلتر کنید.",
                    "task": "چگونه از زنجیر کردن چندین OR جلوگیری می‌کنید؟",
                    "hint": "همتای IN در SQL",
                    "solutionLanguage": "python",
                    "solutionCode": "target_products = [101, 105, 109, 112, 120]\nfiltered_df = df[df['Product_ID'].isin(target_products)]",
                    "solutionExplanation": "متد .isin() در پانداس دقیقاً کارکرد IN را در SQL شبیه‌سازی می‌کند."
                }
            ],
            "keyTakeaways": [
                "هنگام کار با متدهای .str (مثل str.contains)، حتماً na=False را بگذارید تا پانداس روی سطرهای Null ارور ندهد."
            ]
        },
        {
            "id": "06-pandas-groupby",
            "stepNumber": 4,
            "title": "گروه‌بندی و ادغام (GroupBy, Merge, Concat)",
            "badge": "درس ۳",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "معادل‌های GROUP BY و JOIN های SQL در دنیای پایتون",
            "contentHtml": "\n                <h3>گروه‌بندی (GroupBy)</h3>\n                <p>متد <code>.groupby()</code> بر اساس الگوی <strong>Split-Apply-Combine</strong> کار می‌کند. با تابع <code>.agg()</code> می‌توانید به طور هم‌زمان چندین عملیات تجمعی روی ستون‌های مختلف انجام دهید.</p>\n                <br>\n                <h3>اتصال جداول</h3>\n                <ul>\n                    <li><strong><code>pd.merge()</code>:</strong> معادل JOIN در SQL است (ارتباط بر پایه کلید مشترک). دارای حالت‌های inner, left, right, outer.</li>\n                    <li><strong><code>pd.concat()</code>:</strong> برای چسباندن ساده و فیزیکی جداول. با <code>axis=0</code> جدول‌ها زیر هم چسبانده می‌شوند (عمودی) و با <code>axis=1</code> در کنار هم قرار می‌گیرند (افقی).</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "تجمیع سفارشی",
                    "language": "python",
                    "code": "summary = df.groupby('Continent').agg({\n    'Population': ['mean', 'max'],\n    'Country': 'count'\n})"
                },
                {
                    "title": "جوین چپ پانداس",
                    "language": "python",
                    "code": "merged_left = pd.merge(df_customers, df_orders, on='customer_id', how='left')"
                }
            ],
            "industryExercises": [
                {
                    "title": "اضافه کردن دیتافریم‌ها به هم",
                    "industry": "همه صنایع",
                    "difficulty": "مقدماتی",
                    "scenario": "شما دیتای فروش ۱۲ ماه را در ۱۲ فایل جداگانه خوانده و ۱۲ دیتافریم دارید.",
                    "task": "چگونه آن‌ها را در یک دیتافریم واحد زیر هم قرار می‌دهید؟ آیا از .append() استفاده می‌کنید؟",
                    "hint": "Append منسوخ شده.",
                    "solutionLanguage": "python",
                    "solutionCode": "combined_df = pd.concat([df1, df2, df3, ...], axis=0).reset_index(drop=True)",
                    "solutionExplanation": "نکته بسیار مهم برای سال‌های اخیر این است که متد df.append() منسوخ و حذف شده است و فقط باید از pd.concat استفاده کنید. reset_index نیز باعث می‌شود شماره ردیف‌ها از صفر تا انتها مرتب شود."
                }
            ],
            "keyTakeaways": [
                "هنگام Concat کردن افقی، اگر ستون‌های دو جدول ایندکس‌های نامرتب داشته باشند، پانداس آن‌ها را جابجا می‌چیند. حتماً قبل از Concat مطمئن شوید ایندکس‌ها درست هستند."
            ]
        },
        {
            "id": "06-pandas-cleaning-project",
            "stepNumber": 5,
            "title": "پروژه صنعتی ۱: پاک‌سازی پیشرفته لیست تماس مشتریان",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۵۰ دقیقه",
            "summary": "استفاده از Regex، Lambda و String Manipulation برای تمیزکاری",
            "contentHtml": "\n                <p>در این سناریو، یک لیست کثیف CRM حاوی نام‌های نامنظم، آدرس‌های سرهم و تلفن‌های خراب را پاک‌سازی می‌کنیم.</p>\n                <h3>مراحل پیاده‌سازی</h3>\n                <ol>\n                    <li><code>drop_duplicates()</code> برای ردیف‌های کاملاً یکسان.</li>\n                    <li><code>df['Last_Name'].str.strip(\"123._/ \")</code>: حذف کاراکترهای هرز اطراف نام.</li>\n                    <li><strong>Regex برای تلفن:</strong> <code>str.replace('[^0-9]', '', regex=True)</code> (نگه داشتن فقط اعداد).</li>\n                    <li>استفاده از <code>apply(lambda x: ...)</code> برای ساخت فرمت 123-456-7890.</li>\n                    <li><strong>تفکیک آدرس:</strong> <code>str.split(',', expand=True)</code> برای تبدیل یک آدرس طولانی به سه ستون Street و State و Zip.</li>\n                    <li>فیلتر کردن و حذف ردیف‌هایی که مقدار Do_Not_Contact در آن‌ها Y است.</li>\n                </ol>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "حل خطای SettingWithCopyWarning",
                    "industry": "توسعه پایتون",
                    "difficulty": "حرفه‌ای",
                    "scenario": "وقتی شما روی بخشی فیلترشده از یک دیتافریم تغییری ایجاد می‌کنید (مثلاً df[df['Age']>20]['Status'] = 'Adult')، پانداس ارور یا هشدار SettingWithCopyWarning می‌دهد.",
                    "task": "دلیل این هشدار چیست و راه حل اصولی کدام است؟",
                    "hint": "استفاده از .loc",
                    "solutionLanguage": "markdown",
                    "solutionCode": "این هشدار به این دلیل است که پانداس نمی‌داند آیا شما دارید روی 'نمای' اصلی (View) تغییر ایجاد می‌کنید یا روی یک 'کپی'.\nراه حل اصولی:\n`df.loc[df['Age'] > 20, 'Status'] = 'Adult'`",
                    "solutionExplanation": "متد .loc به پانداس تضمین می‌دهد که شما در حال ویرایش مستقیم دیتافریم اصلی در همان حافظه هستید."
                }
            ],
            "keyTakeaways": [
                "متد str.split(expand=True) ناجی شما در تبدیل ستون‌های سرهم‌بندی شده (مثل آدرس یا نام کامل) به ستون‌های مجزاست."
            ]
        },
        {
            "id": "06-pandas-eda-project",
            "stepNumber": 6,
            "title": "پروژه صنعتی ۲: تحلیل اکتشافی (EDA) با Seaborn",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۴۵ دقیقه",
            "summary": "مصورسازی توزیع‌ها، یافتن Outlierها و ماتریس همبستگی",
            "contentHtml": "\n                <p>تحلیل اکتشافی داده‌ها (EDA) نخستین فرآیند نگاه عمیق به داده، پیش از ساخت داشبوردهای تجاری است.</p>\n                <h3>رسم نمودارها در پایتون</h3>\n                <p>پانداس خودش متد <code>.plot()</code> دارد که بر پایه Matplotlib است، اما کتابخانه <strong>Seaborn</strong> نمودارهای بسیار زیباتر و تحلیلی‌تری ارائه می‌دهد.</p>\n                <ul>\n                    <li><strong>Heatmap (نقشه حرارتی):</strong> برای دیدن Correlation یا همبستگی بین متغیرها (مثلاً آیا مساحت کشور با جمعیتش ارتباط خطی دارد؟).</li>\n                    <li><strong>Barplot:</strong> برای مقایسه رتبه‌بندی‌ها (مثلاً ۱۰ کشور پرجمعیت).</li>\n                    <li><strong>Boxplot:</strong> برای یافتن ناهنجاری‌ها و داده‌های پرت در هر قاره.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "رسم Heatmap همبستگی",
                    "language": "python",
                    "code": "import seaborn as sns\nimport matplotlib.pyplot as plt\n\nnumeric_data = df.select_dtypes(include=['number'])\nplt.figure(figsize=(10, 6))\nsns.heatmap(numeric_data.corr(), annot=True, cmap='Blues', fmt='.2f')\nplt.show()"
                }
            ],
            "industryExercises": [
                {
                    "title": "چرا نمودارهای پایتون را رسم می‌کنیم؟",
                    "industry": "توسعه شغلی",
                    "difficulty": "مقدماتی",
                    "scenario": "مدیر از شما می‌پرسد: 'وقتی ما Power BI داریم، چرا وقت می‌گذاری و با Seaborn کد می‌زنی؟'",
                    "task": "تفاوت هدف EDA در پایتون با داشبوردسازی در BI را شرح دهید.",
                    "hint": "تفاوت مخاطب هدف.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "«داشبوردهای Power BI برای ارائه نهایی (Presentation) به ذی‌نفعان و مدیران غیرفنی هستند تا روی فیلترها کلیک کنند. اما نمودارهای پایتون (مثل Heatmap و Boxplot) برای تحلیل اکتشافی (Exploration) هستند؛ ابزاری برای خود تحلیلگر تا قبل از بارگذاری داده در مدل، باگ‌ها، Outlierها و همبستگی پنهان ویژگی‌ها (Feature Engineering) را کشف کند.»",
                    "solutionExplanation": "EDA فرآیندی درون‌تیمی است و خروجی آن عموماً تصمیم‌گیری برای مهندسی داده است."
                }
            ],
            "keyTakeaways": [
                "برای متغیرهای زمانی، همیشه از Line Plot استفاده کنید و برای متغیرهای دسته‌ای از Bar Plot."
            ]
        }
    ]
});