# جزوه جامع آموزش کتابخانه پانداس برای تحلیلگران داده (Pandas for Data Analytics Handbook)

**مرجع کاربردی مهندسی، پالایش، دگرگون‌سازی، تجمیع و تحلیل اکتشافی داده‌ها در بوت‌کمپ جامع تحلیل داده ۲۰۲۶**

## مقدمه: جایگاه پانداس در فرآیند تحلیل داده

کتابخانه پانداس (**Pandas** - برگرفته از Panel Data) ستون فقرات کار با داده‌های ساختاریافته در زبان برنامه‌نویسی پایتون است. در حالی که اکسل با محدودیت ۱ میلیون سطری مواجه است و SQL عمدتاً در لایه واکشی پایگاه داده کاربرد دارد، پانداس بستری قدرتمند، فوق‌العاده سریع و منعطف برای انجام محاسبات پیچیده، پاک‌سازی عمیق، اتصال چندین مجموعه‌داده ناهمگون و آماده‌سازی داده‌ها برای تحلیل اکتشافی (EDA) و یادگیری ماشین فراهم می‌سازد.

```
+-----------------------------------------------------------------------------------+
|                        جایگاه پانداس در چرخه حیات داده                            |
+-----------------------------------------------------------------------------------+
|  [منابع داده]        ==>  [Pandas DataFrames]    ==>  [خروجی و مصورسازی]           |
|  CSV, Excel, JSON,        - تمیزکاری و بازسازی         - گزارش‌های تحلیلی           |
|  SQL, Web Scraper         - تجمیع و فیلتراسیون         - مصورسازی Seaborn / BI      |
|                           - مهندسی ویژگی‌ها            - ذخیره در انبار داده         |
+-----------------------------------------------------------------------------------+

```

## فصل ۱: ساختارهای اصلی داده و تنظیمات محیطی

برای شروع کار با پانداس، ابتدا باید کتابخانه را به همراه نام مستعار استاندارد آن (`pd`) وارد محیط کدنویسی کنیم:

```python
import pandas as pd
import numpy as np
```

### ۱. ساختارهای اصلی: Series در برابر DataFrame

* **Series (سری):** یک آرایه تک‌بعدی با برچسب ایندکس که می‌تواند هر نوع داده‌ای (عدد، متن، بولی) را در خود نگه دارد. هر ستون از یک جدول، در واقع یک Series است.
* **DataFrame (دیتافریم):** ساختار دو‌بعدی شبیه به یک جدول اکسل یا جدول دیتابیس SQL است که از سطرها و ستون‌ها تشکیل شده است.

```python
# ساخت سری ساده
flavor_series = pd.Series(["Vanilla", "Chocolate", "Strawberry"], name="Flavors")

# ساخت دیتافریم از یک دیکشنری
data = {
    "Name": ["Alex", "Bob", "Charlie"],
    "Role": ["Data Analyst", "Data Engineer", "Data Scientist"],
    "Salary": [65000, 80000, 95000]
}
df_team = pd.DataFrame(data)
```

### ۲. تنظیمات حیاتی نمایش در پانداس (`pd.set_option`)

به طور پیش‌فرض، زمانی که دیتافریم دارای تعداد زیادی سطر یا ستون باشد، پانداس مقادیر میانی را به صورت سه نقطه (`...`) پنهان می‌کند. برای مدیریت نمایش کامل:

```python
# تغییر حداکثر سطرهای قابل نمایش
pd.set_option('display.max_rows', 250)

# تغییر حداکثر ستون‌های قابل نمایش
pd.set_option('display.max_columns', 50)

# اصلاح فرمت نمایش اعداد اعشاری (جلوگیری از نمایش نماد علمی Scientific Notation):
pd.set_option('display.float_format', lambda x: '%.2f' % x)
```

## فصل ۲: ورود و خروج داده‌ها (Data Ingestion & Exporting)

پانداس برای انواع فرمت‌های فایلی، متدهای اختصاصی پرسرعت ارائه داده است:

