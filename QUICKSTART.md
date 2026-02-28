# ⚡ QUICK START GUIDE - Emjay Admin Frontend

## 🎯 **Get Running in 5 Minutes**

### **Step 1: Install Dependencies**
```bash
cd emjay-admin-frontend
npm install
```

### **Step 2: Configure Environment**
```bash
cp .env.example .env
```

Your `.env` should contain:
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### **Step 3: Start Development Server**
```bash
npm run dev
```

### **Step 4: Access the Dashboard**
Open your browser to: `http://localhost:3000`

**Default Login Credentials** (from your backend):
- Email: `admin@emjay.com`
- Password: `Admin123!@#`

---

## 📦 **What's Included**

### ✅ **Complete Setup:**
- React 18 + Vite + TypeScript
- Tailwind CSS with Emjay brand colors
- React Router with protected routes
- Axios API client with auth interceptors
- Zustand for auth state
- React Query for server state
- Complete folder structure

### ✅ **Ready-to-Use Components:**
- Button, Card, Input, Label
- Sidebar navigation
- Header with search and profile
- Login page (functional)
- Dashboard layout
- Home page (placeholder)

### ✅ **Pre-configured:**
- Path aliases (`@/`)
- TypeScript types
- API client with interceptors
- Auth store with persistence
- Utility functions (formatCurrency, formatDate)
- Tailwind with Emjay colors

---

## 🏗️ **Project Structure Quick Reference**

```
src/
├── components/
│   ├── ui/              👉 Reusable UI components
│   ├── layout/          👉 Sidebar, Header, Layout
│   └── [feature]/       👉 Feature-specific components
├── pages/
│   ├── auth/            👉 Login, Register, etc.
│   └── [feature]/       👉 Feature pages
├── lib/
│   ├── api-client.ts    👉 Axios with auth
│   └── utils.ts         👉 Helper functions
├── types/               👉 TypeScript types
├── store/               👉 Zustand stores
└── api/                 👉 API service functions
```

---

## 🚀 **Common Commands**

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run linter
```

---

## 🎨 **Brand Colors**

```tsx
// Use in your components:
className="bg-primary"        // #6B1B3D (Burgundy)
className="bg-accent"         // #DC143C (Crimson)
className="text-primary"
className="hover:bg-primary/90"
```

---

## 🔧 **Next Development Steps**

### **Immediate (Phase 2 - Products):**

1. **Create Products Page:**
```bash
touch src/pages/products/ProductsPage.tsx
```

2. **Create Product Grid Component:**
```bash
touch src/components/products/ProductGrid.tsx
```

3. **Create Product API Service:**
```bash
touch src/api/products.api.ts
```

4. **Add Route in App.tsx:**
```tsx
<Route path="/products" element={<ProductsPage />} />
```

5. **Update Sidebar:**
Add Products link to navigation

---

## 📚 **Key Files to Know**

| File | Purpose |
|------|---------|
| `src/App.tsx` | Router configuration |
| `src/lib/api-client.ts` | API configuration |
| `src/store/auth.store.ts` | Authentication state |
| `src/types/index.ts` | TypeScript types |
| `src/components/layout/Sidebar.tsx` | Navigation |
| `tailwind.config.js` | Theme colors |

---

## 🐛 **Troubleshooting**

### **API Connection Issues:**
```bash
# Ensure backend is running on port 8080
cd ../emjay-stores-backend-spring
./gradlew bootRun
```

### **Port Already in Use:**
```bash
# Change port in vite.config.ts
server: {
  port: 3001, // Change this
}
```

### **TypeScript Errors:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## ✨ **Tips**

1. **Use @ imports:**
   ```tsx
   import { Button } from '@/components/ui/button';
   // NOT: import { Button } from '../../../components/ui/button';
   ```

2. **Format currency:**
   ```tsx
   import { formatCurrency } from '@/lib/utils';
   formatCurrency(150000); // ₦150,000
   ```

3. **Check auth state:**
   ```tsx
   const { user, isAuthenticated } = useAuthStore();
   ```

4. **Make API calls:**
   ```tsx
   const { data } = useQuery({
     queryKey: ['products'],
     queryFn: () => apiClient.get('/inventory/products'),
   });
   ```

---

## 🎯 **Ready to Build!**

Your starter project is complete with:
- ✅ Modern tech stack
- ✅ Production-ready architecture
- ✅ Emjay branding
- ✅ Type safety
- ✅ API integration
- ✅ Authentication
- ✅ Routing

**Start building Phase 2 (Products) whenever you're ready!** 🚀

---

## 📞 **Need Help?**

Check the full README.md for:
- Detailed component examples
- API integration patterns
- State management guide
- Development workflows
