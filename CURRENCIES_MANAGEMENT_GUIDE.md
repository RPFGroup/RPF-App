# 💰 دليل إدارة العملات (Currencies Management)

## 📋 نظرة عامة

تم إضافة نظام شامل لإدارة العملات مع تحديد تلقائي للعملة الإماراتية (AED) كافتراضي، مع إمكانية تغيير العملة حسب موقع المشروع.

## ✨ المزايا الجديدة

### 1. **العملات الافتراضية (3 عملات)**
- **AED (UAE Dirham)** - العملة الافتراضية 🏆
- **USD (US Dollar)** - للدولار الأمريكي
- **SAR (Saudi Riyal)** - للريال السعودي

### 2. **التحديد التلقائي للعملة**
- ✅ **الإمارات**: AED (افتراضي)
- ✅ **السعودية**: SAR
- ✅ **أمريكا**: USD
- ✅ **أي مكان آخر**: AED (افتراضي)

### 3. **إدارة كاملة للعملات**
- ✅ إضافة عملات جديدة
- ✅ تعديل العملات الموجودة
- ✅ حذف (تعطيل) العملات
- ✅ تحديد العملة الافتراضية
- ✅ تتبع عدد الاستخدامات
- ✅ تحويل العملات

## 🗄️ البنية التقنية

### الملفات الجديدة

1. **`lib/currenciesManager.ts`**
   - إدارة العمليات مع Supabase
   - تحديد العملة تلقائياً حسب الموقع
   - تحويل العملات
   - تنسيق المبالغ

2. **`components/settings/CurrenciesManager.tsx`**
   - واجهة مستخدم لإدارة العملات
   - نموذج إضافة/تعديل العملات
   - عرض العملات مع الرموز والأسعار

3. **`Database/currencies-table-schema.sql`**
   - SQL Schema لجدول العملات
   - دالة تحديد العملة تلقائياً
   - Row Level Security (RLS)

### التحديثات على الملفات الموجودة

1. **`components/settings/SettingsPage.tsx`**
   - إضافة تاب "Currencies" للمسؤولين والمدراء
   - عرض مكون CurrenciesManager

## 📊 هيكل قاعدة البيانات

### جدول `currencies`

```sql
CREATE TABLE currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(3) NOT NULL UNIQUE, -- مثل: AED, USD, SAR
  name VARCHAR(100) NOT NULL, -- مثل: UAE Dirham, US Dollar
  symbol VARCHAR(10) NOT NULL, -- مثل: د.إ, $, ر.س
  exchange_rate DECIMAL(10, 6) NOT NULL DEFAULT 1.0, -- سعر الصرف مقابل AED
  is_default BOOLEAN DEFAULT FALSE, -- العملة الافتراضية
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### الأعمدة

- **id**: المعرف الفريد (UUID)
- **code**: رمز العملة (3 أحرف، ISO 4217)
- **name**: اسم العملة
- **symbol**: رمز العملة للعرض
- **exchange_rate**: سعر الصرف مقابل الدرهم الإماراتي
- **is_default**: هل هذه العملة الافتراضية؟
- **is_active**: هل العملة نشطة؟
- **usage_count**: عدد المشاريع التي تستخدم هذه العملة
- **created_at**: تاريخ الإنشاء
- **updated_at**: تاريخ آخر تحديث

## 🚀 التثبيت والإعداد

### 1. إنشاء جدول العملات في Supabase

قم بتشغيل SQL Script في Supabase SQL Editor:

```bash
# افتح Supabase Dashboard
# انتقل إلى SQL Editor
# نفذ محتوى ملف: Database/currencies-table-schema.sql
```

### 2. التحقق من Row Level Security (RLS)

الصلاحيات المضبوطة:
- **القراءة**: جميع المستخدمين (العملات النشطة فقط)
- **الإضافة/التعديل/الحذف**: المستخدمون المصرح لهم فقط

## 💻 الاستخدام

### للمطورين

#### جلب جميع العملات

```typescript
import { getAllCurrencies, getDefaultCurrency } from '@/lib/currenciesManager'

// جلب جميع العملات
const currencies = await getAllCurrencies()

// جلب العملة الافتراضية
const defaultCurrency = await getDefaultCurrency()
```

#### تحديد العملة تلقائياً

```typescript
import { getCurrencyForProject } from '@/lib/currenciesManager'

// تحديد العملة حسب موقع المشروع
const currency = await getCurrencyForProject('UAE') // سيعيد AED
const currency2 = await getCurrencyForProject('Saudi Arabia') // سيعيد SAR
const currency3 = await getCurrencyForProject('USA') // سيعيد USD
const currency4 = await getCurrencyForProject() // سيعيد AED (افتراضي)
```

#### تحويل العملات

```typescript
import { convertCurrency, formatCurrency } from '@/lib/currenciesManager'

