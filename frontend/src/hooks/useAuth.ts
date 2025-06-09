/**
 * Auth Hooks - هوک‌های احراز هویت با React Query
 * مدیریت API calls مربوط به کاربر و احراز هویت
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

// Query Keys
export const AUTH_QUERY_KEYS = {
  user: ['auth', 'user'] as const,
  profile: ['auth', 'profile'] as const,
};

/**
 * Hook برای دریافت پروفایل کاربر
 * با کش 60 ثانیه‌ای
 */
export const useUserProfile = () => {
  const { token, isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: authService.getProfile,
    enabled: !!token && isAuthenticated,
    staleTime: 60000, // 60 ثانیه
    gcTime: 300000, // 5 دقیقه
    retry: (failureCount, error) => {
      // در صورت خطای 401 retry نکن
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as Error).message;
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
};

/**
 * Hook برای login
 */
export const useLogin = () => {
  const { login: setAuthData } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // ذخیره در store
      setAuthData(data.user, data.token);
      
      // کش کردن داده‌های کاربر
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      
      // هدایت بر اساس نقش کاربر
      const role = data.user.role;
      switch (role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'designer':
          router.push('/designer/dashboard');
          break;
        case 'learner':
          router.push('/learner/dashboard');
          break;
        case 'expert':
          router.push('/expert/dashboard');
          break;
        case 'support':
          router.push('/support/dashboard');
          break;
        default:
          router.push('/home');
      }
    },
    onError: (error) => {
      console.error('خطا در لاگین:', error);
    },
  });
};

/**
 * Hook برای register
 */
export const useRegister = () => {
  const { login: setAuthData } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // ذخیره در store
      setAuthData(data.user, data.token);
      
      // کش کردن داده‌های کاربر
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
      
      // هدایت به صفحه اصلی
      router.push('/home');
    },
    onError: (error) => {
      console.error('خطا در ثبت‌نام:', error);
    },
  });
};

/**
 * Hook برای logout
 */
export const useLogout = () => {
  const { logout: clearAuthData } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // پاک کردن store
      clearAuthData();
      
      // پاک کردن تمام کش‌ها
      queryClient.clear();
      
      // هدایت به صفحه اصلی
      router.push('/');
    },
    onError: (error) => {
      console.error('خطا در لاگ‌اوت:', error);
      // حتی در صورت خطا، کاربر را لاگ‌اوت کن
      clearAuthData();
      queryClient.clear();
      router.push('/');
    },
  });
};

/**
 * Hook برای بررسی وضعیت احراز هویت در کامپوننت‌های layout
 */
export const useAuthStatus = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { isLoading: profileLoading, error } = useUserProfile();

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || profileLoading,
    error,
    userRole: user?.role || null,
  };
}; 