```python
# ۱. خواندن فایل CSV
df_csv = pd.read_csv('world_population.csv')

# ۲. خواندن فایل با تعیین ستون ایندکس در بدو ورود
df_indexed = pd.read_csv('world_population.csv', index_col='Country')

# ۳. خواندن فایل‌های متنی جداشده با تب یا کاراکترهای دیگر (TSV / Text)
df_tsv = pd.read_table('customers.txt', sep='\t')

# ۴. خواندن فایل‌های اکسل و انتخاب شیت مشخص
df_excel = pd.read_excel('sales_data.xlsx', sheet_name='Q4_Report')

# ۵. خواندن فایل‌های با ساختار نیمه‌ساختاریافته JSON
df_json = pd.read_json('sample_data.json')

# ۶. ذخیره کردن دیتافریم در قالب فایل CSV (بدون ذخیره ایندکس اضافی عددی)
df_csv.to_csv('cleaned_data_output.csv', index=False)
```

## فصل ۳: کاوش و ارزیابی اولیه داده‌ها (Data Inspection)

پیش از انجام هرگونه تغییر یا تحلیل، باید شناختی همه‌جانبه از ساختار داده به دست آورد:

```python
# مشاهده ۵ سطر نخست و انتهایی
df.head(10)
df.tail(5)

# بررسی ابعاد ماتریس داده (تعداد سطر، تعداد ستون)
print(df.shape)  # مثال: (234, 17)

# خلاصه وضعیت ستون‌ها، تعداد مقادیر غیر تهی (Non-Null) و نوع داده‌ها
df.info()

# خلاصه آماری ستون‌های عددی (تعداد، میانگین، انحراف معیار، حداقل، چارک‌ها و حداکثر)
df.describe()

# بررسی مستقیم نام تمامی ستون‌ها
print(df.columns)

# شمارش مقادیر گمشده در هر ستون
df.isnull().sum()

# شمارش تعداد مقادیر منحصربه‌فرد در هر ستون
df.nunique()
```

### فیلتر ستون‌ها بر مبنای نوع داده با `select_dtypes`:

```python
# انتخاب تنها ستون‌های عددی (int و float)
numeric_df = df.select_dtypes(include=['number'])

# انتخاب ستون‌های متنی و دسته‌ای
categorical_df = df.select_dtypes(include=['object'])
```

## فصل ۴: شاخص‌گذاری، فیلترسازی و مرتب‌سازی داده‌ها (Indexing, Slicing & Sorting)

### ۱. مقایسه بنیادین `.loc[]` در برابر `.iloc[]`

* **`.loc[]` (برچسب‌محور - Label-based):** بر اساس برچسب یا نام متنی سطرها و ستون‌ها کار می‌کند.
* **`.iloc[]` (اندیس‌محور - Integer position-based):** کاملاً بر مبنای موقعیت و شماره اندیس عددی (از مبنای صفر) سطرها و ستون‌ها داده‌ها را برش می‌زند.

```python
# دسترسی بر اساس نام سطر و ستون (Label):
# دریافت سطرهای با ایندکس 0 تا 2 و ستون‌های خاص
df.loc[0:2, ['Country', '2022 Population']]

# دسترسی بر اساس موقعیت عددی (Position):
# ۵ سطر اول و ۳ ستون اول
df.iloc[0:5, 0:3]
```

### ۲. تنظیم و بازنشانی ایندکس (`set_index` و `reset_index`)

```python
# تنظیم ستون Country به عنوان ایندکس دیتافریم
df.set_index('Country', inplace=True)

# بازیابی سطر بر اساس ایندکس متنی
df.loc['Albania']

# بازنشانی ایندکس به اعداد متوالی پیش‌فرض
df.reset_index(inplace=True)
```

### ۳. فیلتراسیون شرطی پیشرفته