// تحويل من USD إلى AED
const convertedAmount = convertCurrency(100, usdCurrency, aedCurrency)

// تنسيق المبلغ مع رمز العملة
const formatted = formatCurrency(1000, aedCurrency) // "1,000.00 د.إ"
```

#### إضافة عملة جديدة

```typescript
import { addCurrency } from '@/lib/currenciesManager'

const result = await addCurrency({
  code: 'EUR',
  name: 'Euro',
  symbol: '€',
  exchange_rate: 0.25, // 1 AED = 0.25 EUR
  is_default: false,
  is_active: true
})
```

### للمستخدمين

#### الوصول إلى إدارة العملات

1. انتقل إلى **Settings** ⚙️
2. اختر تاب **Currencies** 💰
3. يمكنك:
   - عرض جميع العملات
   - إضافة عملة جديدة
   - تعديل عملة موجودة
   - تحديد العملة الافتراضية
   - حذف عملة

#### إضافة عملة جديدة

1. اضغط على **Add Currency**
2. أدخل:
   - **Currency Code**: 3 أحرف (مثل: EUR, GBP)
   - **Currency Name**: اسم العملة
   - **Symbol**: رمز العملة (مثل: €, £)
   - **Exchange Rate**: سعر الصرف مقابل AED
   - **Set as default**: إذا كنت تريد جعلها الافتراضية

## 🔒 الأمان

### Row Level Security (RLS)

```sql
-- سياسة القراءة (الجميع)
CREATE POLICY "Anyone can view active currencies"
  ON currencies FOR SELECT
  USING (is_active = TRUE);

-- سياسة الإضافة/التعديل/الحذف (المصرح لهم فقط)
CREATE POLICY "Authenticated users can manage currencies"
  ON currencies FOR ALL
  TO authenticated
  USING (TRUE);
```

### صلاحيات المستخدمين

- **Admin & Manager**: الوصول الكامل لإدارة العملات
- **Engineer & Viewer**: القراءة فقط

## 📈 الإحصائيات

### دالة `get_currency_stats()`

```sql
SELECT * FROM get_currency_stats();
```

تعرض:
- رمز العملة
- اسم العملة
- رمز العملة
- عدد المشاريع
- إجمالي قيمة العقود

## 🎯 أفضل الممارسات

1. **استخدم رموز ISO 4217**: 
   - مثل: AED, USD, SAR, EUR
   - معيار عالمي للعملات

2. **حدد سعر الصرف بدقة**:
   - استخدم 6 منازل عشريه للدقة
   - حدث الأسعار بانتظام

3. **لا تحذف العملة الافتراضية**:
   - النظام يمنع حذف العملة الافتراضية
   - يمكن تغيير العملة الافتراضية فقط

4. **تتبع الاستخدام**:
   - راقب usage_count لمعرفة العملات الأكثر استخداماً
   - يساعد في التخطيط المالي

## 🐛 استكشاف الأخطاء

### العملة لا تظهر في القائمة

**الحل:**
- تأكد من أن `is_active = true`
- قم بتحديث الصفحة
- تحقق من الاتصال بـ Supabase

### خطأ عند إضافة عملة جديدة

**الحل:**
- تأكد من عدم وجود عملة بنفس الكود
- تحقق من أن الكود 3 أحرف فقط
- تحقق من صلاحيات المستخدم

### سعر الصرف غير صحيح

**الحل:**
- تأكد من أن السعر مقابل AED
- استخدم 6 منازل عشريه للدقة
- حدث الأسعار بانتظام

## 🔄 التحديثات المستقبلية

### مخطط التطوير
- [ ] تحديث تلقائي لأسعار الصرف
- [ ] ربط مع APIs مالية
- [ ] تقارير مالية تفصيلية
- [ ] تحويل العملات في الوقت الفعلي
- [ ] تاريخ التغييرات (Audit Log)

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك اقتراحات:
1. تحقق من console.log للأخطاء
2. راجع Supabase logs
3. تأكد من تنفيذ SQL Schema بشكل صحيح

---

## 🎉 الخلاصة

تم إضافة نظام إدارة العملات مع:

### ✅ المزايا:
- تحديد تلقائي للعملة الإماراتية (AED)
- دعم العملات المتعددة
- تحويل العملات
- إدارة من الإعدادات
- أمان متقدم مع RLS

### 🚀 جاهز للاستخدام:
- 3 عملات افتراضية
- تحديد تلقائي حسب الموقع
- إمكانية إضافة عملات جديدة
- تحويل وتنسيق المبالغ

**تم التطوير بواسطة:** AI Assistant  
**التاريخ:** 2025-10-07  
**الإصدار:** 1.0.0
