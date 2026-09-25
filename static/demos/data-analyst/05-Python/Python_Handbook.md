# جزوه جامع آموزش پایتون برای تحلیلگران داده (Python for Data Analytics Handbook)

**مرجع کاربردی برنامه‌نویسی، کتابخانه پانداس، وب‌اسکرپینگ، اتوماسیون API و تحلیل اکتشافی داده‌ها (EDA) در بوت‌کمپ جامع تحلیل داده ۲۰۲۶**

---

## مقدمه: جایگاه پایتون در زیست‌بوم تحلیل داده

پایتون (Python) یکی از منعطف‌ترین، قدرتمندترین و پرتقاضاترین ابزارهای اکوسیستم داده است. در حالی که اکسل و تبلو ابزارهای فوق‌العاده‌ای برای گزارش‌گیری سریع و مصورسازی مدیریتی هستند، پایتون به تحلیلگر اجازه می‌دهد تا فراتر از محدودیت‌های نرم‌افزارهای تجاری حرکت کند:

```
[انعطاف و قدرت در مدیریت داده]
  ├── استخراج داده: وب‌اسکرپینگ (Web Scraping) و دریافت مستقیم از APIها
  ├── مهندسی و دگرگون‌سازی: کار با میلیون‌ها رکورد با کتابخانه Pandas و NumPy
  ├── تحلیل اکتشافی (EDA): کاوش آماری عمیق، کشف همبستگی و پاک‌سازی داده‌های کثیف
  └── اتوماسیون: اجرای خودکار اسکریپت‌ها، زمان‌بندی پایپ‌لاین‌ها و گزارش‌دهی دوره‌ای
```

### مقایسه کلیدی پایتون با SQL و ابزارهای BI:
* **SQL:** بی‌رقیب در بازیابی سریع داده‌ها از پایگاه داده و گروه‌بندی‌های تجمعی در سطح سرور دیتابیس.
* **ابزارهای BI (Tableau / Power BI):** ایده‌آل برای داشبوردهای بصری تعاملی و داستان‌سرایی داده برای مدیران ارشد.
* **Python:** چسب اتصال تمام مراحل تحلیل داده؛ از جمع‌آوری اختصاصی داده، پاک‌سازی پیشرفته، ساخت مدل‌های تحلیلی تا اتوماسیون فرآیندهای تکراری.

---

## فصل ۱: راه‌اندازی محیط توسعه و مبانی بنیادین زبان پایتون

### ۱. راه‌اندازی محیط کاری (Anaconda و Jupyter Notebooks)

بهترین و پایدارترین توزیع برای یادگیری و کار با علوم داده، پلتفرم منبع‌باز **Anaconda** است:
* **Anaconda:** پکیج جامعی شامل پایتون، مدیر بسته‌ها (Conda/Pip) و ده‌ها کتابخانه پیش‌فرض تحلیلی مانند Pandas، NumPy، Matplotlib و Seaborn.
* **Jupyter Notebook:** محیط توسعه تعاملی که به تحلیلگر امکان می‌دهد کدها را در بلوک‌های مجزا (Cells) اجرا کرده و خروجی داده، جداول و نمودارها را فوراً در زیر هر سلول مشاهده کند.
* **VS Code:** محیط توسعه استاندارد برای زمانی که قصد داریم اسکریپت‌های اتوماسیون طولانی و پایپ‌لاین‌های خودکار (مانند وب‌اسکرپینگ مداوم) را بدون نیاز به باز نگه‌داشتن مرورگر اجرا کنیم.

---

### ۲. متغیرها و انواع داده (Data Types)

در پایتون، نوع متغیر به صورت خودکار تعیین می‌شود (Dynamic Typing):

| نوع داده | نام در پایتون | مثال | کاربرد در تحلیل داده |
| :--- | :--- | :--- | :--- |
| **عدد صحیح** | `int` | `10`, `-5` | شمارش رکوردها، شناسه‌ها (IDs)، سن |
| **عدد اعشاری** | `float` | `99.95`, `0.15` | مبالغ درآمد، قیمت، نرخ تبدیل و ضرایب |
| **رشته متنی** | `str` | `"Alex"`, `'Sales'` | نام دسته‌بندی‌ها، اسامی مشتریان، توضیحات |
| **بولی** | `bool` | `True`, `False` | شرط‌های فیلترینگ و پرچم‌های وضعیت |

