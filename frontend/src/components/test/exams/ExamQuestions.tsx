'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TestExamQuestion {
  id: string;
  text: string;
  options: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  chapter: string;
  estimatedTime: number;
}

interface ExamQuestionsProps {
  questions: TestExamQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, number>;
  onAnswerSelect: (questionId: string, optionIndex: number) => void;
  onQuestionChange: (index: number) => void;
  isSubmitting: boolean;
}

const toPersianNumber = (num: number): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'آسان';
    case 'medium': return 'متوسط';
    case 'hard': return 'سخت';
    default: return 'نامشخص';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'hard': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export function ExamQuestions({
  questions,
  currentQuestionIndex,
  answers,
  onAnswerSelect,
  onQuestionChange,
  isSubmitting
}: ExamQuestionsProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  if (!currentQuestion) {
    return <div>سوالی یافت نشد</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            سوال {toPersianNumber(currentQuestionIndex + 1)} از {toPersianNumber(totalQuestions)}
          </span>
          <span className="text-sm text-gray-600">
            {toPersianNumber(progressPercentage)}٪ تکمیل شده
          </span>
        </div>
        <div 
          className="w-full bg-gray-200 rounded-full h-2"
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Overview */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => {
            const isAnswered = answers[questions[index].id] !== undefined;
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <button
                key={index}
                onClick={() => onQuestionChange(index)}
                disabled={isSubmitting}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : isAnswered
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {toPersianNumber(index + 1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className={`text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
            {getDifficultyText(currentQuestion.difficulty)}
          </span>
          <span className="text-sm text-gray-600">{currentQuestion.chapter}</span>
          <span className="text-sm text-gray-600">
            زمان تخمینی: {toPersianNumber(currentQuestion.estimatedTime)} دقیقه
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {currentQuestion.text}
        </h2>

        {/* Options */}
        <div 
          className="space-y-3"
          role="radiogroup"
          aria-labelledby={`question-${currentQuestion.id}`}
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === index;
            
            return (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index}
                  checked={isSelected}
                  onChange={() => onAnswerSelect(currentQuestion.id, index)}
                  disabled={isSubmitting}
                  className="sr-only"
                  aria-describedby={`option-${index}-desc`}
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-gray-900" aria-label={option}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => onQuestionChange(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="سوال قبلی"
        >
          <ChevronRight className="w-5 h-5" />
          قبلی
        </button>

        <button
          onClick={() => onQuestionChange(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === totalQuestions - 1 || isSubmitting}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="سوال بعدی"
        >
          بعدی
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 