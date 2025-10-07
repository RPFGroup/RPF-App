# 📁 دليل إدارة أنواع المشاريع (Project Types Management)

## 📋 نظرة عامة

تم إضافة نظام شامل لإدارة أنواع المشاريع (Project Types) في Supabase مع إمكانية الإضافة والتعديل، تماماً مثل نظام الأقسام.

## ✨ المزايا الجديدة

### 1. **أنواع المشاريع الافتراضية (10 أنواع)**
- Infrastructure (INF)
- Building Construction (BLD)
- Road Construction (RD)
- Marine Works (MAR)
- Landscaping (LND)
- Maintenance (MNT)
- Enabling Division (ENA)
- Soil Improvement Division (SID)
- Infrastructure Division (IDV)
- Marine Division (MDV)

### 2. **إدارة كاملة لأنواع المشاريع**
- ✅ إضافة أنواع جديدة
- ✅ تعديل الأنواع الموجودة
- ✅ حذف (تعطيل) الأنواع
- ✅ البحث والفلترة
- ✅ تتبع عدد الاستخدامات

### 3. **التكامل مع النماذج**
- القائمة المنسدلة في Smart Project Creator
- إمكانية إضافة نوع جديد مباشرة من النموذج
- تحديث تلقائي للقائمة عند إضافة نوع جديد

## 🗄️ البنية التقنية

### الملفات الجديدة

1. **`lib/projectTypesManager.ts`**
   - إدارة العمليات مع Supabase
   - دوال للإضافة، التعديل، الحذف، والبحث
   - تتبع عدد استخدام كل نوع

2. **`components/settings/ProjectTypesManager.tsx`**
   - واجهة مستخدم لإدارة أنواع المشاريع
   - نموذج إضافة/تعديل الأنواع
   - عرض الأنواع في شكل بطاقات

3. **`Database/project-types-table-schema.sql`**
   - SQL Schema لجدول أنواع المشاريع
   - Row Level Security (RLS)
   - Triggers للتحديث التلقائي

### التحديثات على الملفات الموجودة

1. **`components/projects/IntelligentProjectForm.tsx`**
   - تحميل أنواع المشاريع من Supabase
   - إمكانية إضافة نوع جديد من النموذج
   - زيادة عداد الاستخدام عند اختيار نوع

2. **`components/settings/SettingsPage.tsx`**
   - إضافة تاب "Project Types" للمسؤولين والمدراء
   - عرض مكون ProjectTypesManager

## 📊 هيكل قاعدة البيانات

### جدول `project_types`

```sql
CREATE TABLE project_types (
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
- **name**: اسم نوع المشروع (مطلوب وفريد)
- **code**: رمز النوع (اختياري، مثل: INF, BLD)
- **description**: وصف النوع (اختياري)
- **is_active**: هل النوع نشط؟ (للحذف الآمن)
- **usage_count**: عدد المشاريع التي تستخدم هذا النوع
- **created_at**: تاريخ الإنشاء
- **updated_at**: تاريخ آخر تحديث

## 🚀 التثبيت والإعداد

### 1. إنشاء جدول أنواع المشاريع في Supabase

قم بتشغيل SQL Script في Supabase SQL Editor:

```bash
# افتح Supabase Dashboard
# انتقل إلى SQL Editor
# نفذ محتوى ملف: Database/project-types-table-schema.sql
```

### 2. التحقق من Row Level Security (RLS)

الصلاحيات المضبوطة:
- **القراءة**: جميع المستخدمين (الأنواع النشطة فقط)
- **الإضافة/التعديل/الحذف**: المستخدمون المصرح لهم فقط

## 💻 الاستخدام

### للمطورين

#### جلب جميع أنواع المشاريع

```typescript
import { getAllProjectTypes, getProjectTypeNames } from '@/lib/projectTypesManager'

// جلب جميع بيانات الأنواع
const types = await getAllProjectTypes()

// جلب أسماء الأنواع فقط (للقوائم المنسدلة)
const typeNames = await getProjectTypeNames()
```

#### إضافة نوع جديد

```typescript
import { addProjectType } from '@/lib/projectTypesManager'

const result = await addProjectType({
  name: 'New Project Type',
  code: 'NEW',
  description: 'Description of the project type',
  is_active: true
})

if (result.success) {
  console.log('Project type added:', result.data)
}
```

#### تحديث نوع

```typescript
import { updateProjectType } from '@/lib/projectTypesManager'