---

### ۳. ساختارهای داده اصلی (Data Collections)

یکی از مهم‌ترین مباحث در آزمون‌ها و پروژه‌های پایتون، تسلط بر ۴ ساختار داده درونی آن است:

```python
# ۱. لیست (List) - مرتب، تغییرپذیر و با قابلیت ذخیره مقادیر تکراری
fruits = ["Apple", "Banana", "Cherry", "Apple"]
fruits.append("Orange")

# ۲. تاپل (Tuple) - مرتب، غیرقابل تغییر (Immutable) و سبک‌تر در حافظه
coordinates = (40.7128, -74.0060)

# ۳. مجموعه (Set) - بدون ترتیب، بدون مقادیر تکراری و دارای عملیات ریاضی مجموعه‌ها
unique_users = {"UserA", "UserB", "UserA"} # مقدار UserA فقط یک‌بار ثبت می‌شود
print(unique_users)  # خروجی: {'UserA', 'UserB'}

# ۴. دیکشنری (Dictionary) - ساختار کلید-مقدار (Key-Value Pairs)
customer_profile = {
    "id": 101,
    "name": "Alex",
    "role": "Data Analyst",
    "skills": ["SQL", "PowerBI", "Python"]
}
print(customer_profile["name"])  # Alex
```

---

### ۴. تبدیل انواع داده (Type Casting)

در هنگام دریافت داده از فایل‌ها، گاهی داده‌ها در قالب نامناسب بارگذاری می‌شوند:
```python
price_str = "150"
price_numeric = int(price_str)          # تبدیل رشته به عدد صحیح
price_float = float(price_numeric)       # تبدیل به عدد اعشاری: 150.0

# حذف موارد تکراری با تبدیل لیست به ست و بالعکس:
raw_ids = [101, 102, 103, 101, 102]
clean_unique_ids = list(set(raw_ids))    # [101, 102, 103]
```

---

## فصل ۲: منطق برنامه‌نویسی، ساختارهای کنترلی و مینی‌پروژه

### ۱. دستورات شرطی و عملگرهای مقایسه‌ای (`if / elif / else`)

```python
salary = 65000

if salary > 80000:
    tier = "Senior Tier"
elif salary >= 50000:
    tier = "Mid Tier"
else:
    tier = "Entry Tier"
```

---

### ۲. حلقه‌ها (`for` و `while`)

* **حلقه `for`:** پیمایش روی عناصر یک دنباله (لیست، ستون، دیکشنری):
```python
tools = ["SQL", "Excel", "Tableau", "Python"]
for tool in tools:
    print(f"Tool to master: {tool}")
```

* **حلقه `while`:** تکرار دستور تا زمان برقرار بودن یک شرط خاص:
```python
attempts = 0
while attempts < 3:
    print(f"Checking API status... Attempt: {attempts + 1}")
    attempts += 1
```

---

### ۳. توابع و عبارات لامبدا (`def` & `lambda`)

* **تعریف تابع استاندارد:**
```python
def calculate_net_revenue(gross_sales, tax_rate=0.09):
    net = gross_sales * (1 - tax_rate)
    return round(net, 2)

revenue_net = calculate_net_revenue(10000)
```

* **توابع تک‌خطی ناشناس (Lambda):**
```python
# مناسب برای استفاده در داخل پانداس و متدهای map و apply
calculate_tax = lambda x: x * 0.09
```

---

### ۴. پروژه مینی ۱: محاسبه‌گر تعاملی شاخص توده بدنی (BMI Calculator)

این پروژه برای درک تعامل کاربر، دریافت ورودی (`input`)، تبدیل انواع داده و استفاده از شروط چندسطحی پیاده‌سازی می‌شود:

