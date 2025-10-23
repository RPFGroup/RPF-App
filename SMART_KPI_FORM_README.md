# Smart KPI Form - فورم KPI الذكي المحسن

## نظرة عامة | Overview

تم تطوير فورم KPI ذكي ومحسن خصيصاً للمهندسين المدنيين لتسجيل أنشطة الموقع بطريقة أكثر ذكاءً وسهولة. هذا الفورم يحسن تجربة المستخدم ويقلل من الأخطاء ويزيد من الكفاءة.

## الميزات الجديدة | New Features

### 🎯 1. تدفق العمل الموجه | Guided Workflow
- **الخطوة الأولى**: اختيار المشروع
- **الخطوة الثانية**: عرض جميع أنشطة المشروع مع حالة الإنجاز
- **الخطوة الثالثة**: تسجيل كل نشاط على حدة مع سؤال "هل تم العمل في هذا النشاط اليوم؟"

### ⚡ 2. التعبئة التلقائية الذكية | Smart Auto-Fill
- **الوحدة (Unit)**: يتم ملؤها تلقائياً من بيانات النشاط
- **القسم (Section)**: يتم ملؤه تلقائياً من قسم النشاط
- **الكمية اليومية**: يتم حسابها تلقائياً من معدل الإنتاجية اليومي
- **التاريخ**: يتم تعيينه تلقائياً لتاريخ اليوم

### 📊 3. تتبع التقدم المرئي | Visual Progress Tracking
- **شريط التقدم**: يوضح نسبة إنجاز الأنشطة
- **حالة الأنشطة**: 
  - 🟢 مكتمل (Completed)
  - 🔵 جاري (Current) 
  - ⚪ في الانتظار (Pending)
- **علامة صح**: تظهر بجوار الأنشطة المكتملة

### ✅ 4. تأكيد العمل البسيط | Simple Work Confirmation
- **سؤال بسيط**: "هل تم العمل في هذا النشاط اليوم؟"
- **خيارين فقط**: نعم أو لا
- **تخطي تلقائي**: إذا لم يتم العمل، يتم تخطي النشاط تلقائياً

### 🚀 5. تحسينات الأداء | Performance Improvements
- **تحميل ذكي**: يتم تحميل البيانات فقط عند الحاجة
- **ذاكرة التخزين المؤقت**: تحسين سرعة الاستجابة
- **واجهة سريعة الاستجابة**: تصميم محسن للهواتف والأجهزة اللوحية

## كيفية الاستخدام | How to Use

### 1. الوصول للفورم | Accessing the Form
```
الطريقة الأولى: من صفحة KPI الرئيسية
1. اذهب إلى صفحة KPI
2. اضغط على زر "Smart Site KPI Form"

الطريقة الثانية: الرابط المباشر
/kpi/smart-form
```

### 2. خطوات التسجيل | Recording Steps

#### الخطوة 1: اختيار المشروع
- ابحث عن المشروع أو اختره من القائمة
- سيتم تحميل جميع أنشطة المشروع تلقائياً

#### الخطوة 2: مراجعة الأنشطة
- ستظهر جميع أنشطة المشروع مع حالتها
- الأنشطة المكتملة تظهر بعلامة صح خضراء
- النشاط الحالي يظهر بلون أزرق

#### الخطوة 3: تسجيل كل نشاط
- اضغط على النشاط المطلوب
- أجب على السؤال: "هل تم العمل في هذا النشاط اليوم؟"
- إذا كانت الإجابة "نعم":
  - املأ الكمية (سيتم ملؤها تلقائياً)
  - راجع باقي البيانات
  - اضغط "Complete Activity"
- إذا كانت الإجابة "لا":
  - اضغط "Skip Activity" للانتقال للنشاط التالي

### 3. الميزات الذكية | Smart Features

#### التعبئة التلقائية للبيانات
```typescript
// مثال على التعبئة التلقائية
const autoFillData = {
  unit: activity.unit,                    // الوحدة من بيانات النشاط
  section: activity.activity_division,    // القسم من بيانات النشاط  
  quantity: activity.productivity_daily_rate, // الكمية من المعدل اليومي
  date: new Date().toISOString().split('T')[0] // تاريخ اليوم
}
```

#### حساب التقدم
```typescript
// حساب نسبة الإنجاز
const progressPercentage = Math.round(
  (completedActivities.size / projectActivities.length) * 100
)
```

## المكونات التقنية | Technical Components

### 1. الملفات الرئيسية | Main Files
- `components/kpi/EnhancedSmartActualKPIForm.tsx` - الفورم المحسن
- `app/(authenticated)/kpi/smart-form/page.tsx` - صفحة الفورم المخصصة
- `components/kpi/KPITracking.tsx` - تحديث صفحة KPI الرئيسية

### 2. الحالات (States) | States
```typescript
// حالات تدفق العمل
const [currentStep, setCurrentStep] = useState<'project' | 'activities' | 'form'>('project')

// بيانات المشروع والأنشطة
const [selectedProject, setSelectedProject] = useState<Project | null>(null)
const [projectActivities, setProjectActivities] = useState<ActivityWithStatus[]>([])

// تتبع التقدم
const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set())
const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
```

### 3. الواجهات (Interfaces) | Interfaces
```typescript
interface ActivityWithStatus extends BOQActivity {
  isCompleted: boolean
  hasWorkToday: boolean
  kpiData?: any
}
```

## التحسينات المطبقة | Applied Improvements

### 1. تحسين تجربة المستخدم | UX Improvements
- ✅ واجهة خطوة بخطوة واضحة
- ✅ رسائل تأكيد بصرية
- ✅ ألوان مميزة لكل حالة
- ✅ تصميم متجاوب للهواتف

### 2. تحسين الأداء | Performance Improvements
- ✅ تحميل البيانات عند الحاجة فقط
- ✅ حفظ الحالة أثناء التنقل
- ✅ تحديث فوري للواجهة

### 3. تقليل الأخطاء | Error Reduction
- ✅ التحقق من صحة البيانات
- ✅ رسائل خطأ واضحة
- ✅ منع الإرسال بدون بيانات مطلوبة

## الاستخدام المتقدم | Advanced Usage

### 1. تخصيص الفورم | Customizing the Form
```typescript
// إضافة حقول مخصصة
const customFields = {
  weather: 'sunny',      // حالة الطقس
  team_size: 5,          // حجم الفريق
  equipment: 'crane'      // المعدات المستخدمة
}
```

### 2. تصدير البيانات | Data Export
```typescript
// تصدير تقرير الأنشطة المكتملة
const exportCompletedActivities = () => {
  const completed = projectActivities.filter(a => completedActivities.has(a.id))
  // تصدير البيانات...
}
```

## استكشاف الأخطاء | Troubleshooting

### 1. مشاكل شائعة | Common Issues

#### المشكلة: لا تظهر الأنشطة
**الحل**: تأكد من أن المشروع المختار يحتوي على أنشطة في قاعدة البيانات

#### المشكلة: التعبئة التلقائية لا تعمل
**الحل**: تأكد من وجود بيانات المعدل اليومي في جدول الأنشطة

#### المشكلة: لا يتم حفظ البيانات
**الحل**: تأكد من وجود صلاحيات إنشاء KPI

### 2. رسائل الخطأ | Error Messages
- `"Please select a project"` - اختر مشروع أولاً
- `"Please enter a valid quantity"` - أدخل كمية صحيحة
- `"Activity not found"` - النشاط غير موجود

## التطوير المستقبلي | Future Development

### 1. ميزات مخططة | Planned Features
- 📱 تطبيق جوال مخصص
- 🔄 مزامنة أوفلاين
- 📊 تحليلات متقدمة
- 🤖 ذكاء اصطناعي للمساعدة

### 2. تحسينات مقترحة | Suggested Improvements
- إضافة صور للأنشطة
- تسجيل صوتي للملاحظات
- ربط مع خرائط الموقع
- تقارير تلقائية

## الدعم والمساعدة | Support

### 1. التواصل | Contact
- 📧 البريد الإلكتروني: support@alrabat.com
- 📞 الهاتف: +966 XX XXX XXXX
- 💬 الدردشة المباشرة: متاحة في التطبيق

### 2. التدريب | Training
- 📚 دليل المستخدم: متوفر في التطبيق
- 🎥 فيديوهات تعليمية: قريباً
- 🏢 ورش عمل: حسب الطلب

---

**تم تطوير هذا الفورم خصيصاً لتحسين تجربة المهندسين المدنيين في تسجيل أنشطة الموقع بطريقة أكثر ذكاءً وكفاءة.**

*Smart KPI Form - Developed for Enhanced Civil Engineering Site Activity Recording*
