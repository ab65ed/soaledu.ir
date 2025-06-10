'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  AcademicCapIcon,
  FireIcon,
  StarIcon,
  CalendarIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface StudentStats {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  totalStudyTime: number;
  rank: number;
  totalStudents: number;
  streak: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface RecentExam {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  completedAt: string;
  duration: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  completedAt: string;
  questionsStudied: number;
  accuracy: number;
}

interface UpcomingExam {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  questionsCount: number;
  subject: string;
  isRequired: boolean;
}

const StudentDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'semester'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'achievements' | 'schedule'>('overview');
  
  const queryClient = useQueryClient();

  // Mock data - در production از API واقعی بیاید
  const mockStudentStats: StudentStats = {
    totalExams: 45,
    completedExams: 38,
    averageScore: 87.5,
    totalStudyTime: 2840, // minutes
    rank: 23,
    totalStudents: 1250,
    streak: 7,
    achievements: [
      {
        id: 'first_exam',
        title: 'اولین آزمون',
        description: 'اولین آزمون خود را با موفقیت پاس کردید',
        icon: '🎓',
        unlockedAt: '2024-01-05',
        rarity: 'common'
      },
      {
        id: 'streak_7',
        title: 'هفت روز متوالی',
        description: '7 روز متوالی مطالعه کردید',
        icon: '🔥',
        unlockedAt: '2024-01-15',
        rarity: 'rare'
      },
      {
        id: 'top_scorer',
        title: 'بهترین نمره',
        description: 'بالاترین نمره کلاس را کسب کردید',
        icon: '👑',
        unlockedAt: '2024-01-10',
        rarity: 'epic'
      }
    ]
  };

  const mockRecentExams: RecentExam[] = [
    {
      id: 'exam-1',
      title: 'آزمون ریاضی فصل 3',
      score: 92,
      maxScore: 100,
      completedAt: '2024-01-15T10:30:00Z',
      duration: 90,
      subject: 'ریاضی',
      difficulty: 'medium'
    },
    {
      id: 'exam-2', 
      title: 'آزمون فیزیک - نور',
      score: 85,
      maxScore: 100,
      completedAt: '2024-01-12T14:15:00Z',
      duration: 75,
      subject: 'فیزیک',
      difficulty: 'hard'
    },
    {
      id: 'exam-3',
      title: 'آزمون شیمی - اتم',
      score: 88,
      maxScore: 100,
      completedAt: '2024-01-10T09:00:00Z',
      duration: 60,
      subject: 'شیمی',
      difficulty: 'easy'
    }
  ];

  const mockUpcomingExams: UpcomingExam[] = [
    {
      id: 'upcoming-1',
      title: 'آزمون ریاضی فصل 4',
      scheduledAt: '2024-01-20T10:00:00Z',
      duration: 90,
      questionsCount: 25,
      subject: 'ریاضی',
      isRequired: true
    },
    {
      id: 'upcoming-2',
      title: 'آزمون زیست شناسی',
      scheduledAt: '2024-01-22T14:00:00Z',
      duration: 75,
      questionsCount: 30,
      subject: 'زیست‌شناسی',
      isRequired: false
    }
  ];

  const mockStudySessions: StudySession[] = [
    {
      id: 'session-1',
      subject: 'ریاضی',
      duration: 45,
      completedAt: '2024-01-15T16:30:00Z',
      questionsStudied: 20,
      accuracy: 85
    },
    {
      id: 'session-2',
      subject: 'فیزیک',
      duration: 60,
      completedAt: '2024-01-14T19:00:00Z',
      questionsStudied: 25,
      accuracy: 92
    }
  ];

  // Queries
  const { data: studentStats = mockStudentStats, isLoading: statsLoading } = useQuery({
    queryKey: ['student-stats', selectedTimeRange],
    queryFn: () => Promise.resolve(mockStudentStats),
    refetchInterval: 30000
  });

  const { data: recentExams = mockRecentExams, isLoading: examsLoading } = useQuery({
    queryKey: ['recent-exams'],
    queryFn: () => Promise.resolve(mockRecentExams)
  });

  const { data: upcomingExams = mockUpcomingExams } = useQuery({
    queryKey: ['upcoming-exams'],
    queryFn: () => Promise.resolve(mockUpcomingExams)
  });

  const { data: studySessions = mockStudySessions } = useQuery({
    queryKey: ['study-sessions', selectedTimeRange],
    queryFn: () => Promise.resolve(mockStudySessions)
  });

  // Helper functions
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} ساعت و ${mins} دقیقه`;
    }
    return `${mins} دقیقه`;
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">آزمون‌های تکمیل شده</p>
              <p className="text-2xl font-bold text-gray-900">
                {studentStats.completedExams}/{studentStats.totalExams}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <CheckCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center text-sm text-green-600">
              <span>میانگین نمره: {studentStats.averageScore}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">رتبه کلاسی</p>
              <p className="text-2xl font-bold text-gray-900">
                {studentStats.rank}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <TrophyIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm text-gray-500">
              از {studentStats.totalStudents.toLocaleString('fa-IR')} دانش‌آموز
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">زمان مطالعه</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(studentStats.totalStudyTime / 60)}h
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm text-gray-500">
              {formatDuration(studentStats.totalStudyTime)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">روزهای متوالی</p>
              <p className="text-2xl font-bold text-gray-900">
                {studentStats.streak}
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <FireIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm text-orange-600">
              به همین روال ادامه دهید! 🔥
            </div>
          </div>
        </div>
      </div>

      {/* آزمون‌های اخیر */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">آزمون‌های اخیر</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <BookOpenIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{exam.title}</h4>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                      <span>{exam.subject}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(exam.difficulty)}`}>
                        {exam.difficulty === 'easy' ? 'آسان' : exam.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                      </span>
                      <span>{formatDuration(exam.duration)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className={`text-lg font-bold ${getScoreColor(exam.score, exam.maxScore)}`}>
                    {exam.score}/{exam.maxScore}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(exam.completedAt).toLocaleDateString('fa-IR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* آزمون‌های آینده */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">آزمون‌های آینده</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <h4 className="font-medium text-gray-900">{exam.title}</h4>
                      {exam.isRequired && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">اجباری</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                      <span>{exam.subject}</span>
                      <span>{exam.questionsCount} سؤال</span>
                      <span>{formatDuration(exam.duration)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(exam.scheduledAt).toLocaleDateString('fa-IR')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(exam.scheduledAt).toLocaleTimeString('fa-IR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">دستاوردهای شما</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentStats.achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 border-2 rounded-lg ${getRarityColor(achievement.rarity)}`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(achievement.unlockedAt).toLocaleDateString('fa-IR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">داشبورد دانش‌آموز</h1>
        <p className="text-gray-600">خوش آمدید! پیشرفت تحصیلی خود را مشاهده کنید</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8 space-x-reverse border-b border-gray-200">
          {[
            { id: 'overview', label: 'نمای کلی', icon: ChartBarIcon },
            { id: 'progress', label: 'پیشرفت', icon: AcademicCapIcon },
            { id: 'achievements', label: 'دستاوردها', icon: TrophyIcon },
            { id: 'schedule', label: 'برنامه', icon: CalendarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 space-x-reverse py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-sm text-gray-600">نمایش داده‌های:</span>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">هفته جاری</option>
            <option value="month">ماه جاری</option>
            <option value="semester">ترم جاری</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {statsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
          {activeTab === 'progress' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <p className="text-gray-500">نمودار پیشرفت - در حال توسعه</p>
            </div>
          )}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <p className="text-gray-500">تقویم آزمون‌ها - در حال توسعه</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentDashboard;