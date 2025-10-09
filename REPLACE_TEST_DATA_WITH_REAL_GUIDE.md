# 🔄 دليل استبدال البيانات التجريبية بالبيانات الحقيقية

## 📋 السيناريو

لديك بيانات تجريبية (عينة) في النظام وتريد الآن رفع البيانات الحقيقية الكاملة.

---

## ⚡ الطريقة السريعة (موصى بها)

### **الخطوات:**

#### 1️⃣ **النسخ الاحتياطي (Safety First!)**
```
📍 المكان: Settings → Database Management
📍 التاب: Overview أو Create Backup

الخطوات:
1. اضغط "Create Full Backup"
2. انتظر التحميل (5-30 ثانية)
3. سيتم تنزيل ملف: database_backup_2025-10-09.json
4. احفظه في مكان آمن (للرجوع إليه لو احتجت)

✅ الآن لديك نسخة من البيانات التجريبية
```

#### 2️⃣ **تحضير البيانات الحقيقية**

**الخيار A - لديك ملف نسخة احتياطية جاهز:**
```
✅ إذا كانت لديك نسخة احتياطية كاملة من النظام القديم
✅ أو من قاعدة بيانات أخرى
✅ تنسيق JSON مطابق لنظامنا
   
→ اذهب مباشرة للخطوة 3 (Restore)
```

**الخيار B - لديك ملفات CSV/Excel:**
```
لكل جدول تريد تحديثه:

📁 Projects:
  1. افتح Settings → Database Management → Manage Tables
  2. اختر "Projects"
  3. اضغط "Download Empty Template"
  4. ستحصل على: Planning Database - ProjectsList_template.csv
  5. افتح الملف في Excel
  6. الصف الأول = أسماء الأعمدة (لا تغيرها!)
  7. املأ البيانات الحقيقية من الصف الثاني
  8. احفظ كـ CSV (UTF-8)

📁 BOQ Activities:
  - نفس الخطوات
  - Template: Planning Database - BOQ Rates_template.csv
  
📁 KPI Records:
  - نفس الخطوات
  - Template: Planning Database - KPI_template.csv
```

**ملاحظات مهمة للـ CSV:**
```
⚠️ استخدم UTF-8 encoding
⚠️ لا تغير أسماء الأعمدة
⚠️ تأكد من صحة التنسيقات:
   - التواريخ: YYYY-MM-DD (مثل: 2025-10-09)
   - الأرقام: بدون فواصل (1000 وليس 1,000)
   - النصوص: بدون علامات تنصيص إضافية
```

#### 3️⃣ **رفع البيانات الحقيقية**

**إذا لديك ملف Backup كامل:**
```
📍 المكان: Settings → Database Management → Restore

الخطوات:
1. اختر ملف النسخة الاحتياطية للبيانات الحقيقية
2. اضغط "Load Backup File"
3. راجع المعلومات:
   - Created: تاريخ النسخة
   - Tables: عدد الجداول
   - Total Rows: إجمالي الصفوف
4. اختر Mode: "Replace - Delete existing data first"
5. اضغط "Restore Database"
6. تأكيد العملية ⚠️
7. انتظر (قد يستغرق 1-5 دقائق حسب الحجم)
8. ✅ تم! البيانات الحقيقية الآن في النظام
```

**إذا لديك ملفات CSV منفصلة:**
```
📍 المكان: Settings → Database Management → Manage Tables

لكل جدول:
1. اختر الجدول (مثل Projects)
2. في قسم "Import Data":
   - اختر ملف CSV الخاص بالبيانات الحقيقية
   - Mode: "Replace (Delete & Replace)"
   - اضغط "Import"
3. تأكيد العملية ⚠️
4. انتظر (5-60 ثانية)
5. ✅ تم! هذا الجدول الآن به البيانات الحقيقية

كرر للجداول الأخرى:
✅ Projects → استبدل
✅ BOQ Activities → استبدل
✅ KPI Records → استبدل
✅ Divisions (إذا مختلفة) → استبدل
✅ Project Types (إذا مختلفة) → استبدل
```

---

## 🎯 الترتيب الصحيح للاستيراد

### **⚠️ مهم جداً!** بعض الجداول تعتمد على بعض:

```
1️⃣ أولاً: Reference Tables (جداول المراجع)
   ├─ Divisions
   ├─ Project Types
   ├─ Currencies
   └─ Activities Database

2️⃣ ثانياً: Master Data
   └─ Projects (تعتمد على Divisions و Project Types)

3️⃣ ثالثاً: Detail Data
   └─ BOQ Activities (تعتمد على Projects)

4️⃣ أخيراً: Transactional Data
   └─ KPI Records (تعتمد على BOQ Activities)

5️⃣ اختياري: System Tables
   ├─ Company Settings
   └─ Users (إذا كنت تريد استبدال المستخدمين)
```

