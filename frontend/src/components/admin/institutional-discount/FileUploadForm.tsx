/**
 * File Upload Form Component for Institutional Discounts
 * کامپوننت فرم آپلود فایل برای تخفیف‌های سازمانی
 */

'use client';

import React, { useState, useRef } from 'react';
import { useFileUpload } from '@/hooks/useInstitutionalDiscount';
import { UploadDiscountFileRequest } from '@/types/institutionalDiscount';

interface FileUploadFormProps {
  onUploadSuccess?: (groupId: string) => void;
  onUploadError?: (error: string) => void;
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  onUploadSuccess,
  onUploadError,
}) => {
  const [formData, setFormData] = useState({
    groupName: '',
    discountType: 'percentage' as 'percentage' | 'amount',
    discountPercentage: '',
    discountAmount: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploading, progress, error, success, uploadFile, resetState } = useFileUpload();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
        file.type !== 'application/vnd.ms-excel') {
      alert('لطفاً فقط فایل‌های اکسل (.xlsx, .xls) انتخاب کنید');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('حجم فایل نباید بیش از 5 مگابایت باشد');
      return;
    }

    setSelectedFile(file);
    resetState();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('لطفاً فایل اکسل را انتخاب کنید');
      return;
    }

    if (formData.discountType === 'percentage' && !formData.discountPercentage) {
      alert('لطفاً درصد تخفیف را وارد کنید');
      return;
    }

    if (formData.discountType === 'amount' && !formData.discountAmount) {
      alert('لطفاً مبلغ تخفیف را وارد کنید');
      return;
    }

    const uploadData: UploadDiscountFileRequest = {
      file: selectedFile,
      groupName: formData.groupName.trim() || undefined,
      discountPercentage: formData.discountType === 'percentage' 
        ? parseFloat(formData.discountPercentage) 
        : undefined,
      discountAmount: formData.discountType === 'amount' 
        ? parseFloat(formData.discountAmount) 
        : undefined,
    };

    try {
      await uploadFile(uploadData);
      onUploadSuccess?.('success'); // In real implementation, you'd get the actual groupId from response
    } catch (err) {
      onUploadError?.(err instanceof Error ? err.message : 'خطا در بارگذاری فایل');
    }
  };

  const handleReset = () => {
    setFormData({
      groupName: '',
      discountType: 'percentage',
      discountPercentage: '',
      discountAmount: '',
    });
    setSelectedFile(null);
    resetState();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" dir="rtl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          بارگذاری فایل اکسل تخفیف‌های سازمانی
        </h3>
        <p className="text-sm text-gray-600">
          فایل اکسل شامل کد ملی و شماره تلفن دانش‌آموزان را بارگذاری کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            انتخاب فایل اکسل *
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="text-sm text-gray-600">
                  {selectedFile ? (
                    <span className="text-green-600 font-medium">{selectedFile.name}</span>
                  ) : (
                    <>
                      <span className="text-blue-600 font-medium">کلیک کنید</span> یا فایل را اینجا بکشید
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500">فقط فایل‌های .xlsx و .xls (حداکثر 5MB)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Group Name */}
        <div>
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
            نام گروه (اختیاری)
          </label>
          <input
            type="text"
            id="groupName"
            name="groupName"
            value={formData.groupName}
            onChange={handleInputChange}
            placeholder="مثال: دانش‌آموزان مدرسه البرز - بهمن ۱۴۰۳"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Discount Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع تخفیف *
          </label>
          <div className="flex space-x-4 space-x-reverse">
            <label className="flex items-center">
              <input
                type="radio"
                name="discountType"
                value="percentage"
                checked={formData.discountType === 'percentage'}
                onChange={handleInputChange}
                className="ml-2"
              />
              درصدی
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="discountType"
                value="amount"
                checked={formData.discountType === 'amount'}
                onChange={handleInputChange}
                className="ml-2"
              />
              مبلغ ثابت
            </label>
          </div>
        </div>

        {/* Discount Value */}
        {formData.discountType === 'percentage' ? (
          <div>
            <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-2">
              درصد تخفیف *
            </label>
            <div className="relative">
              <input
                type="number"
                id="discountPercentage"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                min="1"
                max="100"
                placeholder="مثال: 15"
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-2">
              مبلغ تخفیف (تومان) *
            </label>
            <input
              type="number"
              id="discountAmount"
              name="discountAmount"
              value={formData.discountAmount}
              onChange={handleInputChange}
              min="1000"
              placeholder="مثال: 50000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>در حال بارگذاری...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            فایل با موفقیت بارگذاری شد و در حال پردازش است
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 space-x-reverse">
          <button
            type="button"
            onClick={handleReset}
            disabled={uploading}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            پاک کردن
          </button>
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'در حال بارگذاری...' : 'بارگذاری فایل'}
          </button>
        </div>
      </form>

      {/* Sample File Download */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          فرمت فایل اکسل باید شامل ستون‌های زیر باشد:
        </p>
        <ul className="text-sm text-gray-600 space-y-1 mb-4">
          <li>• کد ملی (nationalCode)</li>
          <li>• شماره تلفن (phoneNumber)</li>
        </ul>
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={() => {
            // Download sample file functionality would go here
            alert('دانلود فایل نمونه');
          }}
        >
          دانلود فایل نمونه
        </button>
      </div>
    </div>
  );
}; 