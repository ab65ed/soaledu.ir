/**
 * Auth Store - مدیریت احراز هویت با Zustand
 * مدیریت JWT، نقش کاربر، و وضعیت لاگین
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/services/api';

// انواع نقش‌های کاربری
export type UserRole = 'admin' | 'learner' | 'support' | 'expert' | 'designer';

// رابط وضعیت احراز هویت
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // اکشن‌ها
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  
  // هلپرها
  hasRole: (role: UserRole) => boolean;
  getUserRole: () => UserRole | null;
  canAccessRoute: (route: string) => boolean;
}

// مسیرهای مجاز برای هر نقش
const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: ['/admin', '/course-exam', '/questions', '/test-exams', '/contact'],
  designer: ['/designer', '/course-exam', '/questions', '/test-exams'],
  learner: ['/learner', '/course-exam', '/test-exams', '/blog', '/contact'],
  expert: ['/expert', '/questions', '/course-exam', '/test-exams'],
  support: ['/support', '/contact', '/test-exams', '/blog'],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user: User) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string) => {
        set({ token });
        // ذخیره توکن در localStorage برای API calls
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },

      login: (user: User, token: string) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        });
        // ذخیره توکن در localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
        // پاک کردن توکن از localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // بررسی نقش کاربر
      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },

      // دریافت نقش کاربر
      getUserRole: () => {
        const { user } = get();
        return user?.role as UserRole || null;
      },

      // بررسی دسترسی به مسیر خاص
      canAccessRoute: (route: string) => {
        const { user } = get();
        if (!user) return false;
        
        const userRole = user.role as UserRole;
        const allowedRoutes = ROLE_ROUTES[userRole] || [];
        
        // بررسی دسترسی بر اساس شروع مسیر
        return allowedRoutes.some(allowedRoute => 
          route.startsWith(allowedRoute) || route === '/' || route === '/home'
        );
      },
    }),
    {
      name: 'auth-storage',
      // تنها مقادیر مهم را persist کن
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook برای استفاده آسان‌تر
export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
    // هلپرهای اضافی
    isAdmin: store.hasRole('admin'),
    isLearner: store.hasRole('learner'),
    isSupport: store.hasRole('support'),
    isExpert: store.hasRole('expert'),
    isDesigner: store.hasRole('designer'),
  };
}; 