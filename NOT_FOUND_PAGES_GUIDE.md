# 🎨 دليل صفحات 404 الاحترافية - AlRabat RPF

## 📋 نظرة عامة

تم تصميم نظام صفحات 404 احترافي جداً مع تأثيرات بصرية مذهلة وتفاعلية لتحسين تجربة المستخدم عند مواجهة صفحات غير موجودة.

## 🚀 المكونات المتاحة

### 1. **الصفحة الرئيسية (app/not-found.tsx)**
- الصفحة الافتراضية لـ Next.js 404
- تصميم احترافي مع تأثيرات بصرية مذهلة
- تنقل سريع لجميع أقسام التطبيق

### 2. **NotFoundPage (components/ui/NotFoundPage.tsx)**
- مكون قابل لإعادة الاستخدام للصفحات العامة
- قابل للتخصيص بالكامل
- تأثيرات بصرية متقدمة

### 3. **InternalNotFound (components/ui/InternalNotFound.tsx)**
- مخصص للصفحات الداخلية (مشاريع، أنشطة، KPIs، إلخ)
- رسائل مخصصة حسب نوع المورد
- أيقونات مناسبة لكل نوع

## 🎯 الميزات الرئيسية

### ✨ **التأثيرات البصرية**
- **خلفية متدرجة متحركة** - من slate-900 إلى purple-900
- **شبكة متحركة** - تتبع حركة الماوس
- **جسيمات متحركة** - 50 جسيم عشوائي
- **دوائر متحركة** - تأثيرات blur متدرجة
- **تأثيرات اللمعان** - على الأزرار عند التمرير

### 🎨 **التصميم التفاعلي**
- **تتبع الماوس** - الخلفية تتحرك مع الماوس
- **تأثيرات hover** - تكبير ودوران للأزرار
- **انتقالات سلسة** - 300ms لجميع التأثيرات
- **تأثيرات اللمعان** - تمرير الضوء على الأزرار

### 🧭 **التنقل السريع**
- **6 أزرار تنقل سريع** - Dashboard, Projects, KPI, BOQ, Reports, Settings
- **ألوان متدرجة** - كل زر له لون مميز
- **أيقونات تفاعلية** - تكبير عند التمرير
- **تأثيرات متدرجة** - fade-in متتالي

### 🔧 **الإجراءات الرئيسية**
- **Go Back** - العودة للصفحة السابقة
- **Go to Dashboard** - الذهاب للوحة التحكم
- **Refresh Page** - تحديث الصفحة

## 📖 كيفية الاستخدام

### 1. **الصفحة الافتراضية (app/not-found.tsx)**
```typescript
// يتم استخدامها تلقائياً من Next.js
// لا حاجة لاستيراد أو استخدام
```

### 2. **NotFoundPage للصفحات العامة**
```typescript
import { NotFoundPage } from '@/components/ui/NotFoundPage'

export default function Custom404() {
  return (
    <NotFoundPage 
      title="Oops! Something went wrong"
      message="We couldn't find what you're looking for"
      showQuickActions={true}
    />
  )
}
```

### 3. **InternalNotFound للصفحات الداخلية**
```typescript
import { InternalNotFound } from '@/components/ui/InternalNotFound'

// للمشاريع
<InternalNotFound 
  resourceType="project"
  resourceId="P1234"
  title="Project Not Found"
  message="The project you're looking for doesn't exist"
/>

// للأنشطة
<InternalNotFound 
  resourceType="activity"
  resourceId="Excavation Work"
  title="Activity Not Found"
  message="The activity you're looking for doesn't exist"
/>

// للـ KPIs
<InternalNotFound 
  resourceType="kpi"
  resourceId="KPI-001"
  title="KPI Record Not Found"
  message="The KPI record you're looking for doesn't exist"
/>

// للمستخدمين
<InternalNotFound 
  resourceType="user"
  resourceId="john.doe@example.com"
  title="User Not Found"
  message="The user you're looking for doesn't exist"
/>

// للتقارير
<InternalNotFound 
  resourceType="report"
  resourceId="Monthly Report - January 2024"
  title="Report Not Found"
  message="The report you're looking for doesn't exist"
/>
```

### 4. **تخصيص الإجراءات السريعة**
```typescript
import { NotFoundPage } from '@/components/ui/NotFoundPage'

const customActions = [
  { icon: Home, label: 'Home', href: '/', color: 'from-blue-500 to-cyan-500' },
  { icon: Search, label: 'Search', href: '/search', color: 'from-purple-500 to-pink-500' },
  { icon: Settings, label: 'Settings', href: '/settings', color: 'from-yellow-500 to-orange-500' },
]

<NotFoundPage 
  title="Custom 404"
  message="Custom message"
  showQuickActions={true}
  customActions={customActions}
/>
```

## 🎨 الخصائص المتاحة

### **NotFoundPage Props**
```typescript
interface NotFoundPageProps {
  title?: string                    // العنوان المخصص
  message?: string                  // الرسالة المخصصة
  showQuickActions?: boolean        // إظهار أزرار التنقل السريع
  customActions?: Array<{           // إجراءات مخصصة
    icon: React.ComponentType<any>
    label: string
    href: string
    color: string
  }>
}
```