**لماذا هذا الترتيب؟**
- Projects يحتاج Division و Type موجودة
- BOQ Activities يحتاج Project Code موجود
- KPI Records يحتاج Activity Name موجودة

---

## 📊 أمثلة عملية

### **مثال 1: استبدال كل شيء (Full Replace)**

**الوضع الحالي:**
```
Projects: 50 تجريبي
BOQ Activities: 200 تجريبي
KPI Records: 500 تجريبي
```

**الوضع المطلوب:**
```
Projects: 324 حقيقي
BOQ Activities: 1,598 حقيقي
KPI Records: 2,935 حقيقي
```

**الحل:**

**إذا لديك نسخة احتياطية كاملة:**
```
1. Backup الحالي (للأمان)
2. Restore → اختر ملف البيانات الحقيقية
3. Mode: Replace
4. Restore Database
5. ✅ تم في دقائق!
```

**إذا لديك ملفات CSV:**
```
1. Backup الحالي
2. Import Projects (Replace mode)
3. Import BOQ Activities (Replace mode)
4. Import KPI Records (Replace mode)
5. ✅ تم!
```

---

### **مثال 2: استبدال جدول واحد فقط**

**السيناريو:** البيانات التجريبية للـ Projects فقط، باقي البيانات حقيقية

```
الخطوات:
1. Manage Tables → Projects
2. Create Backup (للجدول فقط - للأمان)
3. Import Data:
   - اختر ملف Projects الحقيقية
   - Mode: Replace
   - Import
4. ✅ تم استبدال Projects فقط
5. باقي الجداول لم تتأثر
```

---

### **مثال 3: دمج البيانات (Append)**

**السيناريو:** لديك 50 مشروع تجريبي + تريد إضافة 324 حقيقي = 374 إجمالي

```
الخطوات:
1. Import Data
2. Mode: Append (Add to existing)
3. Import
4. ✅ الآن لديك 374 مشروع (50 قديم + 324 جديد)

⚠️ ملاحظة: قد يسبب مشاكل إذا كانت Project Codes مكررة!
```

**متى تستخدم Append:**
- ✅ عند إضافة بيانات جديدة بدون حذف القديمة
- ✅ عند دمج بيانات من مصادر متعددة
- ⚠️ تأكد من عدم وجود تكرار في المفاتيح (Project Code, etc.)

---

## ⚠️ تحذيرات مهمة

### **🔴 وضع Replace يحذف كل شيء!**
```
قبل استخدام Replace:
✅ تأكد من عمل Backup
✅ راجع الجدول الصحيح
✅ تأكد من الملف الصحيح
✅ اقرأ رسالة التأكيد بعناية
```

### **🟡 التحقق من البيانات المستوردة:**
```
بعد الاستيراد:
✅ اذهب للصفحة المناسبة (Projects, BOQ, KPI)
✅ تحقق من عدد الصفوف
✅ افتح بعض السجلات للتأكد
✅ تأكد من صحة البيانات
```

### **🟢 الاستعادة في حالة الخطأ:**
```
إذا حدث خطأ:
1. لا تقلق! لديك النسخة الاحتياطية
2. Restore → اختر ملف Backup القديم
3. Mode: Replace
4. Restore
5. ✅ رجعت للبيانات القديمة!
```

---

## 📊 مقارنة الأوضاع

### **Mode: Append (Add to existing)**
```
الحالة قبل:
Projects: 50 صف

الحالة بعد Import (100 صف):
Projects: 150 صف (50 قديم + 100 جديد)

✅ المزايا:
  - يحتفظ بالبيانات القديمة
  - آمن ولا يحذف شيء
  - يمكن التراجع بسهولة (حذف الجديدة فقط)

⚠️ العيوب:
  - قد يسبب تكرار
  - قد تحتاج لتنظيف البيانات المكررة
  - حجم الجدول يزيد

📌 استخدمه عندما:
  - تريد إضافة بيانات جديدة
  - تريد دمج مصادر متعددة
  - غير متأكد (الأكثر أماناً)
```

### **Mode: Replace (Delete & Replace)**
```
الحالة قبل:
Projects: 50 صف

الحالة بعد Import (100 صف):
Projects: 100 صف (فقط الجديد)

✅ المزايا:
  - بداية نظيفة
  - لا يوجد تكرار
  - الحجم محدد ومتوقع

⚠️ العيوب:
  - يحذف كل البيانات القديمة
  - لا يمكن التراجع (إلا من Backup)
  - خطر فقدان البيانات إذا لم تعمل Backup

📌 استخدمه عندما:
  - تريد استبدال كامل
  - البيانات القديمة غير مهمة
  - لديك نسخة احتياطية أكيدة
  - تريد بداية نظيفة
```

