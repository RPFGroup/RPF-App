# 🏢 دليل إعداد إعدادات الشركة في قاعدة البيانات

## 📋 نظرة عامة

تم إنشاء نظام شامل لحفظ إعدادات الشركة في قاعدة البيانات الأساسية بدلاً من localStorage. هذا يضمن:

- ✅ **الوصول المركزي** - جميع المستخدمين يرون نفس الإعدادات
- ✅ **الأمان** - صلاحيات محددة للمديرين فقط
- ✅ **الاستمرارية** - الإعدادات محفوظة حتى بعد إعادة تشغيل التطبيق
- ✅ **التخزين المؤقت** - أداء محسن مع التخزين المؤقت الذكي

## 🗄️ هيكل قاعدة البيانات

### جدول `company_settings`

```sql
CREATE TABLE company_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL DEFAULT 'AlRabat RPF',
    company_slogan TEXT NOT NULL DEFAULT 'Masters of Foundation Construction',
    company_logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);
```

### الحقول:

- **`id`** - معرف فريد للسجل
- **`company_name`** - اسم الشركة (افتراضي: "AlRabat RPF")
- **`company_slogan`** - شعار الشركة (افتراضي: "Masters of Foundation Construction")
- **`company_logo_url`** - رابط لوجو الشركة (اختياري)
- **`created_at`** - تاريخ الإنشاء
- **`updated_at`** - تاريخ آخر تحديث
- **`created_by`** - المستخدم الذي أنشأ السجل
- **`updated_by`** - المستخدم الذي حدث السجل آخر مرة

## 🔐 سياسات الأمان (RLS)

### صلاحيات القراءة:
- ✅ **جميع المستخدمين المسجلين** يمكنهم قراءة إعدادات الشركة

### صلاحيات التعديل:
- ✅ **المديرين فقط** يمكنهم تعديل إعدادات الشركة
- ❌ **المستخدمين الآخرين** لا يمكنهم التعديل

## 🛠️ الدوال المساعدة

### 1. `get_company_settings()`
```sql
SELECT * FROM get_company_settings();
```
- جلب إعدادات الشركة الحالية
- ترجع أحدث سجل

### 2. `update_company_settings(company_name, company_slogan, company_logo_url)`
```sql
SELECT update_company_settings('New Company', 'New Slogan', 'logo_url');
```
- تحديث إعدادات الشركة
- متاح للمديرين فقط
- ترجع `true` عند النجاح

## 📁 الملفات المضافة/المحدثة

### ملفات جديدة:
1. **`Database/company-settings-table.sql`** - سكريبت إنشاء الجدول والدوال
2. **`lib/companySettings.ts`** - مكتبة التعامل مع إعدادات الشركة
3. **`components/settings/CompanySettings.tsx`** - مكون إعدادات الشركة
4. **`COMPANY_SETTINGS_DATABASE_SETUP.md`** - هذا الدليل

### ملفات محدثة:
1. **`lib/supabase.ts`** - إضافة `COMPANY_SETTINGS` إلى `TABLES`
2. **`components/dashboard/ModernSidebar.tsx`** - قراءة الإعدادات من قاعدة البيانات
3. **`app/(authenticated)/settings/page.tsx`** - إضافة تبويب إعدادات الشركة

## 🚀 خطوات الإعداد

### 1. تشغيل سكريبت قاعدة البيانات
```bash
# في Supabase SQL Editor
# تشغيل محتوى ملف: Database/company-settings-table.sql
```

### 2. التحقق من الإعداد
```sql
-- التحقق من إنشاء الجدول
SELECT * FROM company_settings;

-- التحقق من الدوال
SELECT * FROM get_company_settings();

-- التحقق من السياسات
SELECT * FROM pg_policies WHERE tablename = 'company_settings';
```

### 3. إدراج إعدادات افتراضية
```sql
-- سيتم إدراجها تلقائياً عند تشغيل السكريبت
INSERT INTO company_settings (company_name, company_slogan, created_by, updated_by)
VALUES (
    'AlRabat RPF',
    'Masters of Foundation Construction',
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
);
```

## 💻 استخدام النظام

### في الكود:

```typescript
import { getCompanySettings, updateCompanySettings } from '@/lib/companySettings'

// جلب الإعدادات
const settings = await getCompanySettings()

// تحديث الإعدادات (للمديرين فقط)
const result = await updateCompanySettings(
  'New Company Name',
  'New Company Slogan',
  'https://example.com/logo.png'
)
```

### في الواجهة:
1. اذهب إلى **Settings** → **Company Settings**
2. عدل اسم الشركة أو الشعار أو اللوجو
3. اضغط **حفظ في قاعدة البيانات**
4. ستظهر التغييرات فوراً في الشريط الجانبي

## 🔄 التخزين المؤقت

- **مدة التخزين المؤقت**: 5 دقائق
- **مسح التخزين المؤقت**: عند تحديث الإعدادات
- **الاستخدام**: `getCachedCompanySettings()` للحصول على أداء محسن

## 🛡️ الأمان

### التحقق من الصلاحيات:
```typescript
const canEdit = await canUpdateCompanySettings()
if (!canEdit) {
  // عرض رسالة خطأ
}
```

### في قاعدة البيانات:
- **RLS مفعل** على الجدول
- **سياسات محددة** للمديرين فقط
- **تسجيل العمليات** (created_by, updated_by)

## 🐛 استكشاف الأخطاء

### مشكلة: "لا توجد صلاحية للتعديل"
**الحل**: تأكد أن المستخدم له دور `admin` في جدول `users`

### مشكلة: "خطأ في جلب الإعدادات"
**الحل**: 
1. تحقق من اتصال قاعدة البيانات
2. تأكد من تشغيل سكريبت إنشاء الجدول
3. تحقق من سياسات RLS

### مشكلة: "الإعدادات لا تظهر"
**الحل**:
1. مسح التخزين المؤقت: `clearCompanySettingsCache()`
2. إعادة تحميل الصفحة
3. التحقق من وجود بيانات في الجدول

## 📊 مراقبة الأداء

### استعلامات مراقبة:
```sql
-- عدد التحديثات
SELECT COUNT(*) FROM company_settings;

-- آخر تحديث
SELECT * FROM company_settings ORDER BY updated_at DESC LIMIT 1;

-- المستخدمين الذين عدلوا الإعدادات
SELECT DISTINCT updated_by FROM company_settings;
```

## 🎯 الميزات المستقبلية

- [ ] **إصدارات الإعدادات** - حفظ تاريخ التغييرات
- [ ] **إعدادات متعددة** - دعم شركات متعددة
- [ ] **تصدير/استيراد** - نسخ احتياطي للإعدادات
- [ ] **إشعارات التغيير** - إشعار المستخدمين بالتحديثات

---

## ✅ التحقق من الإعداد

بعد تشغيل السكريبت، تأكد من:

1. ✅ **الجدول موجود**: `SELECT * FROM company_settings;`
2. ✅ **الدوال تعمل**: `SELECT * FROM get_company_settings();`
3. ✅ **السياسات مفعلة**: `SELECT * FROM pg_policies WHERE tablename = 'company_settings';`
4. ✅ **الإعدادات الافتراضية موجودة**: يجب أن ترى سجل واحد
5. ✅ **الواجهة تعمل**: اذهب إلى Settings → Company Settings

**🎉 مبروك! نظام إعدادات الشركة جاهز للاستخدام!**
