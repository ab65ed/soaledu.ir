/**
 * Theme Configuration - پیکربندی تم پروژه
 * برای استفاده در ماژول تبدیل Lovable
 */

// فونت‌ها
export const fonts = {
  primary: 'YekanBakh, IRANSans, Tahoma, Arial, sans-serif',
  secondary: 'IRANSans, Vazir, Tahoma, Arial, sans-serif',
  mono: 'Fira Code, Consolas, Monaco, monospace',
  yekanbakh: 'YekanBakh, IRANSans, Tahoma, Arial, sans-serif',
};

// فاصله‌ها
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px
};

// سایه‌ها
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

// Container تنظیمات
export const container = {
  center: true,
  padding: "2rem",
  screens: {
    "2xl": "1400px",
  },
};

// رنگ‌های سیستم - مطابق با Tailwind Config
export const colors = {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  popover: {
    DEFAULT: "hsl(var(--popover))",
    foreground: "hsl(var(--popover-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
  convrt: {
    "dark-blue": "#222233",
    "purple": "#6936F5",
    "purple-hover": "#5828E0",
    "purple-light": "#9B87F5",
    "white": "#FFFFFF",
    "light-gray": "#F5F7FA",
    "ignored": "#EA384C",
    "influential": "#6936F5"
  }
};

// Border Radius تنظیمات
export const borderRadius = {
  lg: "var(--radius)",
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
};

// انیمیشن‌ها و Keyframes
export const keyframes = {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  wave: {
    '0%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
    '100%': { transform: 'translateY(0)' },
  },
  floating: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-20px)' },
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
  gradient: {
    '0%': { backgroundPosition: '0% 50%' },
    '100%': { backgroundPosition: '100% 50%' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  parallax: {
    '0%': { transform: 'translateY(0)' },
    '100%': { transform: 'translateY(-20px)' },
  },
  float: {
    '0%, 100%': { transform: 'translateY(0) scale(1)' },
    '50%': { transform: 'translateY(-15px) scale(1.02)' },
  },
  reveal: {
    '0%': { opacity: '0', transform: 'translateY(40px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  slowSpin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // انیمیشن‌های Tailwind
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  fadeIn: 'fadeIn 0.5s ease-in-out',
  wave: 'wave 3s ease-in-out infinite',
  floating: 'floating 3s ease-in-out infinite',
  pulse: 'pulse 2s ease-in-out infinite',
  gradient: 'gradient 5s ease infinite alternate',
  scaleIn: 'scaleIn 0.3s ease-out',
  parallax: 'parallax 10s ease-in-out infinite alternate',
  float: 'float 6s ease-in-out infinite',
  reveal: 'reveal 1s ease-out forwards',
  slowSpin: 'slowSpin 20s linear infinite',
};

// نقاط شکست responsive
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// z-index لایه‌بندی
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// تابع کمکی برای دریافت رنگ‌های سیستم
export const getSystemColor = (colorKey: string, variant?: string): string => {
  const colorPath = colorKey.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let color: any = colors;
  
  for (const key of colorPath) {
    if (color && typeof color === 'object' && color[key]) {
      color = color[key];
    } else {
      console.warn(`System color key "${colorKey}" not found in theme`);
      return colors.primary.DEFAULT;
    }
  }
  
  if (variant && color && typeof color === 'object' && color[variant]) {
    return color[variant];
  }
  
  return typeof color === 'string' ? color : (color?.DEFAULT || colors.primary.DEFAULT);
};

// تم پیش‌فرض
export const theme = {
  colors,
  fonts,
  spacing,
  shadows,
  animations,
  keyframes,
  borderRadius,
  container,
  breakpoints,
  zIndex,
  getSystemColor,
};

export default theme; 