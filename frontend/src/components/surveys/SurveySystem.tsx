'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  StarIcon,
  HeartIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface SurveyQuestion {
  id: string;
  type: 'rating' | 'multiple_choice' | 'text' | 'emoji' | 'yes_no' | 'scale';
  question: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  isActive: boolean;
  createdAt: string;
  responseCount: number;
  avgRating?: number;
}

interface SurveyResponse {
  questionId: string;
  answer: string | number | string[];
}

interface SurveySubmission {
  surveyId: string;
  responses: SurveyResponse[];
  metadata: {
    userAgent: string;
    timestamp: string;
    sessionId: string;
  };
}

const SurveySystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'view' | 'create' | 'manage'>('view');
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const queryClient = useQueryClient();

  // Mock surveys data
  const mockSurveys: Survey[] = [
    {
      id: 'survey-1',
      title: 'رضایت‌سنجی از آزمون‌ها',
      description: 'نظر شما در مورد کیفیت سؤالات و رابط کاربری آزمون‌ها',
      questions: [
        {
          id: 'q1',
          type: 'rating',
          question: 'چقدر از کیفیت سؤالات راضی هستید؟',
          required: true,
          min: 1,
          max: 5
        },
        {
          id: 'q2',
          type: 'emoji',
          question: 'تجربه شما از رابط کاربری چطور بود؟',
          required: true
        },
        {
          id: 'q3',
          type: 'text',
          question: 'پیشنهاد شما برای بهبود چیست؟',
          required: false
        }
      ],
      isActive: true,
      createdAt: '2024-01-15',
      responseCount: 127,
      avgRating: 4.2
    },
    {
      id: 'survey-2',
      title: 'بازخورد طراحان',
      description: 'نظرسنجی در مورد ابزارهای طراحی سؤال',
      questions: [
        {
          id: 'q1',
          type: 'scale',
          question: 'ابزار طراحی سؤال تا چه حد آسان است؟',
          required: true,
          min: 1,
          max: 10
        },
        {
          id: 'q2',
          type: 'multiple_choice',
          question: 'کدام ویژگی برای شما مهم‌تر است؟',
          required: true,
          options: ['سرعت طراحی', 'تنوع قالب‌ها', 'امکان پیش‌نمایش', 'گزارش‌گیری']
        }
      ],
      isActive: true,
      createdAt: '2024-01-10',
      responseCount: 89,
      avgRating: 3.8
    }
  ];

  // Query for surveys
  const { data: surveys = mockSurveys, isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: () => Promise.resolve(mockSurveys)
  });

  // Submit survey response mutation
  const submitSurveyMutation = useMutation({
    mutationFn: async (submission: SurveySubmission) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, id: Date.now().toString() };
    },
    onSuccess: () => {
      setIsSubmitted(true);
      setResponses({});
      setCurrentQuestionIndex(0);
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    }
  });

  const handleResponse = (questionId: string, answer: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (!selectedSurvey) return;
    
    const survey = surveys.find(s => s.id === selectedSurvey);
    if (!survey) return;

    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitSurvey = () => {
    if (!selectedSurvey) return;

    const survey = surveys.find(s => s.id === selectedSurvey);
    if (!survey) return;

    const surveyResponses: SurveyResponse[] = survey.questions.map(q => ({
      questionId: q.id,
      answer: responses[q.id] || ''
    }));

    const submission: SurveySubmission = {
      surveyId: selectedSurvey,
      responses: surveyResponses,
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: Math.random().toString(36).substr(2, 9)
      }
    };

    submitSurveyMutation.mutate(submission);
  };

  const getCurrentQuestion = () => {
    if (!selectedSurvey) return null;
    
    const survey = surveys.find(s => s.id === selectedSurvey);
    if (!survey) return null;

    return survey.questions[currentQuestionIndex];
  };

  const renderQuestionInput = (question: SurveyQuestion) => {
    const value = responses[question.id];

    switch (question.type) {
      case 'rating':
        return (
          <div className="flex justify-center space-x-1 space-x-reverse">
            {Array.from({ length: question.max || 5 }, (_, i) => i + 1).map(rating => (
              <button
                key={rating}
                onClick={() => handleResponse(question.id, rating)}
                className={`p-2 transition-colors ${
                  value >= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                {value >= rating ? <StarIconSolid className="w-8 h-8" /> : <StarIcon className="w-8 h-8" />}
              </button>
            ))}
          </div>
        );

      case 'emoji':
        const emojis = [
          { icon: FaceFrownIcon, label: 'ناراضی', value: 1, color: 'text-red-500' },
          { icon: FaceSmileIcon, label: 'متوسط', value: 2, color: 'text-yellow-500' },
          { icon: HeartIcon, label: 'راضی', value: 3, color: 'text-green-500' }
        ];
        
        return (
          <div className="flex justify-center space-x-4 space-x-reverse">
            {emojis.map(emoji => (
              <button
                key={emoji.value}
                onClick={() => handleResponse(question.id, emoji.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  value === emoji.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <emoji.icon className={`w-12 h-12 ${emoji.color}`} />
                <div className="text-sm mt-2 text-gray-600">{emoji.label}</div>
              </button>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>کم</span>
              <span>زیاد</span>
            </div>
            <div className="flex justify-center">
              <input
                type="range"
                min={question.min || 1}
                max={question.max || 10}
                value={value || question.min || 1}
                onChange={(e) => handleResponse(question.id, parseInt(e.target.value))}
                className="w-full max-w-md"
              />
            </div>
            <div className="text-center text-lg font-semibold text-gray-900">
              {value || question.min || 1}
            </div>
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map(option => (
              <button
                key={option}
                onClick={() => handleResponse(question.id, option)}
                className={`w-full p-4 text-right rounded-lg border-2 transition-all ${
                  value === option 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'yes_no':
        return (
          <div className="flex justify-center space-x-4 space-x-reverse">
            <button
              onClick={() => handleResponse(question.id, 'yes')}
              className={`px-8 py-4 rounded-lg border-2 transition-all ${
                value === 'yes' 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              بله
            </button>
            <button
              onClick={() => handleResponse(question.id, 'no')}
              className={`px-8 py-4 rounded-lg border-2 transition-all ${
                value === 'no' 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              خیر
            </button>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="پاسخ خود را بنویسید..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
            dir="rtl"
          />
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center" dir="rtl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">پاسخ شما ثبت شد!</h2>
          <p className="text-green-700 mb-6">از وقتی که صرف کردید متشکریم. نظرات شما برای ما بسیار ارزشمند است.</p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setSelectedSurvey(null);
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            بازگشت به نظرسنجی‌ها
          </button>
        </div>
      </div>
    );
  }

  if (selectedSurvey) {
    const survey = surveys.find(s => s.id === selectedSurvey);
    const currentQuestion = getCurrentQuestion();
    
    if (!survey || !currentQuestion) return null;

    const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;
    const canProceed = !currentQuestion.required || responses[currentQuestion.id] !== undefined;

    return (
      <div className="max-w-2xl mx-auto p-6" dir="rtl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
            <button
              onClick={() => setSelectedSurvey(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            سؤال {currentQuestionIndex + 1} از {survey.questions.length}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {currentQuestion.question}
            {currentQuestion.required && <span className="text-red-500">*</span>}
          </h2>
          
          {renderQuestionInput(currentQuestion)}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            قبلی
          </button>

          {currentQuestionIndex === survey.questions.length - 1 ? (
            <button
              onClick={handleSubmitSurvey}
              disabled={!canProceed || submitSurveyMutation.isPending}
              className={`px-6 py-2 rounded-lg transition-colors ${
                !canProceed || submitSurveyMutation.isPending
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {submitSurveyMutation.isPending ? 'در حال ارسال...' : 'ارسال پاسخ‌ها'}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={!canProceed}
              className={`px-6 py-2 rounded-lg transition-colors ${
                !canProceed
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              بعدی
            </button>
          )}
        </div>
      </div>
    );
  }

  // Main survey list view
  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">نظرسنجی‌ها</h1>
        <p className="text-gray-600">نظر شما برای ما مهم است</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {surveys.filter(s => s.isActive).map(survey => (
            <div key={survey.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{survey.title}</h3>
                  <p className="text-gray-600 mb-3">{survey.description}</p>
                  
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                    <span>{survey.questions.length} سؤال</span>
                    <span>{survey.responseCount} پاسخ</span>
                    {survey.avgRating && (
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <StarIconSolid className="w-4 h-4 text-yellow-500" />
                        <span>{survey.avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedSurvey(survey.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>شرکت در نظرسنجی</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveySystem;