# 🔄 دليل تكامل نظام التسجيل مع بيانات المستخدم

## 🎯 نظرة عامة

تم إنشاء نظام تكامل كامل بين صفحة التسجيل (Signup) وبيانات المستخدم في قاعدة البيانات، حيث يتم نسخ البيانات تلقائياً من `auth.users` إلى `public.users` فور التسجيل.

---

## 🔧 كيف يعمل النظام

### 1️⃣ **المستخدم يسجل حساب جديد:**
```
📝 صفحة التسجيل (app/register/page.tsx)
   ↓
   يملأ: الاسم الأول، الاسم الأخير، البريد، كلمة المرور، الهاتف
   ↓
🔐 يُحفظ في auth.users.raw_user_meta_data
```

### 2️⃣ **Trigger تلقائي ينسخ البيانات:**
```
🔄 Trigger: on_auth_user_created
   ↓
   يقرأ من: auth.users.raw_user_meta_data
   ↓
📊 ينسخ إلى: public.users
   (first_name, last_name, full_name, phone_1, email, role)
```

### 3️⃣ **Modal إكمال البيانات يظهر:**
```
🚪 المستخدم يدخل للنظام أول مرة
   ↓
✅ يتحقق النظام: هل البيانات كاملة؟
   ↓
❌ ناقص: القسم، المسمى الوظيفي
   ↓
📋 Modal يظهر: "Complete Your Profile"
   ↓
👤 المستخدم يكمل بياناته
   ↓
✅ يحصل على الوصول الكامل
```

---

## 📁 الملفات المسؤولة

### 1. **صفحة التسجيل**
**الملف:** `app/register/page.tsx`

**الحقول المُجمّعة:**
```javascript
{
  firstName: '',      // → first_name
  lastName: '',       // → last_name
  email: '',          // → email
  password: '',       // (في auth فقط)
  phone: '',          // → phone_1
  company: '',        // (اختياري - حالياً غير مستخدم)
}
```

**ما يُحفظ في auth.users:**
```javascript
supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      full_name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      role: 'viewer'
    }
  }
})
```

---

### 2. **SQL Trigger**
**الملف:** `Database/user-signup-trigger.sql`

**الوظائف:**

#### أ) `handle_new_user()` - عند إنشاء حساب جديد
```sql
-- يقرأ من auth.users.raw_user_meta_data
-- ينسخ إلى public.users
INSERT INTO public.users (
    id, email, first_name, last_name, 
    full_name, phone_1, role
)
```

#### ب) `sync_user_metadata()` - عند تحديث البيانات
```sql
-- يزامن أي تغيير في auth.users مع public.users
UPDATE public.users SET ...
WHERE id = NEW.id
```

---

### 3. **Modal إكمال البيانات**
**الملف:** `components/auth/ProfileCompletionModal.tsx`

**الحقول المطلوبة:**
- ✅ الاسم الأول (موجود من التسجيل)
- ✅ الاسم الأخير (موجود من التسجيل)
- ❌ **القسم** (يُطلب من المستخدم)
- ❌ **المسمى الوظيفي** (يُطلب من المستخدم)
- ✅ رقم الهاتف الأساسي (موجود من التسجيل)

**الحقول الاختيارية:**
- رقم الهاتف الثانوي
- نبذة عني

---

### 4. **Profile Completion Guard**
**الملف:** `lib/profileCompletionGuard.ts`

**يتحقق من:**
```typescript
const requiredFields = [
  'first_name',    // ✅ من التسجيل
  'last_name',     // ✅ من التسجيل
  'department_id', // ❌ يحتاج إكمال
  'job_title_id',  // ❌ يحتاج إكمال
  'phone_1'        // ✅ من التسجيل
]
```

---

## 🔄 سير العمل الكامل

### السيناريو 1: مستخدم جديد
```
1. 📝 يملأ صفحة التسجيل
   ├─ الاسم الأول: محمد
   ├─ الاسم الأخير: أحمد
   ├─ البريد: mohamed@example.com
   ├─ كلمة المرور: ******
   └─ الهاتف: +966 50 123 4567

2. 🔐 يُحفظ في auth.users.raw_user_meta_data
   {
     "first_name": "محمد",
     "last_name": "أحمد",
     "full_name": "محمد أحمد",
     "phone": "+966 50 123 4567",
     "role": "viewer"
   }

3. 🔄 Trigger ينسخ إلى public.users
   ├─ first_name: "محمد"
   ├─ last_name: "أحمد"
   ├─ full_name: "محمد أحمد"
   ├─ phone_1: "+966 50 123 4567"
   ├─ email: "mohamed@example.com"
   ├─ role: "viewer"
   ├─ department_id: NULL ❌
   └─ job_title_id: NULL ❌

4. ✅ يتحقق من البريد الإلكتروني

5. 🚪 يدخل للنظام أول مرة

6. ✅ Profile Completion Guard يتحقق
   ├─ first_name ✅
   ├─ last_name ✅
   ├─ department_id ❌ (ناقص!)
   ├─ job_title_id ❌ (ناقص!)
   └─ phone_1 ✅

7. 📋 Modal يظهر: "Complete Your Profile"
   ├─ الاسم الأول: محمد (read-only)
   ├─ الاسم الأخير: أحمد (read-only)
   ├─ البريد: mohamed@example.com (read-only)
   ├─ الهاتف: +966 50 123 4567 (read-only)
   ├─ 🔽 القسم: [يختار من القائمة]
   └─ 🔽 المسمى الوظيفي: [يختار من القائمة]

8. 👤 يملأ البيانات الناقصة

9. ✅ يحصل على الوصول الكامل للنظام
```

---

## ⚙️ التثبيت والإعداد

### 1️⃣ **تنفيذ SQL Trigger:**
```bash
# في Supabase SQL Editor
# نفذ الملف:
Database/user-signup-trigger.sql
```

**ماذا سيحدث:**
- ✅ يُنشئ `handle_new_user()` function
- ✅ يُنشئ `sync_user_metadata()` function
- ✅ يُنشئ `on_auth_user_created` trigger
- ✅ يُنشئ `on_auth_user_updated` trigger

---

### 2️⃣ **تأكد من البيانات الافتراضية:**
```bash
# تأكد من تنفيذ:
Database/profile-enhancement-tables.sql  # الأساس
Database/update-departments-job-titles.sql  # (اختياري) للمزيد من المسميات
```

---

### 3️⃣ **اختبر النظام:**
```
1. سجل حساب جديد من /register
2. تحقق من البريد الإلكتروني
3. سجل دخول
4. شاهد Modal إكمال البيانات
5. اختر القسم والمسمى الوظيفي
6. اضغط "Complete Profile"
7. استمتع بالنظام! 🎉
```

---

## 🔍 التحقق من التكامل

### 1. **تحقق من البيانات في auth.users:**
```sql
SELECT 
    id,
    email,
    raw_user_meta_data->>'first_name' as first_name,
    raw_user_meta_data->>'last_name' as last_name,
    raw_user_meta_data->>'phone' as phone,
    raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'test@example.com';
```

### 2. **تحقق من البيانات في public.users:**
```sql
SELECT 
    id,
    email,
    first_name,
    last_name,
    full_name,
    phone_1,
    department_id,
    job_title_id,
    role,
    created_at
FROM public.users
WHERE email = 'test@example.com';
```

### 3. **تحقق من Trigger:**
```sql
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated');
```

---

## 🎯 النتيجة النهائية

### ما يحدث الآن:

1. ✅ **التسجيل يحفظ البيانات الأساسية**
   - الاسم الأول والأخير
   - البريد الإلكتروني
   - رقم الهاتف

2. ✅ **Trigger ينسخ البيانات تلقائياً**
   - من `auth.users` إلى `public.users`
   - فوراً عند التسجيل

3. ✅ **Modal يطلب البيانات الناقصة**
   - القسم
   - المسمى الوظيفي
   - (اختياري) رقم هاتف ثاني
   - (اختياري) نبذة عني

4. ✅ **النظام يتحقق من اكتمال البيانات**
   - قبل السماح بالوصول
   - يظهر Modal إذا ناقص
   - يمنع الوصول حتى الإكمال

---

## 🚀 المميزات

### للمستخدم:
- ✅ تسجيل سريع (فقط البيانات الأساسية)
- ✅ إكمال البيانات خطوة بخطوة
- ✅ واجهة سهلة وواضحة

### للنظام:
- ✅ تكامل تلقائي كامل
- ✅ لا حاجة لتدخل يدوي
- ✅ بيانات منظمة ومتسقة
- ✅ أمان عالي

### للأدمن:
- ✅ كل المستخدمين لديهم بيانات كاملة
- ✅ سهولة المتابعة والإدارة
- ✅ إحصائيات دقيقة

---

## ✅ الخلاصة

**النظام الآن متكامل بالكامل:**

```
📝 صفحة التسجيل
    ↓
🔐 auth.users
    ↓
🔄 Trigger (تلقائي)
    ↓
📊 public.users
    ↓
✅ Profile Completion Guard
    ↓
📋 Modal إكمال البيانات
    ↓
🎉 نظام كامل جاهز!
```

**كل شيء يعمل تلقائياً!** 🚀
