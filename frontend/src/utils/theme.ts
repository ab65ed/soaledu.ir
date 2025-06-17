/**
 * Theme Configuration - پیکربندی تم پروژه
 * برای استفاده در ماژول تبدیل Lovable
 */

// رنگ‌های اصلی پروژه
export const colors = {
  // رنگ اصلی - Primary Color
  primary: {
    50: '#F3F3E0',
    100: '#E8E8CC',
    200: '#DDDD99',
    300: '#D2D266',
    400: '#C7C733',
    500: '#BCBC00',
    600: '#969600',
    700: '#707000',
    800: '#4A4A00',
    900: '#242400',
  },
  
  // رنگ فرعی اول - Secondary Color
  secondary: {
    50: '#E3F2FF',
    100: '#C7E5FF',
    200: '#8FCCFF',
    300: '#57B2FF',
    400: '#1F99FF',
    500: '#27548A',
    600: '#1F4370',
    700: '#173255',
    800: '#0F213B',
    900: '#071120',
  },
  
  // رنگ فرعی دوم - Accent Color
  accent: {
    50: '#E8F4F8',
    100: '#D1E9F1',
    200: '#A3D3E3',
    300: '#75BDD5',
    400: '#47A7C7',
    500: '#183B4E',
    600: '#132F3E',
    700: '#0E232F',
    800: '#0A171F',
    900: '#050B10',
  },
  
  // رنگ چهارم - Quaternary Color
  quaternary: {
    50: '#FDF6E3',
    100: '#FBEDC7',
    200: '#F7DB8F',
    300: '#F3C957',
    400: '#EFB71F',
    500: '#DDA853',
    600: '#B18642',
    700: '#856432',
    800: '#594221',
    900: '#2C2111',
  },
  
  // رنگ‌های خاکستری
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // رنگ‌های وضعیت
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
};

