window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

window.BOOTCAMP_MODULES.push({
    "id": "03-tableau",
    "number": "03",
    "folderName": "03-Tableau",
    "title": "هوش تجاری و مصورسازی تعاملی با Tableau",
    "subtitle": "فلسفه درگ-اند-دراپ، مصورسازی حرفه‌ای، و طراحی داشبورد با پروژه صنعتی Airbnb",
    "icon": "bar-chart-3",
    "category": "فنی",
    "estimatedHours": 15,
    "filePath": "03-Tableau/Tableau_Handbook.md",
    "steps": [
        {
            "id": "03-tableau-intro",
            "stepNumber": 1,
            "title": "مقدمه: جایگاه تبلو در اکوسیستم هوش تجاری",
            "badge": "معرفی",
            "isIntroOrSetup": true,
            "estimatedTime": "۱۰ دقیقه",
            "summary": "تفاوت‌های تبلو با اکسل و مفاهیم پایه‌ای داستان‌سرایی با داده",
            "contentHtml": "\n                <p>در فرآیند تحلیل داده، مهم‌ترین بخش کار <strong>داستان‌سرایی با داده‌ها (Data Storytelling)</strong> و انتقال شفاف بینش‌ها به مدیران است.</p>\n                <h3>تفاوت تبلو با ابزارهای سنتی (اکسل)</h3>\n                <ul>\n                    <li><strong>مدیریت حجم عظیم داده:</strong> اکسل محدود به ۱ میلیون سطر است اما تبلو با دیتاست‌های ده‌ها میلیونی کار می‌کند.</li>\n                    <li><strong>بدون کدنویسی پیچیده:</strong> بر اساس تکنولوژی VizQL کار می‌کند که درگ‌دراپ‌های شما را به کوئری‌های SQL بهینه‌سازی شده تبدیل می‌نماید.</li>\n                    <li><strong>Tableau Public:</strong> ابزار کاملاً رایگان برای ساخت پورتفولیو آنلاین.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [],
            "keyTakeaways": [
                "برای ساخت پورتفولیو و مصاحبه‌ها نیازی به خرید لایسنس ندارید، از نسخه رایگان Tableau Public استفاده کنید."
            ]
        },
        {
            "id": "03-tableau-architecture",
            "stepNumber": 2,
            "title": "معماری رابط کاربری (UI Architecture)",
            "badge": "درس ۱",
            "isIntroOrSetup": false,
            "estimatedTime": "۱۵ دقیقه",
            "summary": "آشنایی با Worksheet، Dashboard، پنل‌ها و Marks Card",
            "contentHtml": "\n                <h3>آناتومی و معماری تبلو</h3>\n                <ul>\n                    <li><strong>Worksheet:</strong> کوچک‌ترین واحد کاری برای کشیدن یک نمودار.</li>\n                    <li><strong>Dashboard:</strong> ترکیب چند ورک‌شیت و فیلترها.</li>\n                    <li><strong>Story:</strong> حالت اسلایدی و پرزنتیشن داده.</li>\n                </ul>\n                <br>\n                <h3>قفسه‌ها و کارت نشانه‌ها (Marks Card)</h3>\n                <p>قدرتمندترین بخش تبلو برای شخصی‌سازی بصری:</p>\n                <ul>\n                    <li><strong>Color / Size:</strong> تغییر رنگ و سایز بر اساس دیتا.</li>\n                    <li><strong>Label / Detail:</strong> نمایش اعداد مستقیم یا اضافه کردن جزئیات.</li>\n                    <li><strong>Tooltip:</strong> راهنمای شناوری که با موس روی المان‌ها نمایش داده می‌شود.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "طراحی Tooltip برای کاربران تجاری",
                    "industry": "عمومی",
                    "difficulty": "مقدماتی",
                    "scenario": "مدیران معمولا علاقه‌ای به خواندن تولتیپ‌های پیش‌فرض تبلو (که فرمت جدولی دارد) ندارند.",
                    "task": "چگونه می‌توان فرمت را از `Profit: $200` به یک جمله کاربرپسند مثل `The total profit in Q1 was $200` تغییر داد؟",
                    "hint": "در کارت Marks روی دکمه Tooltip کلیک کنید.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "با کلیک روی گزینه Tooltip در پنل Marks، ویرایشگر متنی باز می‌شود. می‌توانید تگ‌های دیتای پیش‌فرض را پاک کرده و به صورت یک جمله بنویسید:\n`The total profit for <Region> region was <SUM(Profit)>`",
                    "solutionExplanation": "داستان‌سرایی با داده یعنی حتی ریزترین بخش‌ها مثل Tooltip ها برای کاربر نهایی (مدیران) قابل خواندن و مثل زبان محاوره‌ای باشد."
                }
            ],
            "keyTakeaways": [
                "منوی Show Me در سمت راست بالا بهترین پیشنهاددهنده نوع چارت بر اساس فیلدهای انتخابی شماست."
            ]
        },
        {
            "id": "03-tableau-dimensions-measures",
            "stepNumber": 3,
            "title": "مفاهیم بنیادین: ابعاد، سنجه‌ها، رنگ‌های آبی و سبز",
            "badge": "درس ۲",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۰ دقیقه",
            "summary": "درک عمیق تفاوت Dimensions و Measures و راز رنگ‌های تبلو",
            "contentHtml": "\n                <p>قلب تپنده تبلو، شناخت تفاوت این دو مفهوم است:</p>\n                <h3>Dimensions در برابر Measures</h3>\n                <ul>\n                    <li><strong>ابعاد (Dimensions):</strong> ویژگی‌های کیفی/متنی/تاریخی که داده‌ها را گروه بندی می‌کنند (مانند کشور، سال، گروه محصول).</li>\n                    <li><strong>سنجه‌ها (Measures):</strong> ارقام کمی که روی آن‌ها محاسبات ریاضی انجام می‌شود (مانند فروش، سود).</li>\n                </ul>\n                <br>\n                <h3>راز رنگ آبی و سبز</h3>\n                <p>یک اشتباه رایج این است که آبی یعنی بُعد و سبز یعنی سنجه! در تبلو:</p>\n                <ul>\n                    <li><strong>رنگ آبی (Discrete - گسسته):</strong> مقادیر تفکیک‌شده که در جدول، «سربرگ» (Header) می‌سازند.</li>\n                    <li><strong>رنگ سبز (Continuous - پیوسته):</strong> مقادیر نامحدود که در جدول، «محور متصل» (Axis) می‌سازند.</li>\n                </ul>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "تبدیل تاریخ از حالت گسسته به پیوسته",
                    "industry": "همه صنایع",
                    "difficulty": "متوسط",
                    "scenario": "وقتی سال فروش (Order Date) را در ستون‌ها می‌کشید، رنگ آن آبی است و ستون‌های جداگانه می‌سازد، اما شما می‌خواهید یک لاین چارت زمانی متصل بکشید.",
                    "task": "چگونه فیلد تاریخ را از حالت ایجاد Header (آبی) به ساخت Axis (سبز) تغییر می‌دهید؟",
                    "hint": "روی فیلد راست‌کلیک کنید.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "روی فیلد Order Date در قفسه Columns کلیک‌راست کرده و از لیست گزینه‌ها، قسمت پایین‌ترِ فرمت‌های تاریخ (که جلوی آنها پیش‌نمایش عددی مثل 'May 2015' نوشته شده و پیوسته هستند) را انتخاب کنید. بلافاصله رنگ آن سبز (Continuous) می‌شود.",
                    "solutionExplanation": "برای ترسیم Line Chart زمانی استاندارد، همیشه فیلد تاریخ در Columns باید رنگش سبز باشد."
                }
            ],
            "keyTakeaways": [
                "همیشه یک بُعد (Dimension) می‌تواند به شکل پیوسته (Continuous) رفتار کند و برعکس. رنگ نشان‌دهنده گسسته/پیوسته بودن است، نه نوع فیلد!"
            ]
        },
        {
            "id": "03-tableau-joins",
            "stepNumber": 4,
            "title": "لایه منطقی و فیزیکی (Relationships vs Joins)",
            "badge": "درس ۳",
            "isIntroOrSetup": false,
            "estimatedTime": "۲۵ دقیقه",
            "summary": "نودل‌های تبلو (Noodles) چه تفاوتی با ജോین‌های کلاسیک SQL دارند؟",
            "contentHtml": "\n                <p>در تبلو، اتصال جداول در دو لایه صورت می‌گیرد:</p>\n                <h3>۱. لایه منطقی (Relationships یا نودل‌ها)</h3>\n                <p>پیش‌فرض تبلو است و جداول با یک خط منحنی وصل می‌شوند. جدول‌ها قطعی ترکیب نمی‌شوند، بلکه بسته به اینکه چه فیلدی را در درگ کنید، کوئری مناسب تولید شده و مانع از تکرار اشتباه داده‌ها می‌شود.</p>\n                <br>\n                <h3>۲. لایه فیزیکی (Classic Joins)</h3>\n                <p>با دابل-کلیک روی جدول در Data Source، به لایه زیرین می‌روید که Inner, Left, Right, Full Outer Join در دسترس است.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "جلوگیری از خطای داده تکراری",
                    "industry": "مهندسی داده",
                    "difficulty": "حرفه‌ای",
                    "scenario": "شما جدول فروش (در سطح محصول) را با جدول تخفیفات (در سطح روز) Left Join کردید. ناگهان مجموع فروش دو برابر واقعیت نمایش داده می‌شود!",
                    "task": "چرا این اتفاق می‌افتد و تبلو چگونه آن را با Relationships حل کرده است؟",
                    "hint": "سطح جزئیات (Granularity) متفاوت است.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "چون یک تخفیف روی چندین محصول اعمال شده، رکوردهای فروش داپلیکیت می‌شوند (Many-to-Many). در حالی که اگر از Relationship (خطوط نودل) استفاده کنیم، تبلو هر جدول را در سطح Level of Detail خودش حفظ می‌کند و تجمیع فروش قبل از اتصال رخ می‌دهد و عدد درست می‌ماند.",
                    "solutionExplanation": "این ویژگی از نسخه 2020.2 معرفی شد و بزرگ‌ترین مزیت رقابتی تبلو است."
                }
            ],
            "keyTakeaways": [
                "مگر اینکه نیازمند فیلتر کردن ردیف‌ها پیش از ورود به نرم‌افزار باشید، از حالت Relationships استفاده کنید."
            ]
        },
        {
            "id": "03-tableau-calculations",
            "stepNumber": 5,
            "title": "فیلدهای محاسباتی (Calculated Fields) و بازه‌بندی (Bins)",
            "badge": "درس ۴",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۰ دقیقه",
            "summary": "کدنویسی درون تبلو برای ساخت معیارهای جدید",
            "contentHtml": "\n                <p>برای ساخت ستون‌های جدید محاسباتی، تحلیلی یا منطقی از Calculated Field استفاده می‌شود:</p>\n                <h3>فرمول‌های منطقی</h3>\n                <pre><code>IF [Price] > 200 THEN \"Expensive\"\nELSEIF [Price] >= 100 THEN \"Moderate\"\nELSE \"Affordable\"\nEND</code></pre>\n                <br>\n                <h3>بزرگترین دام در محاسبات تبلو</h3>\n                <p>هنگام محاسبه نرخ‌هایی مثل حاشیه سود، اگر بنویسید <code>[Profit]/[Sales]</code>، تبلو نسبت را برای هر سطر حساب کرده و سپس آن‌ها را با هم جمع می‌کند که کاملاً غلط است!</p>\n                <p><strong>فرمول صحیح:</strong> باید جمع کل سود را بر جمع کل فروش تقسیم کنید: <code>SUM([Profit]) / SUM([Sales])</code></p>\n                <br>\n                <h3>بازه‌بندی (Bins)</h3>\n                <p>برای ایجاد هیستوگرام، روی فیلد عددی راست-کلیک کنید -> Create -> Bins. (مثلاً سنین در بازه‌های ۱۰ ساله)</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "محاسبه درصد بازگشت کالا (Return Rate)",
                    "industry": "فروشگاه آنلاین",
                    "difficulty": "پیشرفته",
                    "scenario": "یک فیلد به نام Returns دارید که شامل تعداد کالای مرجوعی است. یک فیلد هم Orders (تعداد سفارشات).",
                    "task": "فرمول دقیق و حرفه‌ای برای نرخ مرجوعی بنویسید.",
                    "hint": "در سطح کل باید محاسبه شود.",
                    "solutionLanguage": "tableau",
                    "solutionCode": "SUM([Returns]) / SUM([Orders])",
                    "solutionExplanation": "همیشه در مصاحبه‌ها سوال می‌کنند که چه زمانی از توابع تجمعی مثل SUM در داخل Calculated Field استفاده می‌کنید. جواب: برای محاسبه «نرخ‌ها» و «نسبت‌ها» در سطح کلانی (Aggregate Level)."
                }
            ],
            "keyTakeaways": [
                "هرگاه قرار است یک کسر یا درصد را محاسبه کنید، همیشه صورت و مخرج را مستقلاً درون توابع تجمعی (مثل SUM) قرار دهید."
            ]
        },
        {
            "id": "03-tableau-charts",
            "stepNumber": 6,
            "title": "محور دوگانه (Dual-Axis)، نقشه‌ها و نمودارهای کاربردی",
            "badge": "درس ۵",
            "isIntroOrSetup": false,
            "estimatedTime": "۳۵ دقیقه",
            "summary": "مقایسه دو سنجه با یکدیگر روی یک نمودار و نقشه تراکم",
            "contentHtml": "\n                <h3>۱. محور دوگانه (Dual-Axis Chart)</h3>\n                <p>برای مقایسه دو سنجه متفاوت (مانند فروش منطقه‌ای و جهانی) در کنار هم:</p>\n                <ol>\n                    <li>سنجه دوم را بکشید کنار سنجه اول در سطرها.</li>\n                    <li>روی محور سنجه دوم کلیک‌راست کرده و <strong><code>Dual Axis</code></strong> را بزنید.</li>\n                    <li><strong>گام مهم:</strong> روی محور کلیک‌راست کرده و <strong><code>Synchronize Axis</code></strong> را بزنید!</li>\n                </ol>\n                <br>\n                <h3>۲. نقشه‌ها و توزیع مکانی</h3>\n                <p>با کشیدن فیلدهای جغرافیایی (Zipcode, City)، تبلو طول و عرض را می‌سازد. تغییر نوع مارک به <strong>Density</strong> برای نقاط داغ (Heatmap) بسیار جذاب است.</p>\n                <br>\n                <h3>۳. نمودار جعبه و خط (Box Plot)</h3>\n                <p>برای بررسی توزیع آماری و تشخیص داده‌های پرت (Outliers) استفاده می‌شود که از تب Analytics اضافه می‌گردد.</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "ترکیب نمودار فروش و هدف (Target)",
                    "industry": "مدیریت فروش",
                    "difficulty": "متوسط",
                    "scenario": "شما می‌خواهید فروش هر منطقه را به صورت Bar Chart نشان دهید و در کنار آن روی همان ستون، نقطه هدف فروش (Target) را به صورت یک خط تیره نمایش دهید.",
                    "task": "مراحل ساخت این گراف را نام ببرید.",
                    "hint": "از Dual Axis استفاده می‌شود.",
                    "solutionLanguage": "markdown",
                    "solutionCode": "1. کشیدن Sales و Target هر دو به قفسه Rows.\n2. کلیک راست روی Target و انتخاب Dual Axis و سپس Synchronize Axis.\n3. در کارت Marks، نوع نمودار Sales را روی Bar قرار دهید.\n4. نوع نمودار Target را روی Gantt Bar (یا Line) قرار دهید.",
                    "solutionExplanation": "به این نوع نمودار Bullet Chart گفته می‌شود که ابزار اصلی مانیتورینگ KPI است."
                }
            ],
            "keyTakeaways": [
                "بدون زدن دکمه Synchronize Axis، دو محور با مقیاس‌های مختلف در کنار هم رسم می‌شوند که کاملاً تحلیل را گمراه‌کننده می‌کند!"
            ]
        },
        {
            "id": "03-tableau-airbnb-project",
            "stepNumber": 7,
            "title": "پروژه صنعتی جامع: داشبورد املاک و اقامتگاه‌های سیاتل (Airbnb)",
            "badge": "پروژه",
            "isIntroOrSetup": false,
            "estimatedTime": "۶۰ دقیقه",
            "summary": "سناریوی صفر تا صد: کشف کدهای پستی سودآور و نوسانات قیمت فصلی",
            "contentHtml": "\n                <p><strong>سناریوی بیزینس:</strong> سرمایه‌گذار مسکن می‌خواهد بداند بهترین منطقه، بهترین فصل و متراژ مناسب برای درآمد از Airbnb کجاست؟</p>\n                <br>\n                <h3>طراحی ۴ ورک‌شیت تحلیلی</h3>\n                <ol>\n                    <li><strong>میانگین قیمت بر اساس Zipcode:</strong> استفاده از چارت میله‌ای نزولی.</li>\n                    <li><strong>نقشه تعاملی جغرافیایی سیاتل:</strong> قرار دادن Zipcode در Tooltip و استفاده از رنگ برای تراکم قیمت‌ها.</li>\n                    <li><strong>روند تغییرات هفتگی قیمت:</strong> کشیدن هفته‌های سال ۲۰۱۶ و نمایش در قالب Line Chart (نشان‌دهنده پیک تابستان).</li>\n                    <li><strong>تأثیر تعداد اتاق خواب بر نرخ:</strong> استفاده از چارت میله‌ای.</li>\n                </ol>\n                <br>\n                <h3>داشبورد و Filter Actions</h3>\n                <p>قرار دادن هر ۴ شیت در یک صفحه، کلیک روی آیکون <strong><code>Use as Filter</code></strong> (شکل قیف) روی نقشه.</p>\n                <p><em>نتیجه:</em> کلیک روی هر محله، سریعاً نمودار هفتگی و نمودار اتاق‌ها را آپدیت می‌کند!</p>\n            ",
            "codeBlocks": [],
            "industryExercises": [
                {
                    "title": "سوال مصاحبه: حل خطای Data Explosion",
                    "industry": "همه صنایع",
                    "difficulty": "حرفه‌ای",
                    "scenario": "فایل Listings تعداد ۳۸۰۰ رکورد دارد، اما وقتی با فایل Calendar شامل تاریخ‌های ۳۶۵ روز جوین می‌شود، تبلو میلیون‌ها سطر تولید می‌کند و گیر می‌کند.",
                    "task": "چگونه به کارفرما اثبات می‌کنید که راهکاری برای جلوگیری از این کندی در Tableau Public دارید؟",
                    "hint": "در مرحله Data Source",
                    "solutionLanguage": "markdown",
                    "solutionCode": "در صفحه Data Source، روی فیلتر تقویم کلیک کرده و **Data Source Filter** می‌گذاریم تا مثلاً فقط داده‌های ماه جولای (یا سال ۲۰۱۶) به حافظه تبلو لود شود. همچنین استفاده از لایه Relationship به جای Join کلاسیک از این Data Explosion جلوگیری می‌کند.",
                    "solutionExplanation": "در شرکت‌های بزرگ، هیچکس همه داده دیتابیس را لود نمی‌کند؛ این مهارت Data Source Filtering حیاتی است."
                }
            ],
            "keyTakeaways": [
                "استفاده از Action Filters در داشبورد، تفاوت یک عکس استاتیک را با یک محصول BI تعاملی رقم می‌زند."
            ]
        }
    ]
});