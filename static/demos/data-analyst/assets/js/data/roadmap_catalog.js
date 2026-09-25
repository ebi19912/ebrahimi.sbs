/**
 * Registers the remaining folders (02 through 13) in the curriculum bar
 * if their full step-by-step data file has not been loaded yet.
 */
window.BOOTCAMP_MODULES = window.BOOTCAMP_MODULES || [];

(function registerCatalogPlaceholders() {
    const existingIds = new Set(window.BOOTCAMP_MODULES.map(m => m.id));

    const catalog = [
        {
            id: "02-excel",
            number: "02",
            folderName: "02-Excel",
            shortTitle: "Excel",
            title: "تحلیل داده و داشبوردسازی در Microsoft Excel",
            icon: "sheet",
            filePath: "02-Excel/Excel_Handbook.md"
        },
        {
            id: "03-tableau",
            number: "03",
            folderName: "03-Tableau",
            shortTitle: "Tableau",
            title: "هوش تجاری و مصورسازی تعاملی با Tableau",
            icon: "bar-chart-3",
            filePath: "03-Tableau/Tableau_Handbook.md"
        },
        {
            id: "04-powerbi",
            number: "04",
            folderName: "04-Power BI",
            shortTitle: "Power BI",
            title: "مدل‌سازی داده، Power Query و DAX در Power BI",
            icon: "pie-chart",
            filePath: "04-Power BI/PowerBI_Handbook.md"
        },
        {
            id: "05-python",
            number: "05",
            folderName: "05-Python",
            shortTitle: "Python",
            title: "برنامه‌نویسی Python، وب‌اسکرپینگ و اتوماسیون داده",
            icon: "terminal",
            filePath: "05-Python/Python_Handbook.md"
        },
        {
            id: "06-pandas",
            number: "06",
            folderName: "06-Pandas",
            shortTitle: "Pandas",
            title: "پالایش، تجمیع و تحلیل اکتشافی با کتابخانه Pandas",
            icon: "table-2",
            filePath: "06-Pandas/Pandas_Handbook.md"
        },
        {
            id: "07-portfolio",
            number: "07",
            folderName: "07-Building a Portfolio Website",
            shortTitle: "Portfolio",
            title: "ساخت وب‌سایت پورتفولیو حرفه‌ای تحلیل داده",
            icon: "globe",
            filePath: "07-Building a Portfolio Website/Portfolio_Handbook.md"
        },
        {
            id: "08-resume",
            number: "08",
            folderName: "08-Building a Data Analyst Resume",
            shortTitle: "Resume",
            title: "نگارش رزومه استاندارد و ATS-Friendly تحلیل داده",
            icon: "file-text",
            filePath: "08-Building a Data Analyst Resume/Resume_Handbook.md"
        },
        {
            id: "09-interviews",
            number: "09",
            folderName: "09-Practicing for Data Analyst Interviews",
            shortTitle: "Interviews",
            title: "آمادگی برای مصاحبه‌های فنی و کدنویسی تحلیل داده",
            icon: "code-2",
            filePath: "09-Practicing for Data Analyst Interviews/Interview_Handbook.md"
        },
        {
            id: "10-azure",
            number: "10",
            folderName: "10-Azure",
            shortTitle: "Azure",
            title: "سرویس‌های ابری مایکروسافت آژور (Microsoft Azure)",
            icon: "cloud",
            filePath: "10-Azure/Azure_Handbook.md"
        },
        {
            id: "11-aws",
            number: "11",
            folderName: "11-AWS",
            shortTitle: "AWS",
            title: "تحلیل داده ابری در آمازون (AWS S3, Athena, Redshift)",
            icon: "server",
            filePath: "11-AWS/AWS_Handbook.md"
        },
        {
            id: "12-databricks",
            number: "12",
            folderName: "12-Databricks",
            shortTitle: "Databricks",
            title: "معماری لیک‌هاوس و کلان‌داده با Databricks و PySpark",
            icon: "layers",
            filePath: "12-Databricks/Databricks_Handbook.md"
        },
        {
            id: "13-linkedin",
            number: "13",
            folderName: "13-LinkedIn",
            shortTitle: "LinkedIn",
            title: "استراتژی لینکدین، شبکه‌سازی با رکروترها و دریافت Referral",
            icon: "linkedin",
            filePath: "13-LinkedIn/LinkedIn_Handbook.md"
        }
    ];

    catalog.forEach(item => {
        if (!existingIds.has(item.id)) {
            window.BOOTCAMP_MODULES.push({
                ...item,
                isUpcoming: true,
                steps: [
                    {
                        id: `${item.id}-step-1`,
                        stepNumber: 1,
                        title: `بخش ${item.number}: ${item.title}`,
                        badge: "آماده تکمیل در گام بعدی",
                        isIntroOrSetup: true,
                        estimatedTime: "در نوبت بارگذاری",
                        summary: `این بخش (${item.folderName}) در مرحله بعدی، پس از تایید شما روی درس اول (01-SQL)، به‌صورت گام‌به‌گام همراه با تمرینات صنعتی اضافه خواهد شد.`,
                        contentHtml: `
                            <blockquote>
                                <strong>توجه:</strong> طبق هماهنگی، ابتدا <strong>درس اول (01-SQL)</strong> با ۱۹ گام کامل، کدهای اجرایی و چالش‌های واقعی صنعتی آماده شده است. پس از بررسی درس اول، کافی است بگویید تا این بخش (${item.folderName}) را نیز با همین کیفیت تکمیل کنیم.
                            </blockquote>
                        `,
                        codeBlocks: [],
                        industryExercises: [],
                        keyTakeaways: []
                    }
                ]
            });
        }
    });
})();