---

## 🎯 أفضل الممارسات

### **1. قبل البدء:**
```
✅ Backup كامل للبيانات الحالية
✅ تحضير ملفات البيانات الحقيقية
✅ التحقق من صحة الملفات
✅ اختبار على عدد صغير أولاً
```

### **2. أثناء الاستيراد:**
```
✅ اتبع الترتيب الصحيح (References → Master → Details)
✅ استخدم Replace للاستبدال الكامل
✅ راقب Console للأخطاء
✅ تأكد من نجاح كل خطوة قبل الانتقال للتالية
```

### **3. بعد الاستيراد:**
```
✅ تحقق من عدد الصفوف في كل جدول
✅ افتح بعض السجلات للمراجعة
✅ تأكد من العلاقات بين الجداول
✅ اختبر الواجهات (Dashboard, Projects, BOQ, KPI)
✅ عمل Backup جديد للبيانات الحقيقية
```

---

## 🚀 سيناريو كامل (خطوة بخطوة)

### **الموقف:**
```
Current:
├─ 50 test projects
├─ 200 test activities
└─ 500 test KPIs

Target:
├─ 324 real projects
├─ 1,598 real activities
└─ 2,935 real KPIs
```

### **التنفيذ:**

#### **المرحلة 1: التحضير (5 دقائق)**
```
1. Settings → Database Management
2. Create Full Backup
3. حفظ: backup_test_data_2025-10-09.json
4. تحضير ملفات البيانات الحقيقية:
   ├─ real_projects.csv (324 rows)
   ├─ real_activities.csv (1,598 rows)
   └─ real_kpis.csv (2,935 rows)
```

#### **المرحلة 2: استبدال Reference Tables (2 دقيقة)**
```
إذا كانت Divisions/Types/Currencies مختلفة:

1. Manage Tables → Divisions
   - Import real_divisions.csv
   - Mode: Replace
   - Import → ✅

2. Manage Tables → Project Types
   - Import real_project_types.csv
   - Mode: Replace
   - Import → ✅

3. Manage Tables → Currencies
   - Import real_currencies.csv
   - Mode: Replace
   - Import → ✅
```

#### **المرحلة 3: استبدال Master Data (1 دقيقة)**
```
1. Manage Tables → Projects
2. Import Data:
   - اختر: real_projects.csv
   - Mode: Replace (Delete & Replace)
   - Import
3. تأكيد: "Yes, you want to delete 50 rows and import 324"
4. انتظر... (15-30 ثانية)
5. ✅ Success: "Successfully imported 324 rows"
6. تحقق: اذهب لـ Projects page → يجب أن ترى 324 مشروع
```

#### **المرحلة 4: استبدال Detail Data (2-3 دقيقة)**
```
1. Manage Tables → BOQ Activities
   - Import: real_activities.csv
   - Mode: Replace
   - Import → ✅ (30-60 ثانية)
   - تحقق: BOQ page → 1,598 نشاط

2. Manage Tables → KPI Records
   - Import: real_kpis.csv
   - Mode: Replace
   - Import → ✅ (45-90 ثانية)
   - تحقق: KPI page → 2,935 سجل
```

#### **المرحلة 5: التحقق النهائي (5 دقائق)**
```
1. Dashboard:
   - Total Projects: 324 ✅
   - Total Activities: 1,598 ✅
   - Total KPIs: 2,935 ✅

2. Projects Page:
   - تصفح بعض المشاريع
   - تحقق من البيانات
   
3. BOQ Page:
   - تصفح الأنشطة
   - تحقق من Progress calculations
   
4. KPI Page:
   - تصفح KPIs
   - فلتر حسب مشروع
   - تحقق من Planned vs Actual

5. Reports:
   - افتح Summary Report
   - تحقق من الأرقام
   
6. ✅ إذا كل شيء صحيح:
   - Create Full Backup للبيانات الحقيقية
   - حفظ: backup_real_data_2025-10-09.json
```

---

## 🐛 حل المشاكل الشائعة

### **مشكلة: "Import failed - Column not found"**
```
السبب: أسماء الأعمدة غير مطابقة

الحل:
1. Download Template من النظام
2. انسخ أسماء الأعمدة بالضبط
3. تأكد من Case sensitivity (Project Code وليس project code)
4. أعد المحاولة
```

