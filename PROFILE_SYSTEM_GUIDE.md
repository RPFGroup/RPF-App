# 👤 نظام الملف الشخصي المتقدم - دليل شامل
# Advanced Profile System - Comprehensive Guide

---

## 🎯 نظرة عامة / Overview

تم إنشاء نظام ملف شخصي متقدم وشامل يتضمن جميع المعلومات المهمة للمستخدمين مع نظام إدارة للأقسام والمسميات الوظيفية.

An advanced and comprehensive profile system has been created that includes all important user information with a management system for departments and job titles.

---

## 📋 الميزات الجديدة / New Features

### 1. 👤 الملف الشخصي المحسن / Enhanced Profile

**الحقول الجديدة / New Fields:**
- ✅ الاسم الأول والأخير (First Name & Last Name) - **مطلوب**
- ✅ القسم (Department) - يُختار من قائمة منسدلة
- ✅ المسمى الوظيفي (Job Title) - يُختار من قائمة منسدلة
- ✅ رقم الهاتف الأول (Primary Phone)
- ✅ رقم الهاتف الثاني (Secondary Phone) - اختياري
- ✅ نبذة عني (About/Bio) - نص حر
- ✅ صورة الملف الشخصي (Profile Picture URL)
- ✅ البريد الإلكتروني (Email) - للقراءة فقط

### 2. 🏢 إدارة الأقسام / Departments Management

**مميزات الأقسام:**
- ✅ الاسم بالإنجليزية والعربية
- ✅ الوصف
- ✅ ترتيب العرض
- ✅ حالة النشاط (Active/Inactive)
- ✅ إضافة / تعديل / حذف (للأدمن فقط)
- ✅ 10 أقسام افتراضية جاهزة

### 3. 💼 إدارة المسميات الوظيفية / Job Titles Management

**مميزات المسميات الوظيفية:**
- ✅ المسمى بالإنجليزية والعربية
- ✅ الوصف
- ✅ ترتيب العرض
- ✅ حالة النشاط (Active/Inactive)
- ✅ إضافة / تعديل / حذف (للأدمن فقط)
- ✅ 17 مسمى وظيفي افتراضي جاهز

---

## 🗄️ قاعدة البيانات / Database Structure

### جدول `departments` - الأقسام

```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY,
    name_en TEXT UNIQUE NOT NULL,
    name_ar TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);
```

### جدول `job_titles` - المسميات الوظيفية

```sql
CREATE TABLE job_titles (
    id UUID PRIMARY KEY,
    title_en TEXT UNIQUE NOT NULL,
    title_ar TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);
```

### تحديثات جدول `users`

**الحقول الجديدة:**
```sql
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;
ALTER TABLE users ADD COLUMN department_id UUID REFERENCES departments(id);
ALTER TABLE users ADD COLUMN job_title_id UUID REFERENCES job_titles(id);
ALTER TABLE users ADD COLUMN phone_1 TEXT;
ALTER TABLE users ADD COLUMN phone_2 TEXT;
ALTER TABLE users ADD COLUMN about TEXT;
ALTER TABLE users ADD COLUMN profile_picture_url TEXT;
```

---

## 🚀 كيفية الاستخدام / How to Use

### الخطوة 1: إعداد قاعدة البيانات
**Step 1: Setup Database**

```sql
-- تشغيل ملف إنشاء الجداول
\i Database/profile-enhancement-tables.sql
```

هذا الملف سيقوم بـ:
- إنشاء جدول الأقسام مع 10 أقسام افتراضية
- إنشاء جدول المسميات الوظيفية مع 17 مسمى افتراضي
- إضافة الحقول الجديدة لجدول المستخدمين
- إنشاء الفهارس والصلاحيات
- إنشاء الدوال المساعدة

### الخطوة 2: الوصول للملف الشخصي
**Step 2: Access Profile**

1. انتقل إلى **Settings** من القائمة الرئيسية
2. اختر تبويب **Profile**
3. املأ المعلومات المطلوبة:
   - **الاسم الأول والأخير** (مطلوب)
   - **القسم** (اختياري)
   - **المسمى الوظيفي** (اختياري)
   - **رقم الهاتف الأول** (اختياري)
   - **رقم الهاتف الثاني** (اختياري)
   - **نبذة عني** (اختياري)
4. اضغط **Save Changes**

### الخطوة 3: إدارة الأقسام والمسميات (للأدمن فقط)
**Step 3: Manage Departments & Titles (Admin Only)**

1. انتقل إلى **Settings**
2. اختر تبويب **Departments & Titles**
3. اختر بين:
   - **Departments** - لإدارة الأقسام
   - **Job Titles** - لإدارة المسميات الوظيفية

**لإضافة قسم جديد:**
- املأ الاسم بالإنجليزية والعربية
- أضف وصف (اختياري)
- اضغط **Add Department**

