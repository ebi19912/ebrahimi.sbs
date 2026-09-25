# پایگاه داده MySQL و زبان SQL (هندبوک و تمرینات صنعتی)

این فایل حاوی ۱۹ گام آموزشی SQL همراه با تمرینات واقعی در صنعت (Industry Cases) است.

---

## گام ۱: مقدمه و نقشه راه جامع (Data Analytics Roadmap)

این نقشه راه، مسیر گام‌به‌گام یادگیری تا ورود به بازار کار تحلیل داده را تبیین می‌کند:

### تسلط بر ۵ مهارت فنی پایه
- **پایگاه داده (SQL):** هسته اصلی و مهم‌ترین مهارت یک تحلیل‌گر برای مدیریت، پالایش و استخراج داده‌ها از جداول پایگاه داده به شمار می‌رود.
- **ابزارهای هوش تجاری (BI):** نرم‌افزارهای تجسم داده نظیر Tableau و Power BI جهت تبدیل داده‌های خام به داشبوردهای مدیریتی کاربرد دارند.
- **نرم‌افزار Microsoft Excel:** کاربری پیشرفته اکسل برای پاکسازی مقدماتی، مرتب‌سازی و تحلیل‌های اولیه سریع داده‌ها مورد نیاز است.
- **زبان برنامه‌نویسی Python:** جهت تحلیل‌های داده‌ای پیشرفته، محاسبات پیچیده و اتوماسیون فرآیندها استفاده می‌شود.
- **سرویس‌های ابری (Cloud Platforms):** کسب شناخت عملیاتی از پلتفرم‌های ارائه‌دهنده سرویس‌های ابری مانند AWS، GCP یا Microsoft Azure.

> **نکته طلایی:** تمرکز بر روی ساخت پورتفولیو واقعی و ارتباط موثر در لینکدین بسیار مهم‌تر از ارسال رزومه کورکورانه است.

---

## گام ۲: راه‌اندازی سرور، پیش‌نیازها و محیط MySQL Workbench

پیش از اجرای کوئری‌ها، پیکربندی صحیح سرور و محیط توسعه پایگاه داده ضروری است.

- **نوع نصب (Setup Type):** گزینه Developer Default نیازهای اکثر کاربران را تأمین می‌کند.
- **راه‌اندازی ساختار دیتابیس:** به جای وارد کردن دستی ساختارها، فایل اسکریپت SQL پروژه را در Workbench باز کرده و با دکمه آذرخش اجرا کنید تا جداول و داده‌ها ساخته شوند.

---

## گام ۳: مبانی استخراج داده با دستور SELECT و محاسبات پایه

دستور `SELECT` سنگ‌بنای اصلی استخراج اطلاعات از پایگاه داده به شمار می‌رود.

```sql
-- استخراج تمام ستون‌ها
SELECT * 
FROM parks_and_recreation.employee_demographics;

-- انتخاب ستون‌های خاص و محاسبات
SELECT 
  first_name, 
  last_name, 
  age, 
  (age + 10) * 10 AS calculated_age 
FROM parks_and_recreation.employee_demographics;

-- نمایش مقادیر یکتا
SELECT DISTINCT gender 
FROM parks_and_recreation.employee_demographics;
```

### 💼 چالش صنعتی: استخراج حاشیه سود محصولات (خرده‌فروشی)
**سناریو:** شما تحلیل‌گر داده یک فروشگاه اینترنتی هستید. مدیریت می‌خواهد سود خالص هر محصول را ببیند.
**وظیفه:** کوئری بنویسید که نام محصول، قیمت فروش، قیمت خرید و سود خالص (تفاضل قیمت فروش و خرید) را از جدول محصولات استخراج کند.

<details>
<summary><b>مشاهده پاسخ</b></summary>

```sql
SELECT 
  product_name, 
  sale_price, 
  cost_price, 
  (sale_price - cost_price) AS profit 
FROM store_db.products;
```
*توضیح:* در اینجا با قرار دادن پرانتز تفاضل را محاسبه کردیم. از AS برای نام‌گذاری خروجی استفاده می‌شود.
</details>

---

## گام ۴: فیلتر کردن ردیف‌ها با عبارت شرطی WHERE

```sql
-- فیلتر ترکیبی تاریخ و رشته
SELECT * 
FROM employee_demographics 
WHERE birth_date > '1985-01-01' 
  AND gender != 'Female';

-- جستجو با الگو (LIKE)
SELECT * 
FROM employee_demographics 
WHERE first_name LIKE 'a__%';
```

### 💼 چالش صنعتی: شناسایی مشتریان غیرفعال پرخطر (بانکداری)
**سناریو:** بانک می‌خواهد مشتریانی که از سال ۲۰۲۰ تراکنشی نداشته‌اند اما موجودی آن‌ها بالای ۵۰۰۰۰ است را شناسایی کند تا با آن‌ها تماس بگیرد.
**وظیفه:** مشتریانی با تاریخ آخرین تراکنش کوچکتر از '2020-01-01' و بالانس بیش از ۵۰۰۰۰ استخراج شوند.