const result = await updateProjectType(typeId, {
  name: 'Updated Project Type Name',
  description: 'Updated description'
})
```

#### حذف (تعطيل) نوع

```typescript
import { deleteProjectType } from '@/lib/projectTypesManager'

const result = await deleteProjectType(typeId)
```

#### تتبع الاستخدام

```typescript
import { incrementProjectTypeUsage } from '@/lib/projectTypesManager'

// يتم استدعاؤها تلقائياً عند إنشاء مشروع جديد
await incrementProjectTypeUsage('Infrastructure')
```

### للمستخدمين

#### الوصول إلى إدارة أنواع المشاريع

1. انتقل إلى **Settings** ⚙️
2. اختر تاب **Project Types** 📁
3. يمكنك:
   - عرض جميع الأنواع
   - إضافة نوع جديد
   - تعديل نوع موجود
   - حذف نوع

#### إضافة نوع من Smart Project Creator

1. افتح نموذج إنشاء مشروع جديد
2. في حقل **Project Type**:
   - ابدأ بكتابة اسم النوع
   - إذا لم يكن موجوداً، ستظهر خيار "➕ Add as new project type"
   - اضغط عليه لإضافة النوع مباشرة

## 🔒 الأمان

### Row Level Security (RLS)

```sql
-- سياسة القراءة (الجميع)
CREATE POLICY "Anyone can view active project types"
  ON project_types FOR SELECT
  USING (is_active = TRUE);

-- سياسة الإضافة/التعديل/الحذف (المصرح لهم فقط)
CREATE POLICY "Authenticated users can manage project types"
  ON project_types FOR ALL
  TO authenticated
  USING (TRUE);
```

### صلاحيات المستخدمين

- **Admin & Manager**: الوصول الكامل لإدارة أنواع المشاريع
- **Engineer & Viewer**: القراءة فقط

## 📈 الإحصائيات

### دالة `get_project_type_stats()`

```sql
SELECT * FROM get_project_type_stats();
```

تعرض:
- اسم نوع المشروع
- عدد المشاريع
- إجمالي قيمة العقود

## 🎯 أفضل الممارسات

1. **استخدم أكواد قصيرة**: 
   - مثل: INF, BLD, RD, MAR
   - تسهل التعرف السريع

2. **أضف وصف واضح**:
   - يساعد في فهم دور النوع
   - مفيد للمستخدمين الجدد

3. **لا تحذف الأنواع المستخدمة**:
   - النظام يقوم بتعطيلها بدلاً من الحذف
   - يحافظ على البيانات التاريخية

4. **تتبع الاستخدام**:
   - راقب usage_count لمعرفة الأنواع الأكثر استخداماً
   - يساعد في التخطيط والتوزيع

## 🐛 استكشاف الأخطاء

### النوع لا يظهر في القائمة المنسدلة

**الحل:**
- تأكد من أن `is_active = true`
- قم بتحديث الصفحة
- تحقق من الاتصال بـ Supabase

### خطأ عند إضافة نوع جديد

**الحل:**
- تأكد من عدم وجود نوع بنفس الاسم
- تحقق من صلاحيات المستخدم
- راجع RLS Policies في Supabase

### عداد الاستخدام لا يتحدث

**الحل:**
- تأكد من استدعاء `incrementProjectTypeUsage()`
- تحقق من الـ console للأخطاء
- تأكد من وجود النوع في الجدول

## 🔄 التحديثات المستقبلية

### مخطط التطوير
- [ ] إضافة صلاحيات مخصصة لكل نوع
- [ ] تقارير تفصيلية لكل نوع
- [ ] استيراد/تصدير الأنواع
- [ ] دمج الأنواع
- [ ] تاريخ التغييرات (Audit Log)

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك اقتراحات:
1. تحقق من console.log للأخطاء
2. راجع Supabase logs
3. تأكد من تنفيذ SQL Schema بشكل صحيح

---

## 🎉 الخلاصة

تم إضافة نظام إدارة أنواع المشاريع بنفس جودة نظام الأقسام:

### ✅ المزايا:
- إدارة كاملة في Supabase
- واجهة مستخدم حديثة
- تكامل مع Smart Project Creator
- تتبع الاستخدام والإحصائيات
- أمان متقدم مع RLS

### 🚀 جاهز للاستخدام:
- 6 أنواع افتراضية
- إمكانية إضافة أنواع جديدة
- إدارة من الإعدادات
- تكامل كامل مع النظام

**تم التطوير بواسطة:** AI Assistant  
**التاريخ:** 2025-10-07  
**الإصدار:** 1.0.0