```python
def run_bmi_calculator():
    name = input("Enter your name: ")
    weight = float(input("Enter your weight in pounds: "))
    height = float(input("Enter your height in inches: "))
    
    # فرمول استاندارد محاسبه BMI با واحدهای امپریال
    bmi = (weight * 703) / (height ** 2)
    bmi = round(bmi, 2)
    
    print(f"\n--- Result for {name} ---")
    print(f"Calculated BMI: {bmi}")
    
    if bmi < 18.5:
        category = "Underweight"
        advice = "You need to add more nutritious calories to your diet."
    elif 18.5 <= bmi <= 24.9:
        category = "Normal Weight"
        advice = "Great job! Keep maintaining your healthy lifestyle."
    elif 25.0 <= bmi <= 29.9:
        category = "Overweight"
        advice = "You need to exercise more and avoid prolonged sitting."
    else:
        category = "Obese"
        advice = "Please consult a healthcare professional for a healthy routine."
        
    print(f"Status: {category}")
    print(f"Recommendation: {advice}")

# اجرای برنامه:
# run_bmi_calculator()
```

---

## فصل ۳: اتوماسیون فایل‌ها با کتابخانه‌های `os` و `shutil`

یکی از وظایف متداول تحلیلگران داده، مدیریت صدها فایلی است که روزانه از دیتابیس‌ها و سامانه‌ها دانلود می‌شوند.

### پروژه مینی ۲: مرتب‌ساز خودکار فایل‌ها (Automatic File Sorter)

این اسکریپت با بررسی پسوند فایل‌های موجود در یک پوشه ورودی، پوشه‌های متناظر را در صورت عدم وجود ساخته و هر فایل را به پوشه مربوط به خود منتقل می‌کند:

```python
import os
import shutil

def organize_download_folder(target_directory):
    # دریافت لیست تمامی فایل‌های داخل پوشه
    file_names = os.listdir(target_directory)
    
    # ساختاربندی پوشه‌های مقصد بر اساس فرمت‌ها
    folder_mapping = {
        "csv files": [".csv"],
        "excel files": [".xlsx", ".xls"],
        "image files": [".jpg", ".png", ".jpeg"],
        "text files": [".txt", ".docx", ".pdf"]
    }
    
    # ایجاد پوشه‌ها در صورت عدم وجود
    for folder in folder_mapping.keys():
        folder_path = os.path.join(target_directory, folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            
    # بررسی تک‌تک فایل‌ها و جابجایی آن‌ها
    for file in file_names:
        full_source_path = os.path.join(target_directory, file)
        
        # نادیده گرفتن خود پوشه‌ها
        if os.path.isdir(full_source_path):
            continue
            
        # بررسی پسوند و انتقال فایل
        _, file_extension = os.path.splitext(file)
        file_extension = file_extension.lower()
        
        for folder, extensions in folder_mapping.items():
            if file_extension in extensions:
                destination_path = os.path.join(target_directory, folder, file)
                shutil.move(full_source_path, destination_path)
                print(f"Moved: {file} --> {folder}/")

# مسیر پوشه مورد نظر را وارد کرده و تابع را صدا بزنید:
# organize_download_folder(r"C:\Users\Username\Downloads\Raw_Dropzone")
```

---

## فصل ۴: کتابخانه پانداس (Pandas) - ستون فقرات تحلیل داده

کتابخانه **Pandas** ابزار اصلی دستکاری، فیلترسازی و تحلیل ساختاریافته داده‌ها در زبان پایتون است.

```python
import pandas as pd
import numpy as np
```

### ۱. ساختارهای اصلی: Series در برابر DataFrame

* **Series:** آرایه‌ای تک‌بعدی از داده‌ها دارای برچسب ایندکس (مشابه یک ستون مجزای جدول اکسل).
* **DataFrame:** ساختار جدولی دو‌بعدی متشکل از چندین سطر و ستون، با قابلیت ذخیره انواع داده‌های متناظر.

---

### ۲. خواندن و ذخیره انواع فایل‌ها (Data Ingestion)

```python
# ۱. خواندن فایل‌های CSV با پارامترهای اختصاصی
df = pd.read_csv('world_population.csv')

# ۲. خواندن فایل‌های جداشده با تب یا مقادیر دلخواه (Read Table)
df_tsv = pd.read_table('customers.txt', sep='\t')

# ۳. خواندن فایل‌های اکسل
df_excel = pd.read_excel('sales_q4.xlsx', sheet_name='Sheet1')

# ۴. خروجی گرفتن به فایل CSV بدون درج ستون ایندکس اضافه
df.to_csv('cleaned_output.csv', index=False)
```

