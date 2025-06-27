"use client"

import React from 'react'

/**
 * کامپوننت انیمیشن‌های پس‌زمینه
 * فقط در سمت کلاینت اجرا می‌شود تا مشکل Hydration حل شود
 */
const BackgroundAnimations = React.memo(() => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* اشکال هندسی شناور - کنتراست کمتر برای موبایل */}
      <div className="absolute top-20 left-10 w-16 h-16 border-2 border-blue-400/20 rounded-lg animate-bounce md:border-blue-400/40"
           style={{ 
             animationDuration: '3s',
             boxShadow: '0 0 10px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(59, 130, 246, 0.1)',
             filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.2))',
             opacity: '0.4'
           }} />
      
      <div className="absolute top-40 right-20 w-12 h-12 border-2 border-purple-400/20 rounded-full animate-pulse md:border-purple-400/40"
           style={{ 
             animationDuration: '2s',
             boxShadow: '0 0 10px rgba(147, 51, 234, 0.2), 0 2px 8px rgba(147, 51, 234, 0.1)',
             filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.2))',
             opacity: '0.4'
           }} />
      
      <div className="absolute bottom-32 left-1/4 w-8 h-8 border-2 border-green-400/20 rotate-45 animate-spin md:border-green-400/40"
           style={{ 
             animationDuration: '4s',
             boxShadow: '0 0 10px rgba(34, 197, 94, 0.2), 0 2px 8px rgba(34, 197, 94, 0.1)',
             filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.2))',
             opacity: '0.4'
           }} />

      {/* ذرات نوری چشمک‌زن - تعداد بیشتر */}
      <div className="absolute top-1/4 right-1/3 w-2 h-2 rounded-full animate-ping"
           style={{ 
             background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.2) 70%, transparent 100%)',
             animationDuration: '2s',
             filter: 'blur(0.5px)',
             boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
           }} />
      
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full animate-pulse"
           style={{ 
             background: 'radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, rgba(147, 51, 234, 0.2) 70%, transparent 100%)',
             animationDuration: '1.5s',
             filter: 'blur(0.5px)',
             boxShadow: '0 0 8px rgba(147, 51, 234, 0.4)'
           }} />
      
      <div className="absolute top-3/4 left-1/5 w-1.5 h-1.5 rounded-full animate-bounce"
           style={{ 
             background: 'radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0.2) 70%, transparent 100%)',
             animationDuration: '2.5s',
             filter: 'blur(0.5px)',
             boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
           }} />
           
      {/* دایره‌های چشمک‌زن اضافی */}
      <div className="absolute top-1/6 left-1/3 w-1 h-1 rounded-full animate-ping"
           style={{ 
             background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(236, 72, 153, 0.2) 70%, transparent 100%)',
             animationDuration: '1.8s',
             filter: 'blur(0.5px)',
             boxShadow: '0 0 8px rgba(236, 72, 153, 0.4)'
           }} />
           
      <div className="absolute bottom-1/6 right-1/3 w-1.5 h-1.5 rounded-full animate-pulse"
           style={{ 
             background: 'radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, rgba(245, 158, 11, 0.2) 70%, transparent 100%)',
             animationDuration: '2.2s',
             filter: 'blur(0.5px)',
             boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)'
           }} />
           
      <div className="absolute top-2/3 right-1/6 w-1 h-1 rounded-full animate-ping"
           style={{ 
             background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(168, 85, 247, 0.2) 70%, transparent 100%)',
             animationDuration: '1.7s',
             filter: 'blur(0.5px)',
             boxShadow: '0 0 8px rgba(168, 85, 247, 0.4)'
           }} />
    </div>
  )
})

BackgroundAnimations.displayName = 'BackgroundAnimations'

export default BackgroundAnimations 