**لتعديل قسم:**
- اضغط على أيقونة التعديل ✏️
- عدل المعلومات
- اضغط **Save**

**لحذف قسم:**
- اضغط على أيقونة الحذف 🗑️
- أكد الحذف

---

## 📊 الأقسام الافتراضية / Default Departments

1. **Engineering** / الهندسة
2. **Project Management** / إدارة المشاريع
3. **Quality Control** / مراقبة الجودة
4. **Safety** / السلامة
5. **Finance** / المالية
6. **HR** / الموارد البشرية
7. **IT** / تقنية المعلومات
8. **Operations** / العمليات
9. **Procurement** / المشتريات
10. **Administration** / الإدارة

---

## 💼 المسميات الوظيفية الافتراضية / Default Job Titles

1. **Project Manager** / مدير مشروع
2. **Site Engineer** / مهندس موقع
3. **Senior Engineer** / مهندس أول
4. **Engineer** / مهندس
5. **Assistant Engineer** / مهندس مساعد
6. **Supervisor** / مشرف
7. **Foreman** / رئيس عمال
8. **QC Inspector** / مفتش جودة
9. **Safety Officer** / مسؤول السلامة
10. **Technical Office Engineer** / مهندس مكتب فني
11. **Planning Engineer** / مهندس تخطيط
12. **Quantity Surveyor** / مهندس كميات
13. **Procurement Officer** / مسؤول مشتريات
14. **HR Manager** / مدير الموارد البشرية
15. **Finance Manager** / مدير مالي
16. **Administrator** / إداري
17. **Executive** / تنفيذي

---

## 🔧 الدوال المساعدة / Helper Functions

### 1. تحديث الملف الشخصي
**Update User Profile**

```sql
SELECT update_user_profile(
    user_id := 'user-uuid-here',
    p_first_name := 'Ahmed',
    p_last_name := 'Mohamed',
    p_department_id := 'dept-uuid-here',
    p_job_title_id := 'title-uuid-here',
    p_phone_1 := '+966 XXX XXX XXXX',
    p_phone_2 := '+966 XXX XXX XXXX',
    p_about := 'Experienced engineer...',
    p_profile_picture_url := 'https://...'
);
```

### 2. الحصول على اسم القسم
**Get Department Name**

```sql
-- بالإنجليزية
SELECT get_department_name('dept-uuid-here', 'en');

-- بالعربية
SELECT get_department_name('dept-uuid-here', 'ar');
```

### 3. الحصول على المسمى الوظيفي
**Get Job Title**

```sql
-- بالإنجليزية
SELECT get_job_title('title-uuid-here', 'en');

-- بالعربية
SELECT get_job_title('title-uuid-here', 'ar');
```

### 4. الحصول على الاسم الكامل
**Get User Full Name**

```sql
SELECT get_user_full_name('user-uuid-here');
-- Returns: "Ahmed Mohamed"
```

---

## 📱 مكونات الواجهة / UI Components

### 1. ProfileManager.tsx
**الملف الشخصي للمستخدم**

**المميزات:**
- عرض وتعديل جميع معلومات المستخدم
- واجهة سهلة ومنظمة
- قوائم منسدلة للأقسام والمسميات
- التحقق من صحة البيانات
- حفظ تلقائي

**الاستخدام:**
```tsx
import { ProfileManager } from '@/components/settings/ProfileManager'

function SettingsPage() {
  return <ProfileManager />
}
```

### 2. DepartmentsJobTitlesManager.tsx
**إدارة الأقسام والمسميات (للأدمن)**

**المميزات:**
- تبويبات منفصلة للأقسام والمسميات
- إضافة / تعديل / حذف
- تفعيل / تعطيل
- ترتيب العرض
- دعم اللغتين (إنجليزي / عربي)

**الاستخدام:**
```tsx
import { DepartmentsJobTitlesManager } from '@/components/settings/DepartmentsJobTitlesManager'

function AdminSettings() {
  return <DepartmentsJobTitlesManager />
}
```

---

## 🔐 الأمان والصلاحيات / Security & Permissions

### صلاحيات القراءة / Read Permissions

**الأقسام والمسميات:**
- ✅ جميع المستخدمين يمكنهم رؤية الأقسام والمسميات النشطة
- ✅ فقط الأدمن يمكنهم رؤية الأقسام والمسميات غير النشطة

**الملف الشخصي:**
- ✅ كل مستخدم يمكنه رؤية ملفه الشخصي
- ✅ المستخدمون الآخرون يمكنهم رؤية معلومات محدودة فقط

### صلاحيات الكتابة / Write Permissions

**الأقسام والمسميات:**
- ❌ فقط الأدمن يمكنهم إضافة / تعديل / حذف الأقسام والمسميات

