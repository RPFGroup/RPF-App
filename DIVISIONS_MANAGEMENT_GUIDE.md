# 🏢 دليل إدارة الأقسام (Divisions Management)

## 📋 نظرة عامة

تم إضافة نظام شامل لإدارة الأقسام (Divisions) في التطبيق مع إمكانية الإضافة والتعديل من خلال Supabase.

## ✨ المزايا الجديدة

### 1. **الأقسام الافتراضية**
- Enabling Division
- Soil Improvement Division
- Infrastructure Division
- Marine Division

### 2. **إدارة كاملة للأقسام**
- ✅ إضافة أقسام جديدة
- ✅ تعديل الأقسام الموجودة
- ✅ حذف (تعطيل) الأقسام
- ✅ البحث والفلترة
- ✅ تتبع عدد الاستخدامات

### 3. **التكامل مع النماذج**
- القائمة المنسدلة في Smart Project Creator
- إمكانية إضافة قسم جديد مباشرة من النموذج
- تحديث تلقائي للقائمة عند إضافة قسم جديد

## 🗄️ البنية التقنية

### الملفات الجديدة

1. **`lib/divisionsManager.ts`**
   - إدارة العمليات مع Supabase
   - دوال للإضافة، التعديل، الحذف، والبحث
   - تتبع عدد استخدام كل قسم

2. **`components/settings/DivisionsManager.tsx`**
   - واجهة مستخدم لإدارة الأقسام
   - نموذج إضافة/تعديل الأقسام
   - عرض الأقسام في شكل بطاقات

3. **`Database/divisions-table-schema.sql`**
   - SQL Schema لجدول الأقسام
   - Row Level Security (RLS)
   - Triggers للتحديث التلقائي

### التحديثات على الملفات الموجودة

1. **`components/projects/IntelligentProjectForm.tsx`**
   - تحميل الأقسام من Supabase
   - إمكانية إضافة قسم جديد من النموذج
   - زيادة عداد الاستخدام عند اختيار قسم

2. **`components/settings/SettingsPage.tsx`**
   - إضافة تاب "Divisions" للمسؤولين والمدراء
   - عرض مكون DivisionsManager

## 📊 هيكل قاعدة البيانات

### جدول `divisions`

```sql
CREATE TABLE divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(10),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### الأعمدة

- **id**: المعرف الفريد (UUID)
- **name**: اسم القسم (مطلوب وفريد)
- **code**: رمز القسم (اختياري، مثل: ENA, SID)
- **description**: وصف القسم (اختياري)
- **is_active**: هل القسم نشط؟ (للحذف الآمن)
- **usage_count**: عدد المشاريع التي تستخدم هذا القسم
- **created_at**: تاريخ الإنشاء
- **updated_at**: تاريخ آخر تحديث

## 🚀 التثبيت والإعداد

### 1. إنشاء جدول الأقسام في Supabase

قم بتشغيل SQL Script في Supabase SQL Editor:

```bash
# افتح Supabase Dashboard
# انتقل إلى SQL Editor
# نفذ محتوى ملف: Database/divisions-table-schema.sql
```

### 2. التحقق من Row Level Security (RLS)

الصلاحيات المضبوطة:
- **القراءة**: جميع المستخدمين (الأقسام النشطة فقط)
- **الإضافة/التعديل/الحذف**: المستخدمون المصرح لهم فقط

## 💻 الاستخدام

### للمطورين

#### جلب جميع الأقسام

```typescript
import { getAllDivisions, getDivisionNames } from '@/lib/divisionsManager'

// جلب جميع بيانات الأقسام
const divisions = await getAllDivisions()

// جلب أسماء الأقسام فقط (للقوائم المنسدلة)
const divisionNames = await getDivisionNames()
```

#### إضافة قسم جديد

```typescript
import { addDivision } from '@/lib/divisionsManager'

const result = await addDivision({
  name: 'New Division',
  code: 'NEW',
  description: 'Description of the division',
  is_active: true
})

if (result.success) {
  console.log('Division added:', result.data)
}
```

#### تحديث قسم

```typescript
import { updateDivision } from '@/lib/divisionsManager'