### **InternalNotFound Props**
```typescript
interface InternalNotFoundProps {
  title?: string                    // العنوان المخصص
  message?: string                  // الرسالة المخصصة
  resourceType?: 'project' | 'activity' | 'kpi' | 'user' | 'report' | 'page'
  resourceId?: string               // معرف المورد
  showQuickActions?: boolean        // إظهار أزرار التنقل السريع
}
```

## 🎯 أنواع الموارد المدعومة

### **1. Project (مشروع)**
- **الأيقونة**: FolderX
- **اللون**: from-blue-500 to-cyan-500
- **الرسالة الافتراضية**: "The project you're looking for doesn't exist"

### **2. Activity (نشاط)**
- **الأيقونة**: FileX
- **اللون**: from-purple-500 to-pink-500
- **الرسالة الافتراضية**: "The activity you're looking for doesn't exist"

### **3. KPI (مؤشر أداء)**
- **الأيقونة**: Target
- **اللون**: from-yellow-500 to-orange-500
- **الرسالة الافتراضية**: "The KPI record you're looking for doesn't exist"

### **4. User (مستخدم)**
- **الأيقونة**: Shield
- **اللون**: from-green-500 to-emerald-500
- **الرسالة الافتراضية**: "The user you're looking for doesn't exist"

### **5. Report (تقرير)**
- **الأيقونة**: Rocket
- **اللون**: from-red-500 to-rose-500
- **الرسالة الافتراضية**: "The report you're looking for doesn't exist"

### **6. Page (صفحة)**
- **الأيقونة**: AlertTriangle
- **اللون**: from-indigo-500 to-purple-500
- **الرسالة الافتراضية**: "The page you're looking for doesn't exist"

## 🎨 التأثيرات البصرية

### **1. الخلفية المتحركة**
- شبكة متحركة تتبع الماوس
- جسيمات عشوائية متحركة
- دوائر متدرجة مع تأثير blur

### **2. الرقم 404**
- حجم كبير (12rem - 16rem)
- تدرج لوني من blue إلى purple إلى pink
- تأثير pulse متحرك
- أيقونات متحركة حوله

### **3. الأزرار التفاعلية**
- تأثير hover مع تكبير ودوران
- تأثير اللمعان عند التمرير
- انتقالات سلسة 300ms
- ظلال ملونة عند التمرير

### **4. الرسائل**
- fade-in animation
- أيقونات متحركة
- نصوص متدرجة الألوان

## 🔧 التخصيص المتقدم

### **1. تخصيص الألوان**
```typescript
// يمكن تخصيص الألوان في customActions
const customActions = [
  { 
    icon: Home, 
    label: 'Home', 
    href: '/', 
    color: 'from-red-500 to-pink-500'  // تدرج مخصص
  }
]
```

### **2. تخصيص الرسائل**
```typescript
<InternalNotFound 
  resourceType="project"
  resourceId="P1234"
  title="مشروع غير موجود"  // عنوان مخصص
  message="المشروع الذي تبحث عنه غير موجود أو تم حذفه"  // رسالة مخصصة
/>
```

### **3. إخفاء أزرار التنقل السريع**
```typescript
<NotFoundPage 
  title="Simple 404"
  message="Simple message"
  showQuickActions={false}  // إخفاء أزرار التنقل السريع
/>
```

## 🚀 أفضل الممارسات

### **1. استخدام النوع المناسب**
- استخدم `NotFoundPage` للصفحات العامة
- استخدم `InternalNotFound` للصفحات الداخلية مع تحديد `resourceType`

### **2. تخصيص الرسائل**
- اكتب رسائل واضحة ومفيدة
- أضف معرف المورد إذا كان متاحاً
- استخدم لغة ودية ومطمئنة

### **3. تخصيص الإجراءات**
- أضف إجراءات مفيدة للمستخدم
- رتب الإجراءات حسب الأهمية
- استخدم ألوان مميزة لكل إجراء

### **4. اختبار التأثيرات**
- تأكد من عمل جميع التأثيرات
- اختبر على أجهزة مختلفة
- تأكد من الأداء الجيد

## 🎉 الخلاصة

تم إنشاء نظام صفحات 404 احترافي جداً مع:

- ✅ **تصميم احترافي** - تأثيرات بصرية مذهلة
- ✅ **تفاعلية عالية** - تتبع الماوس وتأثيرات hover
- ✅ **تنقل سريع** - أزرار للوصول السريع لجميع الأقسام
- ✅ **قابلية التخصيص** - رسائل وألوان وإجراءات مخصصة
- ✅ **دعم متعدد** - أنواع مختلفة من الموارد
- ✅ **تجربة مستخدم ممتازة** - رسائل ودية ومطمئنة

**الآن لديك صفحات 404 احترافية جداً تحسن تجربة المستخدم بشكل كبير!** 🎨✨