---

### ۳. متدهای کلیدی بازرسی و شناخت اولیه ساختار داده

```python
# نمایش ۵ سطر نخست و انتهایی
df.head()
df.tail(3)

# ابعاد جدول (تعداد سطرها و ستون‌ها به صورت تاپل)
print(df.shape)  # مثال: (234, 17)

# خلاصه ساختاری جامع: نوع داده‌ها و تعداد مقادیر غیر تهی (Non-Null)
df.info()

# خلاصه آماری ۵ نقطه‌ای ستون‌های عددی (Count, Mean, Std, Min, 25%, 50%, 75%, Max)
df.describe()

# بررسی مستقیم نام ستون‌ها و ایندکس‌ها
print(df.columns)
print(df.dtypes)

# فیلتر کردن ستون‌ها بر اساس نوع داده خاص
numeric_columns = df.select_dtypes(include=['number'])
text_columns = df.select_dtypes(include=['object'])
```

---

### ۴. انتخاب، برش و فیلترسازی شرطی (Indexing & Slicing)

#### تفاوت بنیادین `.loc[]` و `.iloc[]`:
* **`.loc[]` (Label-based):** دسترسی بر اساس برچسب نام سطر و ستون.
* **`.iloc[]` (Integer-based):** دسترسی دقیقاً بر پایه شماره اندیس موقعیت سطر و ستون (از مبنای صفر).

```python
# دسترسی به ۳ سطر اول و ستون‌های خاص با برچسب:
subset1 = df.loc[0:2, ['Country', '2022 Population', 'Capital']]

# دسترسی به ۱۰ سطر اول و ۳ ستون اول با اندیس عددی:
subset2 = df.iloc[0:10, 0:3]

# فیلترهای چندشرطی پیشرفته:
# شرط: کشورهایی در قاره آسیا با جمعیت بالای ۱۰۰ میلیون نفر
asian_giants = df[(df['Continent'] == 'Asia') & (df['2022 Population'] > 100000000)]

# استفاده از عملگرهای تحلیلی isin() و str.contains():
selected_countries = df[df['Country'].isin(['Brazil', 'India', 'Canada'])]
united_entities = df[df['Country'].str.contains('United', case=False, na=False)]
```

---

### ۵. تجمیع و گروه‌بندی داده‌ها (Aggregation & GroupBy)

عملیات `groupby` در پانداس مستقیماً معادل دستور `GROUP BY` در پایگاه داده‌های رابطه‌ای است:

```python
# ۱. گروه‌بندی تک‌ستونه و محاسبه میانگین متغیرهای عددی
continent_summary = df.groupby('Continent').mean(numeric_only=True)

# ۲. گروه‌بندی چندستونه و شمارش تعداد
df.groupby(['Continent', 'Growth Rate']).count()

# ۳. استفاده از متد قدرتمند .agg() برای اجرای چندین محاسبه مختلف روی ستون‌های مجزا
custom_agg = df.groupby('Continent').agg({
    '2022 Population': ['mean', 'max', 'min'],
    'Area (km²)': ['sum'],
    'Country': ['count']
})
```

---

### ۶. ادغام، اتصال و جوین جداول (Merge & Concatenate)

```python
# جوین داخلی (Inner Join - اشتراک دو جدول بر اساس کلید):
merged_inner = pd.merge(df_customers, df_orders, on='customer_id', how='inner')

# جوین کامل بیرونی با پسوندهای سفارشی (Full Outer Join with Custom Suffixes):
merged_outer = pd.merge(
    df_sales_2022, 
    df_sales_2023, 
    on='product_id', 
    how='outer', 
    suffixes=('_2022', '_2023')
)

# چسباندن عمودی یا افقی داده‌ها (Concatenation):
combined_rows = pd.concat([df_q1, df_q2, df_q3], axis=0).reset_index(drop=True)
```

---

## فصل ۵: پروژه عملی پاک‌سازی داده‌ها با پانداس (Data Cleaning Project)

در سناریوهای واقعی، مجموعه‌داده‌های خام مشتریان (مانند خروجی سامانه‌های فروش یا CRM) سرشار از مقادیر تکراری، ناهماهنگی در شماره تلفن‌ها، فیلدهای تهی و فاصله‌های هرز هستند.