const result = await updateDivision(divisionId, {
  name: 'Updated Division Name',
  description: 'Updated description'
})
```

#### حذف (تعطيل) قسم

```typescript
import { deleteDivision } from '@/lib/divisionsManager'

const result = await deleteDivision(divisionId)
```

#### تتبع الاستخدام

```typescript
import { incrementDivisionUsage } from '@/lib/divisionsManager'

// يتم استدعاؤها تلقائياً عند إنشاء مشروع جديد
await incrementDivisionUsage('Enabling Division')
```

### للمستخدمين

#### الوصول إلى إدارة الأقسام

1. انتقل إلى **Settings** ⚙️
2. اختر تاب **Divisions** 🏢
3. يمكنك:
   - عرض جميع الأقسام
   - إضافة قسم جديد
   - تعديل قسم موجود
   - حذف قسم

#### إضافة قسم من Smart Project Creator

1. افتح نموذج إنشاء مشروع جديد
2. في حقل **Responsible Division**:
   - ابدأ بكتابة اسم القسم
   - إذا لم يكن موجوداً، ستظهر خيار "➕ Add as new division"
   - اضغط عليه لإضافة القسم مباشرة

## 🔒 الأمان

### Row Level Security (RLS)

```sql
-- سياسة القراءة (الجميع)
CREATE POLICY "Anyone can view active divisions"
  ON divisions FOR SELECT
  USING (is_active = TRUE);

-- سياسة الإضافة/التعديل/الحذف (المصرح لهم فقط)
CREATE POLICY "Authenticated users can manage divisions"
  ON divisions FOR ALL
  TO authenticated
  USING (TRUE);
```

### صلاحيات المستخدمين

- **Admin & Manager**: الوصول الكامل لإدارة الأقسام
- **Engineer & Viewer**: القراءة فقط

## 📈 الإحصائيات

### دالة `get_division_stats()`

```sql
SELECT * FROM get_division_stats();
```

تعرض:
- اسم القسم
- عدد المشاريع
- إجمالي قيمة العقود

## 🎯 أفضل الممارسات

1. **استخدم أكواد قصيرة**: 
   - مثل: ENA, SID, INF, MAR
   - تسهل التعرف السريع

2. **أضف وصف واضح**:
   - يساعد في فهم دور القسم
   - مفيد للمستخدمين الجدد

3. **لا تحذف الأقسام المستخدمة**:
   - النظام يقوم بتعطيلها بدلاً من الحذف
   - يحافظ على البيانات التاريخية

4. **تتبع الاستخدام**:
   - راقب usage_count لمعرفة الأقسام الأكثر استخداماً
   - يساعد في التخطيط والتوزيع

## 🐛 استكشاف الأخطاء

### القسم لا يظهر في القائمة المنسدلة

**الحل:**
- تأكد من أن `is_active = true`
- قم بتحديث الصفحة
- تحقق من الاتصال بـ Supabase

### خطأ عند إضافة قسم جديد

**الحل:**
- تأكد من عدم وجود قسم بنفس الاسم
- تحقق من صلاحيات المستخدم
- راجع RLS Policies في Supabase

### عداد الاستخدام لا يتحدث

**الحل:**
- تأكد من استدعاء `incrementDivisionUsage()`
- تحقق من الـ console للأخطاء
- تأكد من وجود القسم في الجدول

## 🔄 التحديثات المستقبلية

### مخطط التطوير
- [ ] إضافة صلاحيات مخصصة لكل قسم
- [ ] تقارير تفصيلية لكل قسم
- [ ] استيراد/تصدير الأقسام
- [ ] دمج الأقسام
- [ ] تاريخ التغييرات (Audit Log)

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك اقتراحات:
1. تحقق من console.log للأخطاء
2. راجع Supabase logs
3. تأكد من تنفيذ SQL Schema بشكل صحيح

---

**تم التطوير بواسطة:** AI Assistant  
**التاريخ:** 2025-10-07  
**الإصدار:** 1.0.0