```python
# ۱. فیلتر تک‌شرطی
high_pop = df[df['2022 Population'] > 50000000]

# ۲. فیلتر چندشرطی (عملگرهای بولی: & برای AND و | برای OR)
# حتماً هر شرط باید درون پرانتز قرار گیرد
asia_large = df[(df['Continent'] == 'Asia') & (df['2022 Population'] > 100000000)]

# ۳. استفاده از متد .isin() برای بررسی حضور در یک لیست
selected = df[df['Country'].isin(['Brazil', 'India', 'Japan'])]

# ۴. فیلتر متنی با تابع .str.contains() (معادل LIKE '%United%' در SQL)
united_states = df[df['Country'].str.contains('United', case=False, na=False)]
```

### ۴. مرتب‌سازی داده‌ها (Sorting)

```python
# مرتب‌سازی تک‌ستونه به صورت نزولی
df.sort_values(by='2022 Population', ascending=False)

# مرتب‌سازی چندستونه با جهت‌های متفاوت
# قاره صعودی، اما جمعیت درون هر قاره نزولی
df.sort_values(by=['Continent', '2022 Population'], ascending=[True, False])
```

## فصل ۵: گروه‌بندی و محاسبات تجمعی (GroupBy & Aggregations)

متد `.groupby()` در پانداس مستقیماً معادل عبارت `GROUP BY` در زبان SQL است و بر اساس الگوی **Split-Apply-Combine** کار می‌کند:

```
[مجموعه‌داده خام] ──> تفکیک بر اساس دسته‌ها (Split) ──> اجرای تابع تجمعی (Apply) ──> ترکیب نتایج (Combine)
```

### ۱. گروه‌بندی تک‌ستونه و چندستونه

```python
# محاسبه میانگین متغیرهای عددی به تفکیک قاره
continent_means = df.groupby('Continent').mean(numeric_only=True)

# شمارش تعداد کشورها در هر قاره
country_count = df.groupby('Continent')['Country'].count()

# گروه‌بندی چندسطحی (مثلاً قاره و وضعیت نرخ رشد)
multi_group = df.groupby(['Continent', 'Growth Rate']).mean(numeric_only=True)
```

### ۲. متد تجمیع سفارشی و هم‌زمان با `.agg()`

با این متد می‌توان به طور هم‌زمان روی ستون‌های متفاوت، محاسبات مختلفی را اجرا کرد:

```python
custom_summary = df.groupby('Continent').agg({
    '2022 Population': ['mean', 'max', 'min'],
    'Area (km²)': ['sum'],
    'Country': ['count']
})
```

## فصل ۶: ادغام، پیوند و چسباندن جداول (Merge, Join, Concat)

### ۱. متد ادغام `pd.merge()` (جوین‌های کلاسیک پایگاه داده)

`merge` پرکاربردترین تابع برای اتصال دو دیتافریم بر اساس یک یا چند ستون کلید مشترک است:

```python
# Inner Join: تنها رکوردهایی که کلید مشترک دارند باقی می‌مانند
merged_inner = pd.merge(df_customers, df_orders, on='customer_id', how='inner')

# Left Join: تمام مشتریان حفظ می‌شوند، حتی اگر سفارشی نداشته باشند
merged_left = pd.merge(df_customers, df_orders, on='customer_id', how='left')

# Right Join: تمامی سفارشات حفظ می‌شوند
merged_right = pd.merge(df_customers, df_orders, on='customer_id', how='right')

# Outer Join (Full): اجتماع تمام رکوردها
merged_outer = pd.merge(df_customers, df_orders, on='customer_id', how='outer')

# Cross Join: ضرب دکارتی تمامی سطرهای دو جدول در یکدیگر
merged_cross = pd.merge(df_colors, df_sizes, how='cross')

# مدیریت ستون‌های هم‌نام با پسوندهای سفارشی (Suffixes)
merged_custom = pd.merge(
    df1, df2, 
    on='fellowship_id', 
    how='inner', 
    suffixes=('_first_dataset', '_second_dataset')
)
```

### ۲. اتصال داده‌ها با `.join()`

متد `.join()` اساساً برای ادغام بر پایه **ایندکس (Index)** جداول بهینه‌سازی شده است:

