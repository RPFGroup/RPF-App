# ⚡ Quick Start - Database Management

## 🚀 كيف تبدأ (3 دقائق)

### **الخطوة 1: الوصول**
```
Settings (⚙️) → Database Management 🗄️
```
**متطلب:** دورك = Admin

---

### **الخطوة 2: اختر العملية**

#### **🆕 أول مرة تستخدم النظام؟**
```
→ اضغط "Create Full Backup"
→ احفظ الملف
→ الآن لديك نسخة احتياطية آمنة!
```

#### **💾 تريد نسخة احتياطية يومية؟**
```
Overview → Create Full Backup
→ Download
→ احفظ في Google Drive/OneDrive
```

#### **🔄 تريد استبدال البيانات التجريبية؟**
```
Manage Tables → اختر الجدول
→ Import Data
→ Mode: Replace
→ Import → تأكيد
```

#### **📥 تريد تصدير جدول للتحليل؟**
```
Manage Tables → اختر الجدول
→ Export CSV
→ افتح في Excel
```

---

## 📋 العمليات المتاحة

### **لكل جدول (9 جداول):**
```
📊 View Statistics
   - Total rows
   - Size
   - Last update

📥 Export
   - JSON format
   - CSV format (Excel compatible)

📄 Template
   - Download empty template
   - Fill and upload

📤 Import
   - From JSON/CSV
   - Append or Replace

💾 Backup
   - Table backup
   - Download as JSON

🗑️ Clear (Admin only)
   - Delete all data
   - With confirmation
```

---

## 🎯 السيناريوهات الشائعة

### **1. استبدال بيانات تجريبية (الأكثر شيوعاً)**
```
⏱️ الوقت: 5-10 دقائق
🔐 الصلاحية: Admin

الخطوات:
1. Backup الحالي ← للأمان
2. تحضير ملفات CSV للبيانات الحقيقية
3. لكل جدول:
   - Import Data
   - Mode: Replace
   - Import
4. تأكد من البيانات
5. Backup الجديد ← للبيانات الحقيقية
```

### **2. نسخ احتياطي يومي**
```
⏱️ الوقت: 30 ثانية
🔐 الصلاحية: Admin أو Manager

الخطوات:
1. Create Full Backup
2. Download
3. احفظ في السحابة
```

### **3. إضافة بيانات جديدة بكميات كبيرة**
```
⏱️ الوقت: 2-5 دقائق
🔐 الصلاحية: Admin

الخطوات:
1. Download Template
2. املأ في Excel
3. Save as CSV (UTF-8)
4. Import → Mode: Append
5. Import
```

---

## ⚠️ تحذيرات مهمة

### **قبل استخدام Replace:**
```
⚠️ عمل Backup أولاً!
⚠️ راجع الجدول الصحيح
⚠️ تأكد من الملف الصحيح
⚠️ اقرأ رسالة التأكيد
```

### **قبل Clear All Data:**
```
🔴 عملية خطرة جداً!
🔴 يحذف كل البيانات
🔴 لا يمكن التراجع إلا من Backup
🔴 Admin فقط
```

---

## 📊 الصلاحيات السريعة

| Operation | Admin | Manager | Engineer | Viewer |
|-----------|-------|---------|----------|--------|
| View Stats | ✅ | ✅ | ✅ | ✅ |
| Backup | ✅ | ✅ | ❌ | ❌ |
| Restore | ✅ | ❌ | ❌ | ❌ |
| Export | ✅ | ✅ | ❌ | ❌ |
| Import | ✅ | ❌ | ❌ | ❌ |
| Clear | ✅ | ❌ | ❌ | ❌ |

---

## 🎨 ما تتوقع رؤيته

### **Overview:**
```
┌─────────────────────┐
│ 📊 Total Tables: 9  │
│ 📊 Total Rows: 5432 │
│ 📊 Date: Oct 9      │
└─────────────────────┘

[Create Full Backup] [Manage Tables]

Table Cards:
🏗️ Projects - 324 rows - 162 KB
📋 BOQ Activities - 1,598 rows - 799 KB
📊 KPI Records - 2,935 rows - 1.47 MB
...
```

### **Manage Tables:**
```
For each table:
┌────────────────────────┐
│ 🏗️ Projects            │
│ Main projects table    │
├────────────────────────┤
│ Rows: 324              │
│ Size: 162 KB           │
│ Updated: Oct 9, 2025   │
├────────────────────────┤
│ [Export JSON] [CSV]    │
│ [Download Template]    │
│ [Import Data]          │
│ [Create Backup]        │
│ [Clear All Data] (Red) │
└────────────────────────┘
```

---

## 🔧 استكشاف الأخطاء

### **لا تظهر Database Management:**
```
السبب: لست Admin
الحل: اطلب من Admin ترقية دورك
```

### **Import failed:**
```
الأسباب المحتملة:
1. أسماء الأعمدة غير مطابقة → استخدم Template
2. تنسيق خاطئ → تأكد من UTF-8
3. بيانات ناقصة → راجع الملف
4. مشكلة اتصال → تحقق من الإنترنت

الحل: راجع Console (F12) للتفاصيل
```

---

## 🎯 أوامر سريعة

### **نسخ احتياطي سريع:**
```
Settings → DB Management → Create Backup → Download
```

### **استبدال جدول:**
```
Settings → DB Management → Manage Tables → [Table]
→ Import → Replace → Confirm
```

### **تصدير للتحليل:**
```
Settings → DB Management → Manage Tables → [Table]
→ Export CSV → Open in Excel
```

### **قالب فارغ:**
```
Settings → DB Management → Manage Tables → [Table]
→ Download Template → Fill → Import
```

---

## ✅ التحقق من النجاح

### **بعد الاستيراد:**
```
1. Check console: "✅ Successfully imported X rows"
2. Go to table page (Projects/BOQ/KPI)
3. Verify row count
4. Open some records
5. Check Dashboard statistics
6. ✅ If all looks good → Create backup!
```

---

## 🎉 مستعد!

**النظام جاهز بالكامل!**

- ✅ 9 جداول مدارة
- ✅ كل العمليات متاحة
- ✅ صلاحيات محدثة
- ✅ واجهة احترافية
- ✅ أمان عالي
- ✅ سرعة ممتازة

**ابدأ باستكشاف Database Management الآن!** 🚀

---

**Need Help?**
- 📚 DATABASE_MANAGEMENT_GUIDE.md - Full guide
- 📚 REPLACE_TEST_DATA_WITH_REAL_GUIDE.md - Replace scenario
- 📚 PERMISSIONS_SYSTEM_UPDATED.md - Permissions details

