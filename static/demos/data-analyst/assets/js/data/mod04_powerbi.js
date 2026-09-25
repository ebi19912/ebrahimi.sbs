window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "04-powerbi",
    "number": "04",
    "folderName": "04-Power BI",
    "title": "هوش تجاری مایکروسافت با Power BI",
    "subtitle": "تسلط بر Power Query، مدل‌سازی Star Schema، فرمول‌نویسی DAX و ساخت داشبورد مدیریت",
    "icon": "pie-chart",
    "category": "فنی",
    "estimatedHours": 18,
    "filePath": "04-Power BI/PowerBI_Handbook.md",
    "steps": [
        {
            "id": "04-powerbi-intro",
            "stepNumber": 1,
            "title": "مقدمه و معماری Power BI",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۰ دقیقه",
            "summary": "تفاوت Power BI با Tableau و معماری سه‌گانه رابط کاربری",
            "contentHtml": "\n                <p>مایکروسافت Power BI یکی از پیشروترین پلتفرم‌های هوش تجاری در جهان است که وجه تمایز اصلی آن <strong>مدیریت زنجیره کامل داده (End-to-End Analytics)</strong> است.</p>\n                <h3>تفاوت کلیدی با Tableau</h3>\n                <ul>\n                    <li>تبلو بر پایه کاوش بصری (Visual Data Exploration) استوار است.</li>\n                    <li>پاور بی‌آی تمرکز ویژه‌ای بر <strong>مدل‌سازی رابطه‌ای ستاره‌ای (Star Schema)</strong> و زبان محاسباتی قدرتمند <strong>DAX</strong> دارد.</li>\n                </ul>\n                <br>\n                <h3>نماهای سه‌گانه (The Three Core Views)</h3>\n                <ol>\n                    <li><strong>نمای گزارش (Report View):</strong> بوم سفید طراحی داشبورد و نمودارها.</li>\n                    <li><strong>نمای داده (Table View):</strong> مشاهده جداول و فرمت ستون‌ها.</li>\n                    <li><strong>نمای مدل‌سازی (Model View):</strong> دیاگرام شماتیک و تعریف روابط (Relationships) بین جداول.</li>\n                </ol>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "موتور VertiPaq در پاور بی‌آی داده‌ها را به صورت ستونی فشرده می‌کند، به همین دلیل پردازش ده‌ها میلیون سطر در کسری از ثانیه انجام می‌شود."
            ]
        },
        {
            "id": "04-powerbi-powerquery",
            "stepNumber": 2,
            "title": "دگرگون‌سازی داده‌ها با Power Query (فرآیند ETL)",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۵ دقیقه",
            "summary": "ورود به اتاق عمل داده‌ها: تمیزکاری، تغییر نوع و Applied Steps",
            "contentHtml": "\n                <p>پیش از ورود داده‌ها به مدل تحلیلی، باید آن‌ها را از طریق <strong>Power Query Editor</strong> (با استفاده از زبان M) پالایش کنیم.</p>\n                <h3>گردش کار Applied Steps</h3>\n                <p>تمامی تغییرات شما مانند یک چرخه‌کار (Macro) در سمت راست ثبت می‌شود. اگر فایلی در آینده آپدیت شود، تمام این گام‌ها به صورت خودکار روی دیتای جدید اِعمال خواهند شد.</p>\n                <br>\n                <h3>تکنیک‌های حیاتی پاک‌سازی</h3>\n                <ul>\n                    <li><strong>Use First Row as Headers:</strong> بالا آوردن سربرگ‌هایی که در سطر اول گیر کرده‌اند.</li>\n                    <li><strong>Split Column:</strong> تفکیک نام و نام خانوادگی، یا تفکیک عنوان شغل از سطح سنیور/جونیور.</li>\n                    <li><strong>Data Type:</strong> تغییر نوع داده درآمد به <code>Fixed Decimal Number</code> برای دقت مالی.</li>\n                    <li><strong>Conditional Columns:</strong> ساخت ستون جدید بر پایه شروط (مثل IF/ELSE).</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "پاک‌سازی نامنظم فایل‌های خروجی سیستم حسابداری",
                    "industry": "مالی",
                    "difficulty": "مقدماتی",
                    "scenario": "خروجی سیستم حسابداری شما همیشه دو سطر اولش شامل تاریخ پرینت و نام شرکت است و سربرگ‌ها در سطر سوم هستند.",
                    "task": "چگونه در Power Query این فایل را اتوماتیک تمیز می‌کنید؟",
                    "hint": "استفاده از Remove Rows",
                    "solutionLanguage": "markdown",
                    "solutionCode": "1. از تب Home گزینه Remove Rows -> Remove Top Rows را زده و عدد 2 را وارد می‌کنیم.\n2. سپس گزینه Use First Row as Headers را می‌زنیم تا سطر سوم که حالا اول شده، تبدیل به سربرگ شود.",
                    "solutionExplanation": "با این کار، ماه بعد که فایل جدید وارد می‌شود، پاور بی‌آی به صورت اتوماتیک دو سطر اول را دور ریخته و جدول را درست می‌سازد."
                }
            ],
            "keyTakeaways": [
                "همیشه پس از اتمام کار در Power Query، دکمه Close & Apply را بزنید تا داده‌ها وارد موتور اصلی شوند."
            ]
        },
        {
            "id": "04-powerbi-data-modeling",
            "stepNumber": 3,
            "title": "مدل‌سازی داده: معماری Star Schema و کاردینالیتی",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "قلب تپنده Power BI: جداول Fact، جداول Dimension و ارتباطات منطقی",
            "contentHtml": "\n                <p>اگر روابط میان جداول اشتباه تعریف شوند، تمامی محاسبات DAX گمراه‌کننده خواهند بود.</p>\n                <h3>معماری مدل ستاره‌ای (Star Schema)</h3>\n                <ul>\n                    <li><strong>جدول واقعیت (Fact Table):</strong> تراکنش‌ها و اعداد (مانند Sales). شامل میلیون‌ها رکورد است.</li>\n                    <li><strong>جدول ابعاد (Dimension Table):</strong> ویژگی‌های توصیفی برای فیلتر کردن (مانند Customers, Products, Date). معمولاً کوچک‌تر است.</li>\n                </ul>\n                <p>شکل قرارگیری آن‌ها در نمای مدل، شبیه یک ستاره است که Fact در مرکز و ابعاد دور آن هستند.</p>\n                <br>\n                <h3>کاردینالیتی (Cardinality)</h3>\n                <ul>\n                    <li><strong>یک به چند (1:*):</strong> استانداردترین حالت. هر محصول یک بار در جدول ابعاد می‌آید، اما هزاران بار در جدول فروش تکرار می‌شود.</li>\n                    <li><strong>چند به چند (*:*):</strong> خطرناک! زمانی رخ می‌دهد که کلید مشترک در هر دو سمت تکراری باشد (نیازمند جدول واسط).</li>\n                </ul>\n                <br>\n                <h3>جهت فیلتر متقاطع (Cross-filter Direction)</h3>\n                <p>پیش‌فرض روی <strong>Single</strong> است (یعنی جدول ابعاد می‌تواند جدول واقعیت را فیلتر کند). تغییر آن به <strong>Both</strong> می‌تواند عملکرد سیستم را کند کرده و محاسبات را مبهم کند.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "سوال مصاحبه: تفاوت Star Schema با Snowflake Schema",
                    "industry": "همه صنایع",
                    "difficulty": "پیشرفته",
                    "scenario": "مدیر دیتا از شما می‌پرسد چرا در پاور بی‌آی اصرار دارید جدول‌های دسته‌بندی محصول (Category) و ریزمحصول (Sub-category) را در قالب یک جدول Dim_Product تجمیع کنید و به صورت دانه‌برفی (Snowflake) پیوند نزنید؟",
                    "task": "بهترین دلیل فنی را برای این کار بیان کنید.",
                    "hint": "مربوط به تعداد Join ها و سرعت.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "در مدل ستاره‌ای (Star Schema)، تعداد پیوندها (Joins) به حداقل می‌رسد. موتور پردازشی VertiPaq پاور بی‌آی جداول عریض و فاقد جوین‌های زنجیره‌ای را بسیار سریع‌تر فشرده‌سازی و پردازش می‌کند، و همچنین فرمول‌نویسی DAX روی آن به‌مراتب ساده‌تر است.",
                    "solutionExplanation": "دانه‌برفی کردن مدل (ارتباط Dim به Dim) باعث افت پرفورمنس پردازش DAX می‌شود."
                }
            ],
            "keyTakeaways": [
                "قانون طلایی: فیلترها همواره از سمت 'یک' (1) جدول ابعاد، به سمت 'چند' (*) جدول واقعیت سرازیر می‌شوند."
            ]
        },
        {
            "id": "04-powerbi-dax-basics",
            "stepNumber": 4,
            "title": "زبان محاسباتی DAX: سنجه‌ها در برابر ستون‌های محاسباتی",
            "badge": "درس ۳",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۵ دقیقه",
            "summary": "محاسبات پیشرفته در حافظه: Measure ها چگونه کار می‌کنند؟",
            "contentHtml": "\n                <p>زبان DAX به شما اجازه می‌دهد محاسبات تحلیلی پویا را انجام دهید.</p>\n                <h3>سنجه (Measure) در برابر ستون محاسباتی (Calculated Column)</h3>\n                <table border=\"1\" cellpadding=\"5\" style=\"border-collapse: collapse; width: 100%; margin-bottom: 20px;\">\n                    <tr><th>ویژگی</th><th>ستون محاسباتی</th><th>سنجه (Measure)</th></tr>\n                    <tr><td>زمان محاسبه</td><td>حین Refresh دیتا (سطر به سطر)</td><td>در لحظه تعامل با نمودارها (On the fly)</td></tr>\n                    <tr><td>مصرف حافظه</td><td>رم و دیسک را اشغال می‌کند</td><td>فضایی اشغال نمی‌کند (فقط پردازنده حین رندر)</td></tr>\n                    <tr><td>Context</td><td>Row Context</td><td>Filter Context</td></tr>\n                </table>\n                <br>\n                <h3>توابع مهم و ایمن</h3>\n                <ul>\n                    <li><strong>تقسیم ایمن:</strong> هرگز از <code>/</code> استفاده نکنید. از <code>DIVIDE(Numerator, Denominator, 0)</code> استفاده کنید تا خطای تقسیم بر صفر نگیرید.</li>\n                    <li><strong>فراخوانی از جدول وابسته:</strong> با استفاده از تابع <code>RELATED(Dim_Table[Column])</code> در داخل ستون محاسباتی.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "محاسبه حاشیه سود",
                    "language": "dax",
                    "code": "Profit Margin = DIVIDE(SUM(Sales[Profit]), SUM(Sales[Revenue]), 0)"
                }
            ],
            "industryExercises": [
                {
                    "title": "استفاده از Measure به جای Column",
                    "industry": "عمومی",
                    "difficulty": "متوسط",
                    "scenario": "یک کارآموز برای محاسبه مجموع سود فصلی، یک ستون جدید ساخته که قیمت فروش را منهای هزینه کرده، و فایل به شدت کند شده است.",
                    "task": "به عنوان تحلیلگر ارشد، راهکار جایگزین شما با DAX چیست؟",
                    "hint": "استفاده از سنجه‌ها حافظه اشغال نمی‌کند.",
                    "solutionLanguage": "dax",
                    "solutionCode": "Total Profit = SUM(Sales[Revenue]) - SUM(Sales[Cost])\n\n-- و یا اگر در سطح هر سطر محاسبه قبل از جمع نیاز است:\nTotal Profit = SUMX(Sales, Sales[Revenue] - Sales[Cost])",
                    "solutionExplanation": "ستون‌های محاسباتی حجم فایل پاور بی‌آی را به شدت بالا می‌برند. همیشه برای ارقام تجمیعی، باید از Measure استفاده کنید."
                }
            ],
            "keyTakeaways": [
                "قانون نانوشته DAX: اگر یک محاسبه باید در اسلایسر (فیلتر) استفاده شود، ستون محاسباتی بسازید. در غیر این صورت، برای تمام محاسبات عددی، Measure بسازید."
            ]
        },
        {
            "id": "04-powerbi-calculate",
            "stepNumber": 5,
            "title": "جادوی پاور بی‌آی: تابع CALCULATE و هوش زمانی",
            "badge": "درس ۴",
            "isIntroOrSetup": false,
            "estimatedTime": "۴۰ دقیقه",
            "summary": "دستکاری زمینه فیلتر (Filter Context Modifier)",
            "contentHtml": "\n                <p>قدرتمندترین تابع در Power BI تابع <code>CALCULATE</code> است. این تابع به شما اجازه می‌دهد فیلترهای اعمال‌شده در داشبورد را در دل یک فرمول تغییر داده، پاک کرده یا اضافه کنید.</p>\n                <h3>سینتکس CALCULATE</h3>\n                <pre><code>CALCULATE( &lt;Expression&gt; , &lt;Filter1&gt;, &lt;Filter2&gt; )</code></pre>\n                <p><strong>مثال:</strong> فرض کنید نموداری دارید که فروش تمام محصولات را نشان می‌دهد. اما شما یک کارت می‌خواهید که <em>فقط</em> فروش دسته 'Emergency Gear' را نشان دهد، مستقل از اینکه در اسلایسر چه چیزی انتخاب شده.</p>\n                <br>\n                <h3>هوش زمانی (Time Intelligence در DAX)</h3>\n                <p>پاور بی‌آی توابعی داخلی برای مقایسه‌های دوره‌ای (Year-over-Year) دارد. <strong>شرط اصلی:</strong> داشتن یک جدول تقویم پیوسته (Dim_Date).</p>\n                <ul>\n                    <li><code>YTD (Year-to-Date):</code> فروش از ابتدای سال تا امروز.</li>\n                    <li><code>SAMEPERIODLASTYEAR:</code> واکشی فروش دقیقاً در همین تاریخ در سال گذشته.</li>\n                </ul>\n            ",
            "codeBlocks": [
                {
                    "title": "فروش فقط در یک دسته‌بندی خاص",
                    "language": "dax",
                    "code": "Emergency Gear Sales = \nCALCULATE(\n    [Total Sales],\n    Products[Category] = \"Emergency Gear\"\n)"
                },
                {
                    "title": "فروش در دوره مشابه سال قبل (YoY)",
                    "language": "dax",
                    "code": "Sales Last Year = \nCALCULATE(\n    [Total Sales],\n    SAMEPERIODLASTYEAR('Dim_Date'[Date])\n)"
                }
            ],
            "industryExercises": [
                {
                    "title": "محاسبه درصد از کل (Percent of Grand Total)",
                    "industry": "خرده‌فروشی",
                    "difficulty": "حرفه‌ای",
                    "scenario": "در یک ماتریس، در ردیف‌ها نام شهرها را دارید و در ستون فروش شهر. می‌خواهید ستون سومی اضافه کنید که سهم درصد هر شهر از 'فروش کل کشور' را نشان دهد.",
                    "task": "چگونه مخرج کسر (فروش کل کشور) را ثابت می‌کنید تا با فیلتر شهرها تغییر نکند؟",
                    "hint": "از تابع ALL در داخل CALCULATE استفاده کنید.",
                    "solutionLanguage": "dax",
                    "solutionCode": "Percent of Total = \nDIVIDE(\n    [Total Sales],\n    CALCULATE([Total Sales], ALL(Geography[City]))\n)",
                    "solutionExplanation": "تابع ALL تمامی فیلترهای روی ستون City را پاک می‌کند. بنابراین مخرج کسر همیشه جمع کل تمام شهرها خواهد بود."
                }
            ],
            "keyTakeaways": [
                "تابع CALCULATE تنها تابعی است که می‌تواند فضا و محدودیت‌های فیلترهای داشبورد را دور بزند یا آن‌ها را بازنویسی کند."
            ]
        },
        {
            "id": "04-powerbi-visuals-formatting",
            "stepNumber": 6,
            "title": "مصورسازی، داشبوردسازی و فرمت‌بندی شرطی",
            "badge": "درس ۵",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "هنر انتخاب ویژوال صحیح و رنگ‌آمیزی داینامیک داده‌ها",
            "contentHtml": "\n                <h3>کاتالوگ ویژوال‌های ضروری</h3>\n                <ul>\n                    <li><strong>کارت‌ها (Cards):</strong> برای شاخص‌های کلیدی (KPI) در بالای داشبورد.</li>\n                    <li><strong>نمودار میله‌ای (Clustered/Stacked Bar):</strong> برای مقایسه دسته‌ها و سهم از کل.</li>\n                    <li><strong>ماتریکس (Matrix):</strong> جداول محوری پیشرفته با قابلیت Drill-down (باز شدن پله‌پله).</li>\n                    <li><strong>اسلایسرها (Slicers):</strong> فیلترهای تعاملی برای کاربر نهایی (به صورت دراپ‌داون یا لیست).</li>\n                </ul>\n                <br>\n                <h3>فرمت‌بندی شرطی (Conditional Formatting)</h3>\n                <p>در جداول و ماتریکس‌ها برای برجسته‌سازی بصری:</p>\n                <ul>\n                    <li><strong>Data Bars:</strong> کشیدن یک میله افقی درون خود سلول‌های جدول متناسب با بزرگی عدد.</li>\n                    <li><strong>Color Scales:</strong> طیف حرارتی پس‌زمینه (Heatmap) از کمترین تا بیشترین رقم.</li>\n                    <li><strong>Rules:</strong> نوشتن قانون اختصاصی (مثلاً اگر عدد منفی بود فونت قرمز و bold شود).</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "پرهیز از نمودار کلوچه‌ای (Donut/Pie Chart) برای مقایسه‌های زیاد",
                    "industry": "همه صنایع",
                    "difficulty": "مقدماتی",
                    "scenario": "مدیر از شما می‌خواهد فروش ۲۰ منطقه جغرافیایی را در یک Pie Chart نشان دهید.",
                    "task": "چرا این کار از نظر اصول Data Visualization اشتباه است و چه چارتی را جایگزین می‌کنید؟",
                    "hint": "چشم انسان در تشخیص مساحت زاویه‌ها ضعیف است.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "نمودارهای دایره‌ای تنها زمانی کاربرد دارند که نهایتاً ۳ تا ۵ دسته داشته باشیم (مثل سهم سیستم‌عامل‌ها). برای ۲۰ منطقه، اسلایس‌های کیک به شدت ریز و غیرقابل تمایز می‌شوند. جایگزین صحیح: Clustered Bar Chart مرتب‌شده نزولی.",
                    "solutionExplanation": "تشخیص طول میله‌ها برای چشم انسان هزاران بار دقیق‌تر از تشخیص زاویه قطاع‌های یک دایره است."
                }
            ],
            "keyTakeaways": [
                "داشبورد را شبیه پالت رنگی نقاشی نکنید. از یک پالت رنگی حرفه‌ای مات و سازمانی استفاده کنید و فقط نکات بحرانی را با رنگ‌های تند (مثل قرمز) برجسته کنید."
            ]
        },
        {
            "id": "04-powerbi-project-survey",
            "stepNumber": 7,
            "title": "پروژه صنعتی جامع: داشبورد پیمایش شغلی متخصصان داده",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۶۰ دقیقه",
            "summary": "اجرای End-to-End پروژه از ETL تا داشبورد نهایی",
            "contentHtml": "\n                <p><strong>سناریوی کسب‌وکار:</strong> بررسی نظرسنجی از ۶۳۰ متخصص داده در جهان برای کشف میانگین دستمزدها، زبان‌های محبوب و سختی ورود به بازار کار.</p>\n                <br>\n                <h3>فاز ۱: Power Query (ETL)</h3>\n                <ul>\n                    <li>حذف ستون‌های اضافی (ایمیل‌ها).</li>\n                    <li>تفکیک ستون عناوین شغلی نامنظم (مثلاً <code>Data Analyst (junior)</code>) با جداکننده پرانتز برای استخراج عنوان اصلی.</li>\n                    <li>استانداردسازی حقوق به عنوان Fixed Decimal.</li>\n                </ul>\n                <br>\n                <h3>فاز ۲: ساخت Measure های DAX</h3>\n                <ul>\n                    <li><code>Average Salary = AVERAGE(Survey[Salary])</code></li>\n                    <li><code>Total Respondents = COUNT(Survey[ID])</code></li>\n                </ul>\n                <br>\n                <h3>فاز ۳: طراحی رابط کاربری (UI)</h3>\n                <ul>\n                    <li>دو عدد کارت بالا صفحه: تعداد شرکت‌کنندگان و میانگین درآمد.</li>\n                    <li>نمودار میله‌ای افقی: میانگین حقوق به تفکیک عنوان شغلی.</li>\n                    <li>اسلایسرها: Country و ریموت ورک.</li>\n                    <li><strong>نتیجه تعاملی (Cross-Filtering):</strong> با کلیک روی میله Data Scientist، بقیه نمودارها آپدیت شده و فقط آمار دیتا ساینتیست‌ها (زبان‌های محبوبشان و چالش‌هایشان) را نشان می‌دهند.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "مستندسازی پروژه در رزومه",
                    "industry": "توسعه شغلی",
                    "difficulty": "حرفه‌ای",
                    "scenario": "اکنون که پروژه را ساختید، باید آن را در لینکدین و رزومه پروموت کنید.",
                    "task": "چگونه دستاورد خود را در ساختار ستاره‌ای رزومه بنویسید؟",
                    "hint": "اشاره به نام ابزارها، حجم داده و خروجی.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "«طراحی و پیاده‌سازی داشبورد تعاملی تحلیل بازار کار در Power BI؛ پالایش و استانداردسازی دیتای ۶۳۰ شرکت‌کننده با Power Query (M)؛ پیاده‌سازی مدل ستاره‌ای و فرمول‌های DAX برای تحلیل پویای دستمزدها؛ تسریع فرآیند تصمیم‌گیری مدیران دپارتمان منابع انسانی با فیلترهای همگام‌سازی شده.»",
                    "solutionExplanation": "کارفرما باید کلمات کلیدی مثل Power Query, DAX و Star Schema را در شرح پروژه شما ببیند."
                }
            ],
            "keyTakeaways": [
                "قدرت Power BI در یکپارچگی ابزارهای آن است: پاک‌سازی عالی، مدل‌سازی رابطه‌ای بهینه، محاسبات سبک در لحظه، و مصورسازی تعاملی متصل به هم."
            ]
        }
    ]
});