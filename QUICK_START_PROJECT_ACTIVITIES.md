# 🚀 Quick Start: Project Type Activities System

## ⚡ Setup in 3 Steps

### 1️⃣ **Run SQL Script** (في Supabase)
```bash
1. افتح Supabase Dashboard
2. اذهب إلى SQL Editor
3. افتح الملف: Database/project_type_activities_table.sql
4. انسخ المحتوى كاملاً والصقه
5. اضغط RUN
```

✅ **النتيجة:** تم إنشاء:
- جدول `project_type_activities`
- 66 نشاط افتراضي
- 6 أنواع مشاريع
- RLS Policies

---

### 2️⃣ **Access Management Interface** (في النظام)
```bash
1. سجل دخول كـ Admin أو Manager
2. اذهب إلى Settings
3. اختر تبويب "Project Activities"
```

✅ **النتيجة:** ستشاهد:
- قائمة أنواع المشاريع (6 أنواع)
- الأنشطة لكل نوع
- إحصائيات شاملة

---

### 3️⃣ **Test in BOQ Form** (اختبار)
```bash
1. اذهب إلى BOQ → Add New Activity
2. أدخل Project Code لمشروع Piling
3. انتظر تحميل بيانات المشروع
4. انقر على حقل Activity Name
```

✅ **النتيجة:** ستظهر:
- قائمة الأنشطة الخاصة بـ Piling (11 نشاط)
- الوحدة الافتراضية لكل نشاط
- الفئة

---

## 🎯 الاستخدام السريع

### ➕ **إضافة نشاط جديد**
```
Settings → Project Activities → اختر نوع المشروع → Add Activity
```

### ✏️ **تعديل نشاط**
```
انقر على أيقونة القلم ✏️ بجانب النشاط
```

### 🗑️ **حذف نشاط (تعطيل)**
```
انقر على أيقونة سلة المهملات 🗑️ (soft delete)
```

### ♻️ **استعادة نشاط**
```
فعّل "Show All" → انقر على أيقونة الاستعادة ♻️
```

### 📋 **نسخ أنشطة**
```
اختر نوع المشروع → Copy → أدخل النوع الجديد
```

---

## 📊 البيانات الافتراضية

### الأنشطة حسب نوع المشروع:

| نوع المشروع | عدد الأنشطة | أمثلة |
|------------|-------------|--------|
| **Piling** | 11 | C.Piles 800mm, Pile Cap, Testing |
| **Shoring** | 12 | Sheet Piles, Secant Piles, Anchors |
| **Dewatering** | 9 | Wells, Pumps, Monitoring |
| **Ground Improvement** | 10 | Stone Columns, Compaction, Grouting |
| **Infrastructure** | 13 | Excavation, Pavement, Drainage |
| **General Construction** | 11 | Foundation, Concrete, Finishing |

**المجموع:** 66 نشاط جاهز للاستخدام! 🎉

---

## 🔑 الصلاحيات المطلوبة

| العملية | الصلاحية المطلوبة | الأدوار |
|---------|-------------------|---------|
| عرض الأنشطة | `settings.view` | All Users |
| إضافة نشاط | `settings.activities` | Admin, Manager |
| تعديل نشاط | `settings.activities` | Admin, Manager |
| حذف نشاط | `settings.activities` | Admin only |

---

## ✅ التحقق من النجاح

### في قاعدة البيانات:
```sql
-- عدد الأنشطة
SELECT COUNT(*) FROM project_type_activities;
-- Expected: 66

-- أنواع المشاريع
SELECT DISTINCT project_type FROM project_type_activities;
-- Expected: Piling, Shoring, Dewatering, Ground Improvement, Infrastructure, General Construction
```

### في النظام:
- ✅ يظهر تبويب "Project Activities" في Settings
- ✅ تظهر 6 أنواع مشاريع في القائمة
- ✅ عند النقر على نوع، تظهر أنشطته
- ✅ في BOQ Form، عند اختيار مشروع، تظهر الأنشطة المناسبة

---

## 🆘 حل المشاكل الشائعة

### ❌ **التبويب لا يظهر في Settings**
```
السبب: صلاحية settings.activities غير مفعّلة
الحل: تحقق من صلاحيات المستخدم
```

### ❌ **الأنشطة لا تظهر في BOQ Form**
```
السبب 1: project_type غير محدد في المشروع
الحل: تأكد أن المشروع له نوع محدد

السبب 2: لا توجد أنشطة لهذا النوع
الحل: أضف أنشطة من Settings
```

### ❌ **خطأ "Activity already exists"**
```
السبب: نشاط بنفس الاسم موجود لنفس نوع المشروع
الحل: غيّر اسم النشاط أو عدّل الموجود
```

---

## 📚 للمزيد

اقرأ الدليل الشامل: `PROJECT_TYPE_ACTIVITIES_SYSTEM_GUIDE.md`

---

## 🎉 **مبروك! النظام جاهز!**

الآن يمكنك إدارة الأنشطة بمرونة تامة! 🚀

