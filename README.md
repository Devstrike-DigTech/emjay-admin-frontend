# 🎨 Emjay Admin Dashboard - Frontend

A modern, production-ready admin dashboard built with React, TypeScript, and Tailwind CSS.

## 📋 **Table of Contents**

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Development Guide](#development-guide)
- [Component Library](#component-library)
- [API Integration](#api-integration)
- [State Management](#state-management)

---

## 🚀 **Tech Stack**

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components (shadcn/ui inspired)
- **Routing:** React Router v6
- **State Management:** Zustand
- **Server State:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Utilities:** date-fns

---

## 📁 **Project Structure**

```
emjay-admin-frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base UI components (Button, Card, Input, etc.)
│   │   ├── layout/         # Layout components (Sidebar, Header, etc.)
│   │   ├── products/       # Product-specific components
│   │   ├── services/       # Service-specific components
│   │   ├── analytics/      # Analytics/chart components
│   │   ├── staff/          # Staff management components
│   │   └── shared/         # Shared/common components
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── products/       # Product management pages
│   │   ├── services/       # Service management pages
│   │   ├── analytics/      # Analytics pages
│   │   ├── finance/        # Finance pages
│   │   ├── staff/          # Staff management pages
│   │   └── settings/       # Settings pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and helpers
│   │   ├── api-client.ts   # Axios instance with interceptors
│   │   └── utils.ts        # Utility functions
│   ├── api/                # API service functions
│   ├── types/              # TypeScript type definitions
│   ├── store/              # Zustand stores
│   │   └── auth.store.ts   # Authentication store
│   ├── assets/             # Static assets
│   ├── App.tsx             # Main App component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Public static files
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── .env.example            # Environment variables template
```

---

## 🏁 **Getting Started**

### **Prerequisites**

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8080`

### **Installation**

1. **Clone or navigate to the project:**
   ```bash
   cd emjay-admin-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

---

## 📜 **Available Scripts**

```bash
# Development
npm run dev          # Start dev server on port 3000

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

---

## 🛠️ **Development Guide**

### **Creating a New Page**

1. Create file in `src/pages/[section]/PageName.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Sidebar.tsx`

**Example:**
```tsx
// src/pages/products/ProductsPage.tsx
export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
    </div>
  );
}

// src/App.tsx - Add route
<Route path="/products" element={<ProductsPage />} />

// src/components/layout/Sidebar.tsx - Add nav item
{ name: 'Products', href: '/products', icon: Package }
```

### **Creating a New Component**

```tsx
// src/components/products/ProductCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardContent>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </CardContent>
    </Card>
  );
}
```

### **Making API Calls**

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types';

// Fetch data
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.get<Product[]>('/inventory/products'),
  });
}

// Mutate data
function useCreateProduct() {
  return useMutation({
    mutationFn: (data: CreateProductRequest) => 
      apiClient.post('/inventory/products', data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Usage in component
function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const createMutation = useCreateProduct();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## 🎨 **Component Library**

### **Available UI Components**

All components are in `src/components/ui/`:

- **Button** - Primary, secondary, outline, ghost variants
- **Card** - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Input** - Text input field
- **Label** - Form labels

### **Usage Examples**

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### **Adding More Components**

To add more UI components (Select, Dialog, Dropdown, etc.), you can:

1. Use [shadcn/ui](https://ui.shadcn.com/) - Copy component code
2. Or create custom components following the existing pattern

---

## 🔌 **API Integration**

### **API Client Configuration**

The API client is configured in `src/lib/api-client.ts`:

- Base URL from environment variable
- Auto-adds auth token to requests
- Handles 401 errors (auto logout)
- TypeScript support

### **Creating API Service Functions**

```tsx
// src/api/products.api.ts
import { apiClient } from '@/lib/api-client';
import { Product, CreateProductRequest } from '@/types';

export const productsApi = {
  getAll: () => apiClient.get<Product[]>('/inventory/products'),
  
  getById: (id: string) => apiClient.get<Product>(`/inventory/products/${id}`),
  
  create: (data: CreateProductRequest) => 
    apiClient.post<Product>('/inventory/products', data),
  
  update: (id: string, data: Partial<Product>) => 
    apiClient.put<Product>(`/inventory/products/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/inventory/products/${id}`),
};
```

---

## 💾 **State Management**

### **Authentication State (Zustand)**

```tsx
import { useAuthStore } from '@/store/auth.store';

function Component() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome {user?.firstName}</p>
      ) : (
        <button onClick={() => login(userData, token)}>Login</button>
      )}
    </div>
  );
}
```

### **Server State (React Query)**

Server state is managed by TanStack Query automatically:
- Caching
- Background refetching
- Optimistic updates
- Error handling

---

## 🎨 **Design System (Emjay Brand)**

### **Colors**

```tsx
// Primary (Burgundy)
bg-primary         // #6B1B3D
text-primary

// Accent (Crimson)
bg-accent          // #DC143C
text-accent

// Usage in components
<Button className="bg-primary hover:bg-primary/90">
  Click me
</Button>
```

### **Typography**

- Headings: `text-2xl font-bold`
- Body: `text-sm`
- Muted: `text-muted-foreground`

---

## 📝 **Utilities**

### **Format Currency (Nigerian Naira)**

```tsx
import { formatCurrency } from '@/lib/utils';

formatCurrency(150000); // "₦150,000"
```

### **Format Dates**

```tsx
import { formatDate, formatDateTime } from '@/lib/utils';

formatDate(new Date()); // "February 27, 2026"
formatDateTime(new Date()); // "Feb 27, 2026, 02:30 PM"
```

### **Merge ClassNames**

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)}>
```

---

## 🔒 **Authentication**

### **Protected Routes**

Routes are automatically protected. Unauthenticated users are redirected to `/login`.

### **Login Flow**

1. User submits credentials
2. API returns token + user data
3. Token stored in localStorage
4. User redirected to dashboard
5. Token auto-added to all API requests

---

## 🚧 **Next Steps**

### **Phase 1 (Current):**
- ✅ Project setup
- ✅ Authentication
- ✅ Basic layout
- ✅ Routing

### **Phase 2 (Next):**
- [ ] Product management pages
- [ ] Product grid/list views
- [ ] Add/Edit product forms
- [ ] Image upload
- [ ] Stock management

---

## 📚 **Resources**

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

---

## 🤝 **Contributing**

Follow these guidelines when adding new features:

1. Create components in appropriate folders
2. Use TypeScript for type safety
3. Follow existing naming conventions
4. Add proper comments for complex logic
5. Keep components small and focused

---

## 📄 **License**

Private project for Emjay.

---

**Happy Coding! 🚀**