```python
# اتصال دو جدول که قبلاً ایندکس آن‌ها روی fellowship_id تنظیم شده است
joined_df = df1_indexed.join(df2_indexed, how='outer', lsuffix='_left', rsuffix='_right')
```

### ۳. چسباندن عمودی و افقی با `pd.concat()`

زمانی که قصد دارید داده‌های چندین فایل با ساختار مشابه را زیر هم یا کنار هم قرار دهید:

```python
# چسباندن عمودی (Stacking Rows - axis=0)
# قرار دادن سطرهای df2 در زیر df1
combined_rows = pd.concat([df_q1, df_q2], axis=0).reset_index(drop=True)

# چسباندن افقی (Adding Columns - axis=1)
# قرار دادن ستون‌ها در کنار یکدیگر بر مبنای ایندکس سطری
combined_cols = pd.concat([df_features, df_labels], axis=1)
```

> **نکته حیاتی برای سال ۲۰۲۶:** تابع قدیمی `df.append()` در پانداس کاملاً منسوخ (Deprecated) شده و حذف گردیده است. همیشه از `pd.concat([df1, df2])` برای اضافه کردن سطرها استفاده کنید.

## فصل ۷: مصورسازی داده‌ها در پانداس (Pandas Plotting)

پانداس بر روی کتابخانه قدرتمند **Matplotlib** ساخته شده و امکان ترسیم سریع نمودارها را مستقیماً از روی دیتافریم فراهم می‌کند:

```python
import matplotlib.pyplot as plt

# نمودار خطی (Line Plot)
df.plot(x='Date', y='Rating', kind='line', title='Rating Trends')
plt.show()

# نمودار میله‌ای (Bar Chart)
df.groupby('Base Flavor')['Flavor Rating'].mean().plot(kind='bar', color='skyblue')
plt.ylabel('Average Rating')
plt.show()

# هیستوگرام (Histogram - بررسی توزیع فراوانی)
df['2022 Population'].plot(kind='hist', bins=10, edgecolor='black')
plt.show()

# نمودار جعبه‌ای (Boxplot - شناسایی چارک‌ها و داده‌های پرت)
df.boxplot(column=['Flavor Rating', 'Texture Rating'])
plt.show()

# تفکیک ستون‌ها در نمودارهای جداگانه (Subplots)
df.plot(subplots=True, figsize=(10, 8))
plt.show()
```

## فصل ۸: پروژه عملی ۱: فرآیند جامع پاک‌سازی داده‌های تماس مشتریان (Customer Call List Cleaning)

این سناریو یکی از شاخص‌ترین آزمون‌های عملی برای سنجش تسلط تحلیلگران داده بر پاک‌سازی داده‌های واقعی و نامنظم است.

### صورت مسئله

ما یک فایل اکسل حاوی لیست تماس مشتریان دریافت کرده‌ایم. داده‌ها شامل مقادیر تکراری، ستون‌های نامعتبر، کاراکترهای هرز در اسامی، شماره تلفن‌های ناقص با فرمت‌های متفاوت و آدرس‌های تفکیک‌نشده است. هدف: آماده‌سازی داده‌های پاک و استاندارد برای تیم تماس.

```
[Customer_Call_List.xlsx]
   │
   ├── ۱. حذف ردیف‌های کاملاً تکراری (Duplicates)
   ├── ۲. حذف ستون‌های زائد سازمانی
   ├── ۳. پیراستن کاراکترهای هرز از نام خانوادگی (.strip)
   ├── ۴. استانداردسازی شماره‌های تماس با Regex به فرمت 123-456-7890
   ├── ۵. تفکیک آدرس ترکیبی به سه ستون: Street, State, Zip
   ├── ۶. استانداردسازی مقادیر متنی Yes/No به Y/N
   ├── ۷. جایگزینی مقادیر پوچ و فیلتر عدم تماس (Do Not Contact)
   │
   └── [Cleaned_Customer_Call_List.csv]
```

### اجرای مرحله‌به‌مرحله با کدنویسی پانداس:

