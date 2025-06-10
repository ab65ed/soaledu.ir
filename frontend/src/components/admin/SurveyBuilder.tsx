'use client';

import React, { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';
import {
  PlusIcon,
  TrashIcon,
  DuplicateIcon,
  EyeIcon,
  SaveIcon,
  DocumentTextIcon,
  ListBulletIcon,
  StarIcon,
  NumberedListIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  Cog6ToothIcon,
  PhotoIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface SurveyQuestion {
  id: string;
  type: 'text' | 'multiple_choice' | 'checkbox' | 'rating' | 'scale' | 'dropdown' | 'file_upload' | 'date' | 'email' | 'phone';
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  settings?: {
    minValue?: number;
    maxValue?: number;
    step?: number;
    allowOther?: boolean;
    maxLength?: number;
    placeholder?: string;
    fileTypes?: string[];
    maxFileSize?: number;
  };
}

interface Survey {
  id?: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  settings: {
    isPublic: boolean;
    allowAnonymous: boolean;
    showProgress: boolean;
    oneResponsePerUser: boolean;
    collectEmail: boolean;
    thankYouMessage: string;
    redirectUrl?: string;
  };
  status: 'draft' | 'published' | 'closed';
  createdAt?: string;
  updatedAt?: string;
}

const questionTypes = [
  { type: 'text', label: 'متن کوتاه', icon: DocumentTextIcon },
  { type: 'multiple_choice', label: 'چند گزینه‌ای', icon: ListBulletIcon },
  { type: 'checkbox', label: 'چندین انتخاب', icon: CheckIcon },
  { type: 'rating', label: 'امتیازدهی', icon: StarIcon },
  { type: 'scale', label: 'مقیاس عددی', icon: NumberedListIcon },
  { type: 'dropdown', label: 'فهرست کشویی', icon: ArrowsUpDownIcon },
  { type: 'file_upload', label: 'آپلود فایل', icon: PhotoIcon },
  { type: 'email', label: 'ایمیل', icon: DocumentTextIcon },
  { type: 'phone', label: 'شماره تلفن', icon: DocumentTextIcon },
  { type: 'date', label: 'تاریخ', icon: CalendarIcon }
];

const SurveyBuilder: React.FC = () => {
  const [survey, setSurvey] = useState<Survey>({
    title: '',
    description: '',
    questions: [],
    settings: {
      isPublic: true,
      allowAnonymous: true,
      showProgress: true,
      oneResponsePerUser: false,
      collectEmail: false,
      thankYouMessage: 'از شرکت شما در نظرسنجی متشکریم!'
    },
    status: 'draft'
  });

  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  const queryClient = useQueryClient();

  // Mutations
  const saveSurveyMutation = useMutation({
    mutationFn: async (surveyData: Survey) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...surveyData, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    }
  });

  const publishSurveyMutation = useMutation({
    mutationFn: async (surveyId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return surveyId;
    },
    onSuccess: () => {
      setSurvey(prev => ({ ...prev, status: 'published' }));
    }
  });

  // Generate new question
  const generateQuestion = (type: SurveyQuestion['type']): SurveyQuestion => {
    const baseQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type,
      title: '',
      required: false
    };

    switch (type) {
      case 'multiple_choice':
      case 'checkbox':
      case 'dropdown':
        return {
          ...baseQuestion,
          options: ['گزینه 1', 'گزینه 2'],
          settings: { allowOther: false }
        };
      case 'rating':
        return {
          ...baseQuestion,
          settings: { minValue: 1, maxValue: 5 }
        };
      case 'scale':
        return {
          ...baseQuestion,
          settings: { minValue: 0, maxValue: 10, step: 1 }
        };
      case 'text':
        return {
          ...baseQuestion,
          settings: { maxLength: 500, placeholder: 'پاسخ خود را بنویسید...' }
        };
      case 'file_upload':
        return {
          ...baseQuestion,
          settings: { 
            fileTypes: ['image/*', '.pdf', '.doc', '.docx'],
            maxFileSize: 5 // MB
          }
        };
      default:
        return baseQuestion;
    }
  };

  // Event handlers
  const addQuestion = (type: SurveyQuestion['type']) => {
    const newQuestion = generateQuestion(type);
    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setShowQuestionTypes(false);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<SurveyQuestion>) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const duplicateQuestion = (questionId: string) => {
    const question = survey.questions.find(q => q.id === questionId);
    if (question) {
      const duplicated = {
        ...question,
        id: Date.now().toString(),
        title: `${question.title} (کپی)`
      };
      setSurvey(prev => ({
        ...prev,
        questions: [...prev.questions, duplicated]
      }));
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newQuestions = Array.from(survey.questions);
    const [removed] = newQuestions.splice(result.source.index, 1);
    newQuestions.splice(result.destination.index, 0, removed);

    setSurvey(prev => ({ ...prev, questions: newQuestions }));
  };

  // Render question editor
  const renderQuestionEditor = (question: SurveyQuestion) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          عنوان سؤال
        </label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          placeholder="سؤال خود را بنویسید..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          توضیحات (اختیاری)
        </label>
        <textarea
          value={question.description || ''}
          onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="توضیحات اضافی..."
        />
      </div>

      {/* Options for multiple choice, checkbox, dropdown */}
      {(['multiple_choice', 'checkbox', 'dropdown'] as const).includes(question.type) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            گزینه‌ها
          </label>
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])];
                    newOptions[index] = e.target.value;
                    updateQuestion(question.id, { options: newOptions });
                  }}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
                <button
                  onClick={() => {
                    const newOptions = question.options?.filter((_, i) => i !== index);
                    updateQuestion(question.id, { options: newOptions });
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = [...(question.options || []), `گزینه ${(question.options?.length || 0) + 1}`];
                updateQuestion(question.id, { options: newOptions });
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + افزودن گزینه
            </button>
          </div>
        </div>
      )}

      {/* Rating settings */}
      {question.type === 'rating' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداقل امتیاز
            </label>
            <input
              type="number"
              value={question.settings?.minValue || 1}
              onChange={(e) => updateQuestion(question.id, {
                settings: { ...question.settings, minValue: parseInt(e.target.value) }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداکثر امتیاز
            </label>
            <input
              type="number"
              value={question.settings?.maxValue || 5}
              onChange={(e) => updateQuestion(question.id, {
                settings: { ...question.settings, maxValue: parseInt(e.target.value) }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      )}

      {/* Scale settings */}
      {question.type === 'scale' && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداقل
            </label>
            <input
              type="number"
              value={question.settings?.minValue || 0}
              onChange={(e) => updateQuestion(question.id, {
                settings: { ...question.settings, minValue: parseInt(e.target.value) }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداکثر
            </label>
            <input
              type="number"
              value={question.settings?.maxValue || 10}
              onChange={(e) => updateQuestion(question.id, {
                settings: { ...question.settings, maxValue: parseInt(e.target.value) }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              گام
            </label>
            <input
              type="number"
              value={question.settings?.step || 1}
              onChange={(e) => updateQuestion(question.id, {
                settings: { ...question.settings, step: parseInt(e.target.value) }
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      )}

      {/* Required toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.required}
          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
        />
        <label htmlFor={`required-${question.id}`} className="mr-2 text-sm text-gray-700">
          پاسخ اجباری
        </label>
      </div>
    </div>
  );

  // Render survey preview
  const renderSurveyPreview = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{survey.title || 'نظرسنجی بدون عنوان'}</h2>
        {survey.description && (
          <p className="text-gray-600">{survey.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {survey.questions.map((question, index) => (
          <div key={question.id} className="border-b border-gray-200 pb-6">
            <div className="mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {index + 1}. {question.title || 'سؤال بدون عنوان'}
                {question.required && <span className="text-red-500 mr-1">*</span>}
              </h3>
              {question.description && (
                <p className="text-sm text-gray-600 mt-1">{question.description}</p>
              )}
            </div>

            {/* Render question preview based on type */}
            {question.type === 'text' && (
              <input
                type="text"
                placeholder={question.settings?.placeholder}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                disabled
              />
            )}

            {question.type === 'multiple_choice' && (
              <div className="space-y-2">
                {question.options?.map((option, i) => (
                  <label key={i} className="flex items-center">
                    <input type="radio" name={`question-${question.id}`} className="ml-2" disabled />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'checkbox' && (
              <div className="space-y-2">
                {question.options?.map((option, i) => (
                  <label key={i} className="flex items-center">
                    <input type="checkbox" className="ml-2" disabled />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'rating' && (
              <div className="flex space-x-1 space-x-reverse">
                {Array.from({ length: (question.settings?.maxValue || 5) - (question.settings?.minValue || 1) + 1 }, (_, i) => (
                  <StarIcon key={i} className="w-6 h-6 text-gray-300" />
                ))}
              </div>
            )}

            {question.type === 'scale' && (
              <div className="flex items-center space-x-4 space-x-reverse">
                <span>{question.settings?.minValue}</span>
                <input
                  type="range"
                  min={question.settings?.minValue}
                  max={question.settings?.maxValue}
                  step={question.settings?.step}
                  className="flex-1"
                  disabled
                />
                <span>{question.settings?.maxValue}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          ارسال پاسخ‌ها
        </button>
      </div>
    </div>
  );

  if (preview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">پیش‌نمایش نظرسنجی</h1>
            <button
              onClick={() => setPreview(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              بازگشت به ویرایش
            </button>
          </div>
          {renderSurveyPreview()}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">سازنده نظرسنجی</h1>
        <div className="flex space-x-4 space-x-reverse">
          <button
            onClick={() => setPreview(true)}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <EyeIcon className="w-4 h-4" />
            <span>پیش‌نمایش</span>
          </button>
          <button
            onClick={() => saveSurveyMutation.mutate(survey)}
            disabled={saveSurveyMutation.isPending}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <SaveIcon className="w-4 h-4" />
            <span>{saveSurveyMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}</span>
          </button>
          {survey.status === 'draft' && (
            <button
              onClick={() => survey.id && publishSurveyMutation.mutate(survey.id)}
              disabled={publishSurveyMutation.isPending}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <GlobeAltIcon className="w-4 h-4" />
              <span>{publishSurveyMutation.isPending ? 'در حال انتشار...' : 'انتشار'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editing area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Survey basic info */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات کلی نظرسنجی</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان نظرسنجی
                </label>
                <input
                  type="text"
                  value={survey.title}
                  onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="عنوان نظرسنجی خود را وارد کنید..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات
                </label>
                <textarea
                  value={survey.description}
                  onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="توضیحاتی درباره نظرسنجی..."
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">سؤالات</h2>
              <button
                onClick={() => setShowQuestionTypes(true)}
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="w-4 h-4" />
                <span>افزودن سؤال</span>
              </button>
            </div>

            {/* Question types modal */}
            {showQuestionTypes && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">نوع سؤال را انتخاب کنید</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {questionTypes.map((type) => (
                      <button
                        key={type.type}
                        onClick={() => addQuestion(type.type as SurveyQuestion['type'])}
                        className="flex items-center space-x-3 space-x-reverse p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <type.icon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm">{type.label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowQuestionTypes(false)}
                    className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            )}

            {/* Questions list */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {survey.questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={question.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3 space-x-reverse">
                                <div {...provided.dragHandleProps} className="cursor-move">
                                  <ArrowsUpDownIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                  سؤال {index + 1}
                                </span>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                  {questionTypes.find(t => t.type === question.type)?.label}
                                </span>
                              </div>
                              <div className="flex space-x-2 space-x-reverse">
                                <button
                                  onClick={() => setEditingQuestion(
                                    editingQuestion === question.id ? null : question.id
                                  )}
                                  className="p-1 text-gray-600 hover:text-blue-600"
                                >
                                  <Cog6ToothIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => duplicateQuestion(question.id)}
                                  className="p-1 text-gray-600 hover:text-green-600"
                                >
                                  <DuplicateIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteQuestion(question.id)}
                                  className="p-1 text-gray-600 hover:text-red-600"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="mb-3">
                              <h3 className="font-medium text-gray-900">
                                {question.title || 'سؤال بدون عنوان'}
                                {question.required && <span className="text-red-500 mr-1">*</span>}
                              </h3>
                              {question.description && (
                                <p className="text-sm text-gray-600 mt-1">{question.description}</p>
                              )}
                            </div>

                            {editingQuestion === question.id && (
                              <div className="border-t pt-4">
                                {renderQuestionEditor(question)}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {survey.questions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>هنوز سؤالی اضافه نکرده‌اید</p>
                <button
                  onClick={() => setShowQuestionTypes(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                >
                  اولین سؤال را اضافه کنید
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تنظیمات نظرسنجی</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={survey.settings.isPublic}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, isPublic: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                <span className="mr-2 text-sm">نظرسنجی عمومی</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={survey.settings.allowAnonymous}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, allowAnonymous: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                <span className="mr-2 text-sm">امکان پاسخ ناشناس</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={survey.settings.showProgress}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, showProgress: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                <span className="mr-2 text-sm">نمایش پیشرفت</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={survey.settings.oneResponsePerUser}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, oneResponsePerUser: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                <span className="mr-2 text-sm">یک پاسخ به ازای هر کاربر</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  پیام تشکر
                </label>
                <textarea
                  value={survey.settings.thankYouMessage}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, thankYouMessage: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Survey stats if published */}
          {survey.status === 'published' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">آمار نظرسنجی</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">تعداد پاسخ:</span>
                  <span className="font-medium">۲۴</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">نرخ تکمیل:</span>
                  <span className="font-medium">۸۵٪</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">میانگین زمان:</span>
                  <span className="font-medium">۳ دقیقه</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyBuilder;