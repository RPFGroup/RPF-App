# 🔧 حل خطأ RPC Functions

## ❌ الخطأ

```
POST https://...supabase.co/rest/v1/rpc/enable_project_type 400 (Bad Request)
```

## 🎯 السبب

الدالة `enable_project_type` غير موجودة في قاعدة البيانات. يجب إنشاؤها أولاً.

## ✅ الحل السريع

### **استخدم السكريبت المبسط:**

```bash
1. افتح Supabase → SQL Editor
2. افتح الملف: Database/create-safe-functions-only.sql
3. انسخ والصق المحتوى
4. اضغط Run ✅
```

**ماذا يفعل:**
- ✅ ينشئ دالة `safe_delete_project_type()`
- ✅ ينشئ دالة `enable_project_type()`
- ✅ ينشئ دالة `get_unified_activity_stats()`
- ✅ لا يعدل البنية (safe 100%)
- ✅ يعمل فوراً

## 🔍 الدوال المنشأة

### **1. safe_delete_project_type()**
```sql
-- حذف آمن
SELECT safe_delete_project_type('Infrastructure');

-- النتيجة:
-- إذا له أنشطة → تعطيل
-- إذا بدون أنشطة → حذف
```

### **2. enable_project_type()**
```sql
-- إعادة تفعيل
SELECT enable_project_type('Infrastructure');

-- النتيجة:
-- تفعيل النوع + جميع أنشطته
```

### **3. get_unified_activity_stats()**
```sql
-- إحصائيات شاملة
SELECT get_unified_activity_stats();

-- النتيجة:
-- JSON بالإحصائيات الكاملة
```

## ✅ التحقق

بعد تشغيل السكريبت:

```sql
-- اختبار الدوال
SELECT safe_delete_project_type('Test Type');
SELECT enable_project_type('Test Type');
SELECT get_unified_activity_stats();
```

## 🎯 النتيجة

بعد تشغيل السكريبت:
- ✅ الدوال متوفرة
- ✅ الواجهة تعمل
- ✅ لا أخطاء 400
- ✅ جميع الأزرار تعمل

## 📝 ملاحظة

هذا السكريبت **آمن 100%**:
- لا يعدل البنية
- لا يحذف بيانات
- فقط ينشئ الدوال
- يمكن تشغيله عدة مرات

**جرّبه الآن!** ✅