```python
import pandas as pd

# ۱. بارگذاری فایل اکسل خام
df = pd.read_excel('Customer_Call_List.xlsx')

# ۲. حذف رکوردهای تکراری مطلق
df = df.drop_duplicates().reset_index(drop=True)

# ۳. حذف ستون‌های زائد که برای تیم تماس سودی ندارند
df = df.drop(columns=['Not_Useful_Column'], errors='ignore')

# ۴. پاک‌سازی کاراکترهای هرز از ستون Last_Name
# حذف علامت‌های خط فاصله، نقطه، اسلش و اعداد احتمالی در نام‌ها
df['Last_Name'] = df['Last_Name'].str.strip("123._/ ")

# ۵. استانداردسازی شماره‌های تماس (Phone Numbers)
# گام الف: حذف تمامی کاراکترهای غیرعددی با Regex
df['Phone_Number'] = df['Phone_Number'].astype(str)
df['Phone_Number'] = df['Phone_Number'].str.replace('[^0-9]', '', regex=True)

# گام ب: قالب‌بندی به فرمت استاندارد 123-456-7890 با استفاده از تابع لامبدا
df['Phone_Number'] = df['Phone_Number'].apply(
    lambda x: f"{x[0:3]}-{x[3:6]}-{x[6:10]}" if len(x) == 10 else ''
)

# ۶. تفکیک ستون ترکیبی Address به آدرس پستی، ایالت و کد پستی
# جداکننده کاما است و پارامتر expand=True آن را به ستون‌های مجزا تبدیل می‌کند
split_addr = df['Address'].str.split(',', n=2, expand=True)
df['Street_Address'] = split_addr[0].str.strip()
df['State'] = split_addr[1].str.strip()
df['Zip_Code'] = split_addr[2].str.strip()

# حذف ستون اولیه آدرس پس از تفکیک موفق
df = df.drop(columns=['Address'])

# ۷. استانداردسازی مقادیر ستون‌های وضعیت به صورت Y و N
df['Paying Customer'] = df['Paying Customer'].str.replace('Yes', 'Y').str.replace('No', 'N')
df['Do_Not_Contact'] = df['Do_Not_Contact'].str.replace('Yes', 'Y').str.replace('No', 'N')

# ۸. پالایش رکوردهای نامعتبر و حفظ حریم خصوصی:
# الف) حذف ردیف‌هایی که در فیلد Do_Not_Contact مقدار Y دارند
# ب) حذف ردیف‌هایی که فاقد شماره تماس هستند
df = df[df['Do_Not_Contact'] != 'Y']
df = df[df['Phone_Number'] != '']
df = df.dropna(subset=['Phone_Number']).reset_index(drop=True)

# ۹. پر کردن مقادیر تهی باقیمانده با متن خالی جهت تحویل تمیز
df = df.fillna('')

# ۱۰. ذخیره فایل خروجی استاندارد
df.to_csv('Cleaned_Customer_Call_List.csv', index=False)
print(f"فرآیند پاک‌سازی با موفقیت پایان یافت. تعداد رکوردهای تمیز: {len(df)}")
```

## فصل ۹: پروژه عملی ۲: تحلیل اکتشافی داده‌ها (EDA on World Population)

تحلیل اکتشافی داده‌ها فرآیندی برای پرده‌برداری از رفتار متغیرها، ناهنجاری‌ها و کشف الگوهاست:

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# ۱. بارگذاری داده‌های جمعیت جهان
df_pop = pd.read_csv('world_population.csv')

# ۲. تحلیل توزیع مقادیر گمشده
missing_report = df_pop.isnull().sum()
print("گزارش مقادیر مفقود:\n", missing_report[missing_report > 0])

# ۳. محاسبه نرخ رشد و رتبه‌بندی ۱۰ کشور پرجمعیت در سال ۲۰۲۲
top10_pop = df_pop.sort_values(by='2022 Population', ascending=False).head(10)

plt.figure(figsize=(10, 5))
sns.barplot(data=top10_pop, x='2022 Population', y='Country', palette='viridis')
plt.title('Top 10 Most Populous Countries in 2022', fontweight='bold')
plt.xlabel('Population')
plt.show()