### **مشكلة: "Some rows failed to import"**
```
السبب: بيانات غير صحيحة أو مفقودة

الحل:
1. افتح Console (F12)
2. راجع رسائل الأخطاء
3. الأخطاء الشائعة:
   - Project Code فارغ
   - تواريخ بتنسيق خاطئ
   - أرقام بتنسيق خاطئ
4. صحح البيانات وأعد المحاولة
```

### **مشكلة: "Duplicate Project Code"**
```
السبب: Project Code موجود مسبقاً

الحل إذا كنت تستخدم Append:
1. استخدم Replace بدلاً من Append
   أو
2. احذف البيانات القديمة أولاً (Clear All Data)
   ثم Append

الحل إذا كنت تستخدم Replace:
3. تحقق من ملف CSV - قد يكون فيه تكرار داخلي
```

### **مشكلة: "Activities imported but Projects not found"**
```
السبب: رفعت Activities قبل Projects

الحل:
1. Clear BOQ Activities Data
2. Import Projects أولاً
3. ثم Import BOQ Activities
```

---

## 📈 مراقبة التقدم

### **أثناء الاستيراد:**
```
Console Messages:
📥 Importing 324 rows to table: Planning Database - ProjectsList (mode: replace)
🗑️ Clearing existing data first...
✅ Successfully cleared 50 rows
📦 Inserting new data...
✅ Successfully imported 324 rows to Planning Database - ProjectsList

UI Messages:
💾 Creating backup... Please wait...
✅ Backup created: Successfully backed up 9/9 tables (5,432 rows)
```

### **الإحصائيات:**
```
قبل:
📊 Total Tables: 9
📊 Total Rows: 750

بعد:
📊 Total Tables: 9
📊 Total Rows: 4,857
```

---

## 🎯 Checklist للاستبدال الكامل

```
قبل البدء:
☐ عمل Full Backup للبيانات الحالية
☐ تحضير جميع ملفات البيانات الحقيقية
☐ التحقق من صحة الملفات
☐ التأكد من الاتصال بالإنترنت

أثناء الاستيراد:
☐ استيراد Reference Tables أولاً
☐ ثم Master Data (Projects)
☐ ثم Detail Data (BOQ Activities)
☐ أخيراً Transactional Data (KPIs)
☐ استخدام Replace mode
☐ مراقبة Console للأخطاء

بعد الاستيراد:
☐ التحقق من عدد الصفوف
☐ مراجعة بعض السجلات
☐ اختبار Dashboard
☐ اختبار كل الصفحات
☐ عمل Backup جديد للبيانات الحقيقية
☐ حفظ Backup في 3 أماكن مختلفة!
```

---

## 💡 نصائح احترافية

### **1. الاختبار قبل الإنتاج:**
```
✅ جرب على قاعدة بيانات تجريبية أولاً
✅ استخدم Supabase project منفصل للتجربة
✅ اختبر كل الوظائف بعد الاستيراد
✅ فقط بعد التأكد، طبق على الإنتاج
```

### **2. النسخ الاحتياطي المتعدد:**
```
✅ احفظ Backup في 3 أماكن:
   1. جهازك المحلي
   2. Google Drive / OneDrive
   3. External Hard Drive
```

### **3. التوثيق:**
```
✅ سجل كل عملية استيراد:
   - التاريخ
   - الوقت
   - الملفات المستخدمة
   - النتائج
   - أي مشاكل واجهتها
```

### **4. التدرج:**
```
✅ ابدأ بجدول واحد
✅ تأكد من نجاحه
✅ ثم الجدول التالي
✅ لا تستعجل!
```

---

## 🎉 الخلاصة

### النظام يدعم الآن:
```
✅ استبدال كامل (Full Replace)
✅ استبدال جزئي (Single Table Replace)
✅ إضافة بيانات (Append)
✅ نسخ احتياطي سريع
✅ استعادة سريعة
✅ Export/Import لكل جدول
✅ Templates جاهزة
```

### الصلاحيات المطلوبة:
```
للاستبدال الكامل: Admin
للنسخ الاحتياطي: Admin أو Manager
للتصدير: Admin أو Manager
للعرض: الجميع (Admin, Manager, Engineer, Viewer)
```

---

## 🚀 ابدأ الآن!

```
1. Settings → Database Management
2. Create Backup (الأمان أولاً!)
3. Manage Tables → اختر الجدول
4. Import Data → اختر الملف
5. Mode: Replace
6. Import → تأكيد
7. ✅ تم الاستبدال!
```

---

**النظام جاهز ومصمم خصيصاً لهذا السيناريو!** 🎯

**تاريخ الإنشاء:** 2025-10-09  
**الإصدار:** 1.0.0  
**الحالة:** ✅ جاهز للاستخدام