<details>
<summary><b>مشاهده پاسخ</b></summary>

```sql
SELECT customer_id, full_name, balance, last_transaction_date 
FROM bank_db.customers 
WHERE last_transaction_date < '2020-01-01' 
  AND balance > 50000;
```
</details>

---

## گام ۵: گروه‌بندی داده‌ها (GROUP BY) و مرتب‌سازی (ORDER BY)

```sql
SELECT 
  gender, 
  AVG(age) AS avg_age, 
  COUNT(age) AS total_count 
FROM employee_demographics 
GROUP BY gender;

SELECT * 
FROM employee_demographics 
ORDER BY gender ASC, age DESC;
```

### 💼 چالش صنعتی: عملکرد فروش نمایندگی‌ها (صنعت خودرو)
**وظیفه:** کوئری بنویسید که branch_id و مجموع sale_amount را نشان داده و بر اساس فروش نزولی مرتب کند.

<details>
<summary><b>مشاهده پاسخ</b></summary>

```sql
SELECT 
  branch_id, 
  SUM(sale_amount) AS total_sales 
FROM auto_dealership.sales 
GROUP BY branch_id 
ORDER BY total_sales DESC;
```
</details>

---

## گام ۶: تمایز ساختاری میان عبارات WHERE و HAVING

```sql
SELECT 
  occupation, 
  AVG(salary) AS avg_salary 
FROM employee_salary 
WHERE occupation LIKE '%manager%' -- فیلتر سطری قبل از گروه‌بندی
GROUP BY occupation 
HAVING AVG(salary) > 75000;       -- فیلتر تجمعی بعد از گروه‌بندی
```

### 💼 چالش صنعتی: شناسایی مشتریان پرمصرف اینترنت (مخابرات)
**وظیفه:** کاربران شهر 'Tehran' را فیلتر کنید، حجم مصرفی آن‌ها را SUM کنید، و افرادی که مجموع مصرفشان > 500 است را جدا کنید.

<details>
<summary><b>مشاهده پاسخ</b></summary>

```sql
SELECT 
  customer_id, 
  SUM(data_usage) AS total_usage 
FROM telco.internet_sessions 
WHERE city = 'Tehran' 
GROUP BY customer_id 
HAVING SUM(data_usage) > 500;
```
</details>

---

## گام ۷: کنترل ردیف‌های خروجی (LIMIT) و نام مستعار (Aliasing)

```sql
-- پیدا کردن ۳ نفر از مسن‌ترین کارمندان
SELECT first_name, last_name, age 
FROM employee_demographics 
ORDER BY age DESC 
LIMIT 3;
```

### 💼 چالش صنعتی: ۵ ویدئوی پربازدید یوتیوب (رسانه)
**وظیفه:** بر اساس بازدید مرتب کرده و ۵ ویدیوی اول سال ۲۰۲۴ را محدود کنید.

<details>
<summary><b>مشاهده پاسخ</b></summary>

```sql
SELECT 
  video_id, 
  title, 
  views AS total_views 
FROM youtube_channel.videos 
WHERE upload_year = 2024 
ORDER BY views DESC 
LIMIT 5;
```
</details>

---

## گام ۸: پیوند و اتصال جداول (Joins)

```sql
-- Inner Join
SELECT dem.first_name, sal.salary 
FROM employee_demographics AS dem 
INNER JOIN employee_salary AS sal 
  ON dem.employee_id = sal.employee_id;

-- Left Join
SELECT dem.first_name, sal.salary 
FROM employee_demographics AS dem 
LEFT JOIN employee_salary AS sal 
  ON dem.employee_id = sal.employee_id;
```

### 💼 چالش صنعتی: مشتریانی که خرید نکرده‌اند (E-commerce)
**وظیفه:** با LEFT JOIN بررسی کنید کدام کاربران در جدول سفارشات وجود ندارند.

<details>
<summary><b>مشاهده پاسخ</b></summary>

```sql
SELECT 
  u.user_id, 
  u.email 
FROM website.users u 
LEFT JOIN website.orders o 
  ON u.user_id = o.user_id 
WHERE o.order_id IS NULL;
```
</details>

---

## گام ۹: ترکیب عمودی نتایج با UNION و UNION ALL

```sql
SELECT first_name, last_name, 'Old Lady' AS Label 
FROM employee_demographics 
WHERE age > 40 AND gender = 'Female' 
UNION 
SELECT first_name, last_name, 'Old Man' AS Label 
FROM employee_demographics 
WHERE age > 40 AND gender = 'Male' 
ORDER BY first_name, last_name;
```

---

## گام ۱۰: توابع کار با داده‌های متنی (String Functions)

```sql
SELECT 
  first_name, 
  UPPER(first_name) AS upper_name, 
  SUBSTRING(birth_date, 6, 2) AS birth_month, 
  REPLACE(first_name, 'a', 'z') AS modified_name, 
  CONCAT(first_name, ' ', last_name) AS full_name 
FROM employee_demographics;
```