// فونت‌ها
export const fonts = {
  primary: 'IRANSans, Tahoma, Arial, sans-serif',
  secondary: 'Vazir, Tahoma, Arial, sans-serif',
  mono: 'Fira Code, Consolas, Monaco, monospace',
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

// رنگ‌های اضافی سیستم
export const systemColors = {
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
  // انیمیشن‌های قبلی حفظ شده
  slideUp: {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  slideDown: {
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  slideRight: {
    from: { opacity: 0, transform: 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  slideLeft: {
    from: { opacity: 0, transform: 'translateX(20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  scale: {
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  bounce: {
    '0%': { opacity: 0, transform: 'scale(0.3)' },
    '50%': { opacity: 1, transform: 'scale(1.05)' },
    '70%': { transform: 'scale(0.9)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
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
  
  // انیمیشن‌های قبلی
  slideUp: 'slideUp 0.5s ease-out',
  slideDown: 'slideDown 0.5s ease-out',
  slideRight: 'slideRight 0.5s ease-out',
  slideLeft: 'slideLeft 0.5s ease-out',
  scale: 'scale 0.3s ease-out',
  bounce: 'bounce 0.8s ease-out',
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

// متغیرهای CSS برای استفاده در Tailwind
export const cssVariables = {
  // رنگ‌ها
  '--color-primary': colors.primary[500],
  '--color-primary-50': colors.primary[50],
  '--color-primary-100': colors.primary[100],
  '--color-primary-200': colors.primary[200],
  '--color-primary-300': colors.primary[300],
  '--color-primary-400': colors.primary[400],
  '--color-primary-500': colors.primary[500],
  '--color-primary-600': colors.primary[600],
  '--color-primary-700': colors.primary[700],
  '--color-primary-800': colors.primary[800],
  '--color-primary-900': colors.primary[900],
  
  '--color-secondary': colors.secondary[500],
  '--color-secondary-50': colors.secondary[50],
  '--color-secondary-100': colors.secondary[100],
  '--color-secondary-200': colors.secondary[200],
  '--color-secondary-300': colors.secondary[300],
  '--color-secondary-400': colors.secondary[400],
  '--color-secondary-500': colors.secondary[500],
  '--color-secondary-600': colors.secondary[600],
  '--color-secondary-700': colors.secondary[700],
  '--color-secondary-800': colors.secondary[800],
  '--color-secondary-900': colors.secondary[900],
  
  '--color-accent': colors.accent[500],
  '--color-accent-50': colors.accent[50],
  '--color-accent-100': colors.accent[100],
  '--color-accent-200': colors.accent[200],
  '--color-accent-300': colors.accent[300],
  '--color-accent-400': colors.accent[400],
  '--color-accent-500': colors.accent[500],
  '--color-accent-600': colors.accent[600],
  '--color-accent-700': colors.accent[700],
  '--color-accent-800': colors.accent[800],
  '--color-accent-900': colors.accent[900],
  
  '--color-quaternary': colors.quaternary[500],
  '--color-quaternary-50': colors.quaternary[50],
  '--color-quaternary-100': colors.quaternary[100],
  '--color-quaternary-200': colors.quaternary[200],
  '--color-quaternary-300': colors.quaternary[300],
  '--color-quaternary-400': colors.quaternary[400],
  '--color-quaternary-500': colors.quaternary[500],
  '--color-quaternary-600': colors.quaternary[600],
  '--color-quaternary-700': colors.quaternary[700],
  '--color-quaternary-800': colors.quaternary[800],
  '--color-quaternary-900': colors.quaternary[900],
  
  // فونت‌ها
  '--font-primary': fonts.primary,
  '--font-secondary': fonts.secondary,
  '--font-mono': fonts.mono,
};

// تابع تبدیل رنگ‌های Lovable به رنگ‌های پروژه
export const mapLovableColors = (lovableColor: string): string => {
  const colorMap: Record<string, string> = {
    // رنگ‌های آبی
    'blue-50': 'secondary-50',
    'blue-100': 'secondary-100',
    'blue-200': 'secondary-200',
    'blue-300': 'secondary-300',
    'blue-400': 'secondary-400',
    'blue-500': 'secondary-500',
    'blue-600': 'secondary-600',
    'blue-700': 'secondary-700',
    'blue-800': 'secondary-800',
    'blue-900': 'secondary-900',
    
    // رنگ‌های بنفش
    'purple-50': 'accent-50',
    'purple-100': 'accent-100',
    'purple-200': 'accent-200',
    'purple-300': 'accent-300',
    'purple-400': 'accent-400',
    'purple-500': 'accent-500',
    'purple-600': 'accent-600',
    'purple-700': 'accent-700',
    'purple-800': 'accent-800',
    'purple-900': 'accent-900',
    
    // رنگ‌های نارنجی/زرد
    'orange-50': 'quaternary-50',
    'orange-100': 'quaternary-100',
    'orange-200': 'quaternary-200',
    'orange-300': 'quaternary-300',
    'orange-400': 'quaternary-400',
    'orange-500': 'quaternary-500',
    'orange-600': 'quaternary-600',
    'orange-700': 'quaternary-700',
    'orange-800': 'quaternary-800',
    'orange-900': 'quaternary-900',
    
    'yellow-50': 'quaternary-50',
    'yellow-100': 'quaternary-100',
    'yellow-200': 'quaternary-200',
    'yellow-300': 'quaternary-300',
    'yellow-400': 'quaternary-400',
    'yellow-500': 'quaternary-500',
    'yellow-600': 'quaternary-600',
    'yellow-700': 'quaternary-700',
    'yellow-800': 'quaternary-800',
    'yellow-900': 'quaternary-900',
    
    // رنگ‌های سبز
    'green-50': 'primary-50',
    'green-100': 'primary-100',
    'green-200': 'primary-200',
    'green-300': 'primary-300',
    'green-400': 'primary-400',
    'green-500': 'primary-500',
    'green-600': 'primary-600',
    'green-700': 'primary-700',
    'green-800': 'primary-800',
    'green-900': 'primary-900',
    
    // رنگ‌های indigo
    'indigo-50': 'secondary-50',
    'indigo-100': 'secondary-100',
    'indigo-200': 'secondary-200',
    'indigo-300': 'secondary-300',
    'indigo-400': 'secondary-400',
    'indigo-500': 'secondary-500',
    'indigo-600': 'secondary-600',
    'indigo-700': 'secondary-700',
    'indigo-800': 'secondary-800',
    'indigo-900': 'secondary-900',
  };
  
  return colorMap[lovableColor] || lovableColor;
};

// تابع اعمال متغیرهای CSS
export const applyCSSVariables = () => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
};

// تابع دریافت رنگ بر اساس نام
export const getColor = (colorName: string, shade: number = 500): string => {
  const colorParts = colorName.split('-');
  const colorKey = colorParts[0] as keyof typeof colors;
  const colorShade = colorParts[1] ? parseInt(colorParts[1]) : shade;
  
  if (colors[colorKey] && typeof colors[colorKey] === 'object') {
    const colorObject = colors[colorKey] as Record<number, string>;
    return colorObject[colorShade] || colorObject[500];
  }
  
  return colorName;
};

// تابع کمکی برای دریافت رنگ‌های سیستم
export const getSystemColor = (colorKey: string, variant?: string): string => {
  const colorPath = colorKey.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let color: any = systemColors;
  
  for (const key of colorPath) {
    if (color && typeof color === 'object' && color[key]) {
      color = color[key];
    } else {
      console.warn(`System color key "${colorKey}" not found in theme`);
      return systemColors.primary.DEFAULT;
    }
  }
  
  if (variant && color && typeof color === 'object' && color[variant]) {
    return color[variant];
  }
  
  return typeof color === 'string' ? color : (color?.DEFAULT || systemColors.primary.DEFAULT);
};

// تم پیش‌فرض
export const theme = {
  colors,
  systemColors,
  fonts,
  spacing,
  shadows,
  animations,
  keyframes,
  borderRadius,
  container,
  breakpoints,
  zIndex,
  cssVariables,
  mapLovableColors,
  applyCSSVariables,
  getColor,
  getSystemColor,
};

export default theme; 