/**
 * Theme Configuration - پیکربندی تم
 * رنگ‌های اصلی و فرعی سایت
 */

export const theme = {
  colors: {
    // رنگ اصلی - Primary Color
    primary: '#F3F3E0',
    
    // رنگ فرعی اول - Secondary Color 1
    secondary: '#27548A',
    
    // رنگ فرعی دوم - Secondary Color 2
    accent: '#183B4E',
    
    // رنگ چهارم - Fourth Color
    quaternary: '#DDA853',
  },
  
  // متغیرهای CSS برای استفاده آسان
  cssVariables: {
    '--color-primary': '#F3F3E0',
    '--color-secondary': '#27548A',
    '--color-accent': '#183B4E',
    '--color-quaternary': '#DDA853',
  }
}

// تابع برای دریافت رنگ بر اساس نام
export const getColor = (colorName) => {
  return theme.colors[colorName] || theme.colors.accent
}

// تابع برای اعمال متغیرهای CSS
export const applyCSSVariables = () => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    Object.entries(theme.cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }
}

export default theme 