### 💼 چالش صنعتی: پاکسازی شماره تلفن‌های کاربران
**وظیفه:** با کمک توابع متنی خط تیره‌ها (-) را از شماره تلفن‌ها حذف کنید.

<details>
<summary><b>مشاهده پاسخ</b></summary>

```sql
SELECT 
  user_id, 
  REPLACE(phone_number, '-', '') AS clean_phone 
FROM crm.customer_contact;
```
</details>

---

## گام ۱۱: منطق‌های شرطی با دستور CASE

```sql
SELECT first_name, age, 
  CASE 
    WHEN age < 30 THEN 'Young' 
    WHEN age BETWEEN 31 AND 50 THEN 'Middle-aged' 
    ELSE 'Senior' 
  END AS age_bracket 
FROM employee_demographics;
```

### 💼 چالش صنعتی: تعیین سطح وفاداری مشتری (هواپیمایی)
**وظیفه:** با flight_count مشخص کنید: بالای ۵۰ = VIP، بالای ۲۰ = Gold، کمتر = Standard.

<details>
<summary><b>مشاهده پاسخ</b></summary>

```sql
SELECT 
  passenger_id, 
  flight_count, 
  CASE 
    WHEN flight_count > 50 THEN 'VIP' 
    WHEN flight_count >= 20 THEN 'Gold' 
    ELSE 'Standard' 
  END AS loyalty_tier 
FROM airline.passengers;
```
</details>

---

## گام ۱۲: زیرپرس‌وجوها (Subqueries)

```sql
SELECT * 
FROM employee_demographics 
WHERE employee_id IN (
  SELECT employee_id 
  FROM employee_salary 
  WHERE dept_id = 1
);
```

---

## گام ۱۳: توابع پنجره‌ای (Window Functions)

```sql
SELECT dem.gender, sal.salary, 
  SUM(sal.salary) OVER(PARTITION BY dem.gender ORDER BY dem.employee_id) AS rolling_total 
FROM employee_demographics dem 
JOIN employee_salary sal ON dem.employee_id = sal.employee_id;
```

### 💼 چالش صنعتی: رتبه‌بندی محصولات هر دسته‌بندی
**وظیفه:** با DENSE_RANK محصولات را درون هر دسته (PARTITION BY) بر اساس قیمت نزولی رتبه‌بندی کنید.

<details>
<summary><b>مشاهده پاسخ</b></summary>

```sql
SELECT 
  product_name, 
  category_id, 
  price, 
  DENSE_RANK() OVER(PARTITION BY category_id ORDER BY price DESC) AS price_rank 
FROM store.products;
```
</details>

---

## گام ۱۴: عبارات جدول مشترک (CTEs)

```sql
WITH CTE_Example AS (
  SELECT gender, AVG(salary) AS avg_sal 
  FROM employee_demographics dem 
  JOIN employee_salary sal ON dem.employee_id = sal.employee_id 
  GROUP BY gender
)
SELECT * FROM CTE_Example;
```

---

## گام ۱۵: جداول موقت (Temporary Tables)

```sql
CREATE TEMPORARY TABLE salary_over_50k 
SELECT * FROM employee_salary 
WHERE salary >= 50000;

SELECT * FROM salary_over_50k;
```

---

## گام ۱۶: روال‌های ذخیره‌شده (Stored Procedures)

```sql
DELIMITER $$ 
CREATE PROCEDURE get_employee_salary(IN p_employee_id INT) 
BEGIN 
  SELECT employee_id, salary 
  FROM employee_salary 
  WHERE employee_id = p_employee_id; 
END $$ 
DELIMITER ; 

CALL get_employee_salary(1);
```

---

## گام ۱۷: خودکارسازی با تریگرها (Triggers) و رویدادها (Events)

```sql
DELIMITER $$ 
CREATE EVENT evt_retire_elderly_employees 
ON SCHEDULE EVERY 30 DAY 
DO 
BEGIN 
  DELETE FROM employee_demographics WHERE age >= 60; 
END $$ 
DELIMITER ;
```

---

## گام ۱۸: پروژه صنعتی (Data Cleaning End-to-End)

```sql
-- شناسایی رکوردهای تکراری با ROW_NUMBER
WITH duplicate_cte AS (
  SELECT *, 
    ROW_NUMBER() OVER(
      PARTITION BY company, location, industry, total_laid_off, date
    ) AS row_num 
  FROM layoffs_staging
)
SELECT * FROM duplicate_cte WHERE row_num > 1;
```

---

## گام ۱۹: پروژه صنعتی (Exploratory Data Analysis)

```sql
-- مجموع تجمعی اخراجی‌ها در هر ماه (Rolling Total)
WITH Rolling_Total AS (
  SELECT SUBSTRING(date,1,7) AS `month`, SUM(total_laid_off) AS total_off 
  FROM layoffs_staging 
  WHERE SUBSTRING(date,1,7) IS NOT NULL 
  GROUP BY `month`
)
SELECT `month`, total_off, 
  SUM(total_off) OVER(ORDER BY `month`) AS rolling_total 
FROM Rolling_Total;
```