```
[مجموعه‌داده خام نامنظم]
  ├── حذف رکوردهای کاملاً تکراری (Duplicate Rows)
  ├── تمیز کردن نام، نام خانوادگی و حذف کاراکترهای هرز (Regex / String Operations)
  ├── استانداردسازی ارقام شماره تلفن به قالب 123-456-7890
  ├── اصلاح مقادیر بولی، متنی و جداسازی آدرس، شهر و کدپستی
  └── پاک‌سازی ردیف‌های نامعتبر یا بدون شماره تماس
```

### پیاده‌سازی گام‌به‌گام کد پاک‌سازی:

```python
import pandas as pd

# ۱. بارگذاری فایل خام
df = pd.read_excel('Customer_Call_List.xlsx')

# ۲. حذف رکوردهای تکراری مطلق
df = df.drop_duplicates().reset_index(drop=True)

# ۳. حذف ستون‌های بی‌فایده و زائد
df = df.drop(columns=['Not_Useful_Column', 'Internal_Notes'], errors='ignore')

# ۴. پاک‌سازی ستون نام خانوادگی از کاراکترهای زائد (علامت‌های @، خط فاصله، اسلش، نقطه و اعداد هرز)
# استفاده از استریپینگ و رجکس
df['Last_Name'] = df['Last_Name'].str.strip("123._/ ")

# ۵. استانداردسازی شماره‌های تلفن (Phone Numbers)
# الف) حذف هر کاراکتر غیرعددی
df['Phone_Number'] = df['Phone_Number'].astype(str)
df['Phone_Number'] = df['Phone_Number'].str.replace('[^0-9]', '', regex=True)

# ب) قالب‌بندی به ساختار استاندارد بین‌المللی: 123-456-7890
df['Phone_Number'] = df['Phone_Number'].apply(
    lambda x: f"{x[0:3]}-{x[3:6]}-{x[6:10]}" if len(x) == 10 else ''
)

# ۶. تفکیک ستون ترکیبی آدرس (Split Address into Street, State, Zip)
split_address = df['Address'].str.split(',', n=2, expand=True)
df['Street_Address'] = split_address[0].str.strip()
df['State'] = split_address[1].str.strip()
df['Zip_Code'] = split_address[2].str.strip()
df = df.drop(columns=['Address'])

# ۷. استانداردسازی مقادیر وضعیت پرداخت و رضایت (Yes/No)
df['Paying_Customer'] = df['Paying_Customer'].str.replace('Yes', 'Y').str.replace('No', 'N')
df['Do_Not_Contact'] = df['Do_Not_Contact'].str.replace('Yes', 'Y').str.replace('No', 'N')

# ۸. مدیریت رکوردهایی که نباید با آنها تماس گرفته شود یا شماره تماس ندارند
# حذف ردیف‌هایی با شماره تلفن خالی یا پرچم Do_Not_Contact معادل Y
df = df[df['Do_Not_Contact'] != 'Y']
df = df[df['Phone_Number'] != '']
df = df.dropna(subset=['Phone_Number']).reset_index(drop=True)

# ۹. جایگزینی نهایی مقادیر NaN متنی با رشته خالی برای ارائه نهایی
df = df.fillna('')

# ۱۰. ذخیره خروجی پاکیزه نهایی
df.to_csv('Cleaned_Customer_Call_List.csv', index=False)
print("Data Cleaning Complete. Total clean records remaining:", len(df))
```

---

## فصل ۶: تحلیل اکتشافی داده‌ها (EDA) و مصورسازی با Matplotlib و Seaborn

تحلیل اکتشافی داده‌ها یا **EDA (Exploratory Data Analysis)** نخستین فرآیند نگاه عمیق به داده، تشخیص الگوها، ارزیابی توزیع‌ها و کشف داده‌های پرت (Outliers) است.

```python
import matplotlib.pyplot as plt
import seaborn as sns

# تنظیم ظاهر و استایل نمودارهای Seaborn
sns.set_theme(style='darkgrid')
plt.rcParams['figure.figsize'] = (10, 6)
```

---

### ۱. تحلیل سری زمانی و تغییرات جمعیت (Time Series / Line Plot)

```python
# محاسبه مجموع جمعیت جهان در دهه‌های مختلف
decades = ['1970 Population', '1980 Population', '1990 Population', 
           '2000 Population', '2010 Population', '2020 Population', '2022 Population']

total_pop_trend = df[decades].sum()

plt.figure(figsize=(10, 5))
plt.plot(decades, total_pop_trend, marker='o', color='#1f77b4', linewidth=2.5)
plt.title('Global Population Growth (1970 - 2022)', fontsize=14, fontweight='bold')
plt.xlabel('Census Year', fontsize=12)
plt.ylabel('Total Population (Billions)', fontsize=12)
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

---

### ۲. بررسی همبستگی داده‌ها با نقشه حرارتی (Correlation Heatmap)

برای پی بردن به شدت وابستگی خطی میان متغیرهای عددی:

```python
# استخراج ماتریس همبستگی
numeric_df = df.select_dtypes(include=['number'])
correlation_matrix = numeric_df.corr()

plt.figure(figsize=(12, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='Blues', fmt='.2f', linewidths=0.5)
plt.title('Correlation Heatmap Among Numeric Features', fontsize=14, fontweight='bold')
plt.show()
```

---

### ۳. بررسی توزیع و داده‌های پرت با نمودار جعبه‌ای (Boxplot)

```python
plt.figure(figsize=(12, 6))
sns.boxplot(x='Continent', y='2022 Population', data=df, palette='Set2')
plt.yscale('log')  # استفاده از مقیاس لگاریتمی به دلیل اختلاف شدید جمعیت‌ها
plt.title('Log-Scaled 2022 Population Distribution by Continent (Detecting Outliers)', fontsize=13)
plt.show()
```

---

## فصل ۷: استخراج داده از وب با وب‌اسکرپینگ (Web Scraping)

وقتی داده‌های مورد نیاز شما در هیچ پایگاه داده یا فایل CSV آماده‌ای وجود ندارد، **وب‌اسکرپینگ (Web Scraping)** به شما قدرت تولید مجموعه‌داده شخصی از سطح وب را می‌دهد.

```python
import requests
from bs4 import BeautifulSoup
import pandas as pd
```

---

### ۱. معماری و آناتومی وب‌اسکرپینگ

* **کتابخانه `requests`:** ارسال درخواست HTTP GET به وب‌سرور و دریافت سورس خام HTML.
* **کتابخانه `BeautifulSoup`:** پارس کردن درخت ساختار صفحات وب (DOM Tree) و امکان جستجو در تگ‌ها (`<table>`, `<tr>`, `<th>`, `<td>`, `<div>`).
* **توابع کلیدی:**
  * `soup.find()`: بازگرداندن اولین عنصری که با تگ یا کلاس مشخص‌شده تطابق دارد.
  * `soup.find_all()`: بازگرداندن لیستی از تمام عناصر منطبق بر شرط در کل صفحه.
  * `.text.strip()`: استخراج متن خالص درون تگ و حذف فاصله‌های هرز اطراف آن.

---

### ۲. پروژه عملی وب‌اسکرپینگ: استخراج جدول بزرگ‌ترین شرکت‌های آمریکا بر اساس درآمد از ویکی‌پدیا

در این سناریو، صفحه ویکی‌پدیا شامل رتبه‌بندی ۵۰۰ شرکت برتر آمریکا از نظر درآمد را اسکرپ کرده، داده‌ها را در یک DataFrame سازمان‌دهی نموده و نهایتاً به CSV تبدیل می‌کنیم:

```python
import requests
from bs4 import BeautifulSoup
import pandas as pd

# ۱. ارسال درخواست به صفحه ویکی‌پدیا
url = 'https://en.wikipedia.org/wiki/List_of_largest_companies_in_the_United_States_by_revenue'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

# ۲. پیدا کردن جدول مورد نظر
# جدول دارای کلاس wikitable sortable است
target_table = soup.find_all('table', class_='wikitable')[0]

# ۳. استخراج عناوین ستون‌ها (Table Headers)
header_tags = target_table.find_all('th')
table_titles = [th.text.strip() for th in header_tags]
print("Columns Found:", table_titles)

# ساخت دیتابیس خالی با عناوین ستون‌ها
df_companies = pd.DataFrame(columns=table_titles)

# ۴. استخراج سطرهای داده (Table Rows)
rows = target_table.find_all('tr')

# حلقه روی سطرها (از سطر اول عبور می‌کنیم زیرا شامل عناوین است)
for row in rows[1:]:
    row_data = row.find_all('td')
    individual_row_data = [data.text.strip() for data in row_data]
    
    # اضافه کردن سطر به دیتافریم
    if individual_row_data:
        length = len(df_companies)
        df_companies.loc[length] = individual_row_data

# ۵. ذخیره اطلاعات در قالب فایل CSV
df_companies.to_csv('Largest_US_Companies_Revenue.csv', index=False)
print("Scraping Completed. Total records saved:", len(df_companies))
df_companies.head()
```

---

### ۳. مینی‌پروژه رهگیری و پایش قیمت در آمازون (Amazon Price Tracker)

```python
from bs4 import BeautifulSoup
import requests
import datetime

def check_amazon_price(product_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Encoding": "gzip, deflate", 
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", 
        "DNT": "1"
    }

    page = requests.get(product_url, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")

    # پیدا کردن عنوان و قیمت محصول
    title = soup.find(id='productTitle').get_text().strip()
    price = soup.find(class_='a-offscreen').get_text().strip().replace('$', '')
    
    today = datetime.date.today()
    print(f"[{today}] {title[:35]}... | Price: ${price}")
    
    return [title, price, today]
```

---

## فصل ۸: اتوماسیون پایپ‌لاین و استخراج داده با APIها

یکی از پیشرفته‌ترین مباحث برای ارتقای رزومه به سطح Mid-Level، ایجاد **پایپ‌لاین‌های خودکار استخراج داده (Automated Data Ingestion Pipelines)** از طریق وب‌سرویس‌ها (APIs) است.

```
       +----------------------------+
       |   Crypto API Endpoint      |
       +----------------------------+
                     │
                     │  HTTP GET Request (requests.get)
                     ▼
       +----------------------------+
       |   تابع اجراگر (API Runner)  |
       |  - پالایش پاسخ JSON        |
       |  - تبدیل به DataFrame       |
       |  - درج برچسب زمان (Timestamp)|
       +----------------------------+
                     │
      ┌──────────────┴──────────────┐
      ▼                             ▼
[ذخیره در حافظه فعال]        [افزودن مداوم به دیسک]
df_master.append()           df.to_csv(mode='a', append)
```

---

### پیاده‌سازی پایپ‌لاین اتوماتیک پایش ارزهای دیجیتال (Crypto API Pipeline):

```python
from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json
import pandas as pd
import datetime
import time
import os

def api_runner(target_csv_path='Crypto_Automated_Data.csv'):
    # آدرس وب‌سرویس نمونه (مانند CoinMarketCap Sandbox یا Endpoint اصلی)
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
    parameters = {
        'start': '1',
        'limit': '15',
        'convert': 'USD'
    }
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': 'YOUR_API_KEY_HERE',  # کلید دسترسی شخصی شما
    }

    session = Session()
    session.headers.update(headers)

    try:
        response = session.get(url, params=parameters)
        data = json.loads(response.text)
        
        # تبدیل داده‌های JSON به دیتافریم پانداس
        df_latest = pd.json_normalize(data['data'])
        
        # ثبت زمان دقیق فراخوانی داده
        df_latest['timestamp'] = datetime.datetime.now()
        
        # بررسی وجود فایل جهت تعیین نوشتن هدر (Header)
        if not os.path.isfile(target_csv_path):
            df_latest.to_csv(target_csv_path, index=False)
            print("File created and initial batch recorded.")
        else:
            # حالت 'a' به معنای Append بدون پاک شدن داده‌های قبلی است
            df_latest.to_csv(target_csv_path, mode='a', header=False, index=False)
            print("New batch appended successfully.")
            
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print("API Connection Error:", e)

# اجرای حلقه اتوماسیون (اجرای تابع هر ۶۰ ثانیه به مدت ۵ بار)
def automate_pipeline(iterations=5, delay_seconds=60):
    for i in range(iterations):
        print(f"\n--- Running Pipeline Batch {i + 1} of {iterations} ---")
        api_runner()
        if i < iterations - 1:
            time.sleep(delay_seconds)
            
# automate_pipeline()
```

---

### مصورسازی نوسانات قیمت حاصل از پایپ‌لاین (Seaborn Time Series Plot):

```python
# خواندن داده‌های ذخیره‌شده از پایپ‌لاین خودکار
df_crypto = pd.read_csv('Crypto_Automated_Data.csv')

# فیلتر برای رمزارز بیت‌کوین
btc_data = df_crypto[df_crypto['name'] == 'Bitcoin']

# تنظیم و نمایش روند تغییر قیمت در طول زمان
plt.figure(figsize=(10, 5))
sns.lineplot(data=btc_data, x='timestamp', y='quote.USD.price', marker='o', color='orange')
plt.title('Real-Time Bitcoin Price Tracking Over Automated Intervals', fontsize=13)
plt.xlabel('Timestamp')
plt.ylabel('USD Price')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

---

## فصل ۹: چک‌لیست پورتفولیو، مستندسازی رزومه و آمادگی مصاحبه پایتون

### ۱. نحوه مستندسازی پروژه‌های پایتون در رزومه

هنگام توصیف پروژه‌های خود، به جای جملات ساده مانند «من با پایتون کد زدم»، از فرمول استاندارد دستاورد-محور استفاده کنید:

> * **نمونه متن حرفه‌ای رزومه (EDA & Cleaning):**  
>   «پاک‌سازی و تحلیل اکتشافی (EDA) مجموعه‌داده مشتریان در پایتون با بهره‌گیری از کتابخانه‌های Pandas و Seaborn؛ تدوین الگوهای Regex برای اصلاح ساختار شماره تماس‌ها و تفکیک آدرس‌ها؛ استخراج همبستگی‌های آماری و نمایش بصری توزیع داده‌ها به کمک Boxplot و Heatmap.»
>
> * **نمونه متن حرفه‌ای رزومه (Web Scraping & API Automation):**  
>   «طراحی پایپ‌لاین خودکار استخراج و مهندسی داده با پایتون؛ دریافت خودکار اطلاعات بازار از وب‌سرویس CoinMarketCap با ساختار `requests` و ثبت مداوم در قالب فایل‌های سری زمانی CSV؛ پیاده‌سازی اسکریپت وب‌اسکرپینگ ۵۰۰ شرکت برتر آمریکا با BeautifulSoup و تبدیل داده‌های خام HTML به DataFrames ساختاریافته.»

---

### ۲. پرتکرارترین سوالات تکنیکال مصاحبه شغلی پایتون برای تحلیلگران داده

1. **تفاوت بین یک لیست (List) و تاپل (Tuple) چیست؟**
   * *پاسخ:* لیست‌ها تغییرپذیر (Mutable) هستند، در حالی که تاپل‌ها پس از تعریف غیرقابل ویرایش (Immutable) هستند. تاپل‌ها سریع‌ترند و حافظه کمتری اشغال می‌کنند و برای داده‌های ثابتی مثل مختصات جغرافیایی به کار می‌روند.

2. **تفاوت `.loc` و `.iloc` در پانداس چیست؟**
   * *پاسخ:* متد `.loc` داده‌ها را بر اساس برچسب یا نام سطرها و ستون‌ها فراخوانی می‌کند، اما متد `.iloc` کاملاً بر مبنای اندیس عددی و موقعیت مکانی سطرها و ستون‌ها کار می‌کند.

3. **چرا برای اتوماسیون داده فایل‌ها را با حالت `mode='a'` باز می‌کنیم؟**
   * *پاسخ:* حالت `mode='a'` (Append) داده‌های جدید را به انتهای فایل موجود اضافه می‌کند بدون اینکه رکوردهای پیشین را پاک یا رونویسی (Overwrite) کند.

4. **تفاوت تگ‌های `<th>`، `<tr>` و `<td>` در ساختار جداول HTML چیست؟**
   * *پاسخ:* تگ `<tr>` تعریف‌کننده یک سطر (Table Row)، تگ `<th>` نشان‌دهنده سلول عنوان ستون (Table Header)، و تگ `<td>` محتوا و سلول‌های داده استاندارد (Table Data) را تشکیل می‌دهند.