**الملف الشخصي:**
- ✅ كل مستخدم يمكنه تعديل ملفه الشخصي
- ❌ البريد الإلكتروني لا يمكن تعديله

---

## 📈 View للملف الشخصي الكامل / Complete Profile View

تم إنشاء View لسهولة الوصول للمعلومات الكاملة:

```sql
CREATE VIEW user_profiles_complete AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.full_name,
    u.role,
    u.phone_1,
    u.phone_2,
    u.about,
    u.profile_picture_url,
    u.is_active,
    d.id as department_id,
    d.name_en as department_name_en,
    d.name_ar as department_name_ar,
    jt.id as job_title_id,
    jt.title_en as job_title_en,
    jt.title_ar as job_title_ar,
    u.created_at,
    u.updated_at
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN job_titles jt ON u.job_title_id = jt.id;
```

**الاستخدام:**
```sql
-- الحصول على الملف الشخصي الكامل لمستخدم
SELECT * FROM user_profiles_complete WHERE id = 'user-uuid-here';

-- الحصول على جميع المستخدمين في قسم معين
SELECT * FROM user_profiles_complete WHERE department_id = 'dept-uuid-here';

-- الحصول على جميع المستخدمين بمسمى وظيفي معين
SELECT * FROM user_profiles_complete WHERE job_title_id = 'title-uuid-here';
```

---

## 🎨 واجهة المستخدم / User Interface

### تصميم الملف الشخصي / Profile Design

**الأقسام:**
1. **Profile Picture** - صورة الملف الشخصي
2. **Basic Information** - المعلومات الأساسية (الاسم، البريد، الهاتف)
3. **Organization Information** - معلومات المنظمة (القسم، المسمى الوظيفي)
4. **About Me** - نبذة عني

**المميزات:**
- ✅ تصميم عصري ومنظم
- ✅ رموز توضيحية لكل قسم
- ✅ حقول مطلوبة محددة بوضوح
- ✅ رسائل مساعدة للمستخدم
- ✅ دعم الوضع الليلي

### تصميم إدارة الأقسام والمسميات / Departments & Titles Design

**المميزات:**
- ✅ تبويبات منفصلة
- ✅ نموذج إضافة سريع
- ✅ قائمة منظمة مع أزرار الإجراءات
- ✅ تعديل سريع في المكان
- ✅ تأكيد قبل الحذف

---

## 🔄 التكامل مع الأنظمة الأخرى / Integration with Other Systems

### 1. نظام المستخدمين / User System
- الملف الشخصي مرتبط بجدول المستخدمين
- يمكن عرض معلومات المستخدم في أي مكان بالتطبيق

### 2. نظام التقارير / Reporting System
- يمكن إنشاء تقارير حسب القسم
- يمكن إنشاء تقارير حسب المسمى الوظيفي
- عرض الاسم الكامل في جميع التقارير

### 3. نظام الصلاحيات / Permissions System
- يمكن ربط الصلاحيات بالأقسام
- يمكن ربط الصلاحيات بالمسميات الوظيفية
- تحكم دقيق في الوصول

---

## 🎉 الخلاصة / Summary

تم إنشاء نظام ملف شخصي متقدم يوفر:

✅ **معلومات شاملة** - جميع بيانات المستخدم في مكان واحد
✅ **إدارة مرنة** - سهولة إضافة وتعديل الأقسام والمسميات
✅ **واجهة عصرية** - تصميم احترافي وسهل الاستخدام
✅ **أمان متقدم** - صلاحيات محددة ومحمية
✅ **دعم متعدد اللغات** - إنجليزي وعربي
✅ **تكامل كامل** - مرتبط مع جميع أنظمة التطبيق
✅ **بيانات افتراضية** - 10 أقسام و17 مسمى وظيفي جاهز
✅ **سهولة الصيانة** - كود منظم وموثق

**النظام الآن جاهز للاستخدام! 🚀**

---

## 📝 ملاحظات مهمة / Important Notes

1. **الأقسام والمسميات**:
   - يمكن للأدمن فقط إضافة أو تعديل الأقسام والمسميات
   - جميع المستخدمين يمكنهم رؤية واختيار الأقسام والمسميات النشطة

2. **البريد الإلكتروني**:
   - لا يمكن تغيير البريد الإلكتروني من الملف الشخصي
   - يجب التواصل مع المسؤول لتغيير البريد الإلكتروني

3. **الصورة الشخصية**:
   - حالياً يتم إدخال رابط URL للصورة
   - في المستقبل يمكن إضافة رفع الصور مباشرة

4. **الحقول المطلوبة**:
   - الاسم الأول والأخير فقط مطلوبان
   - باقي الحقول اختيارية

---

**تم إنشاء نظام ملف شخصي متقدم واحترافي! 🎉**