# ۴. بررسی همبستگی میان جمعیت در دهه‌های مختلف
numeric_data = df_pop.select_dtypes(include=['number'])
plt.figure(figsize=(10, 6))
sns.heatmap(numeric_data.corr(), annot=True, cmap='Blues', fmt='.2f')
plt.title('Correlation Matrix Across Population Decades')
plt.show()

# ۵. مقایسه میانگین جمعیت در قاره‌ها در طول زمان با تغییر شکل داده (Transpose & Melt)
population_cols = [
    '1970 Population', '1980 Population', '1990 Population',
    '2000 Population', '2010 Population', '2020 Population', '2022 Population'
]

continent_trends = df_pop.groupby('Continent')[population_cols].mean()
continent_trends_transposed = continent_trends.T

continent_trends_transposed.plot(figsize=(12, 6), marker='o')
plt.title('Historical Population Trends by Continent (1970 - 2022)')
plt.ylabel('Average Population')
plt.xlabel('Census Year')
plt.grid(True)
plt.show()
```

## فصل ۱۰: چک‌لیست پورتفولیو، مستندسازی رزومه و سوالات مصاحبه استخدامی

### ۱. نگارش استاندارد دستاوردهای پانداس در رزومه:

> * **نمونه متن حرفه‌ای رزومه کاری:**
>   «طراحی و اجرای پایپ‌لاین پیشرفته پاک‌سازی و استانداردسازی مجموعه‌داده‌های بازاریابی و فروش در کتابخانه Pandas؛ حذف رکوردهای تکراری و استخراج الگوهای شماره تماس با عبارات باقاعده (Regex)؛ تبدیل و تفکیک ستون‌های ساختاریافته آدرس با متدهای String Manipulation؛ اجرای فرآیند EDA و مصورسازی همبستگی متغیرها برای ۶ قاره جهان به کمک GroupBy و Seaborn Heatmaps.»

### ۲. پرتکرارترین سوالات تکنیکال مصاحبه شغلی پانداس:

1. **تفاوت میان `.loc` و `.iloc` در پانداس چیست؟**
   * *پاسخ:* متد `.loc` مبتنی بر نام برچسب (Label-based) سطرها و ستون‌ها کار می‌کند، در حالی که `.iloc` صرفاً بر اساس مکان عددی و شماره اندیس ستون‌ها و سطرها (Position-based) عمل می‌نماید.

2. **تفاوت میان `merge` و `concat` چیست و چه زمانی از هر کدام استفاده می‌کنیم؟**
   * *پاسخ:* `merge` برای اتصال رابطه‌ای جداول بر پایه یک یا چند ستون کلید مشترک (مشابه جوین‌های SQL) استفاده می‌شود، در حالی که `concat` برای چسباندن ساده و فیزیکی دیتافریم‌ها بر روی یکدیگر به صورت عمودی (`axis=0`) یا در کنار هم به صورت افقی (`axis=1`) کاربرد دارد.

3. **چرا استفاده از متد `.apply()` با توابع برداری در مقایسه با حلقه‌های `for` ترجیح داده می‌شود؟**
   * *پاسخ:* کتابخانه پانداس بر مبنای NumPy و در زبان C بهینه‌سازی شده است. استفاده از عملیات برداری (Vectorized Operations) یا متدهایی چون `apply` کدهای داخلی را بدون سربار سنگین تفسیری مفسر پایتون اجرا کرده و سرعت پردازش را تا صدها برابر در دیتاست‌های بزرگ افزایش می‌دهد.

4. **چگونه مقادیر Null را در پانداس بررسی و جایگزین می‌کنیم؟**
   * *پاسخ:* با دستور `df.isnull().sum()` حجم مقادیر گمشده ارزیابی شده و سپس با متد `df.fillna(value)` پر می‌گردند یا در صورت نامعتبر بودن رکورد، با متد `df.dropna(subset=['Col'])` حذف می‌شوند.