/**
 * Scalability Models
 * 
 * Models for database optimization, indexing, and sharding strategies
 */

export interface DatabaseIndex {
  id: string;
  collection: string;
  fields: Record<string, 1 | -1>; // 1 for ascending, -1 for descending
  name: string;
  type: 'single' | 'compound' | 'text' | 'geospatial' | 'partial';
  options?: {
    unique?: boolean;
    sparse?: boolean;
    background?: boolean;
    partialFilterExpression?: Record<string, any>;
  };
  createdAt: Date;
  lastUsed?: Date;
  performance: {
    queryCount: number;
    avgExecutionTime: number; // milliseconds
    hitRate: number; // percentage
    sizeBytes: number;
  };
  status: 'active' | 'building' | 'failed' | 'dropped';
}

export interface ShardingStrategy {
  id: string;
  collection: string;
  shardKey: Record<string, 1 | -1>;
  strategy: 'range' | 'hash' | 'zone';
  balancerEnabled: boolean;
  chunks: {
    shardId: string;
    minKey: Record<string, any>;
    maxKey: Record<string, any>;
    docCount: number;
    sizeBytes: number;
  }[];
  zones?: {
    name: string;
    minKey: Record<string, any>;
    maxKey: Record<string, any>;
    shards: string[];
  }[];
  createdAt: Date;
  lastRebalanced?: Date;
}

export interface PerformanceMetric {
  id: string;
  timestamp: Date;
  collection: string;
  operation: 'find' | 'insert' | 'update' | 'delete' | 'aggregate';
  executionTime: number; // milliseconds
  docsExamined: number;
  docsReturned: number;
  indexUsed?: string;
  queryPlan: any;
  cpu: number; // percentage
  memory: number; // bytes
  diskIO: number; // operations per second
}

export interface CacheConfiguration {
  id: string;
  type: 'redis' | 'memory' | 'disk';
  size: number; // bytes
  ttl: number; // seconds
  hitRate: number; // percentage
  evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'random';
  collections: string[];
  patterns: string[]; // query patterns to cache
  status: 'active' | 'inactive' | 'error';
  createdAt: Date;
  lastFlushed?: Date;
}

export interface OptimizationSuggestion {
  id: string;
  type: 'index' | 'query' | 'schema' | 'sharding' | 'cache';
  priority: 'low' | 'medium' | 'high' | 'critical';
  collection: string;
  description: string;
  impact: {
    performanceGain: number; // percentage
    resourceSavings: number; // percentage
    complexityIncrease: number; // 1-10 scale
  };
  implementation: {
    command: string;
    estimatedTime: number; // minutes
    riskLevel: 'low' | 'medium' | 'high';
  };
  status: 'pending' | 'implementing' | 'completed' | 'rejected';
  createdAt: Date;
  implementedAt?: Date;
}

// پیشنهادات بهینه‌سازی برای collections اصلی
export const COLLECTION_OPTIMIZATIONS = {
  questions: {
    indexes: [
      {
        name: 'course_difficulty_idx',
        fields: { courseExamId: 1, difficulty: 1 },
        type: 'compound',
        rationale: 'بهینه‌سازی کوئری‌های فیلتر سوالات بر اساس درس و سختی'
      },
      {
        name: 'text_search_idx',
        fields: { questionText: 'text', options: 'text' },
        type: 'text',
        rationale: 'جستجوی متنی سریع در محتوای سوالات'
      },
      {
        name: 'created_at_idx',
        fields: { createdAt: -1 },
        type: 'single',
        rationale: 'مرتب‌سازی سریع سوالات جدید'
      },
      {
        name: 'published_exam_idx',
        fields: { isPublishedForTestExam: 1, difficulty: 1 },
        type: 'compound',
        rationale: 'فیلتر سوالات منتشر شده برای آزمون‌های تستی'
      }
    ],
    sharding: {
      shardKey: { courseExamId: 1, _id: 1 },
      strategy: 'range',
      rationale: 'تقسیم بر اساس درس برای عملکرد بهتر کوئری‌ها'
    }
  },
  testExams: {
    indexes: [
      {
        name: 'user_status_idx',
        fields: { userId: 1, status: 1 },
        type: 'compound',
        rationale: 'فیلتر آزمون‌های کاربر بر اساس وضعیت'
      },
      {
        name: 'created_at_idx',
        fields: { createdAt: -1 },
        type: 'single',
        rationale: 'مرتب‌سازی زمانی آزمون‌ها'
      },
      {
        name: 'score_idx',
        fields: { finalScore: -1 },
        type: 'single',
        options: { sparse: true },
        rationale: 'رتبه‌بندی بر اساس نمره'
      }
    ],
    sharding: {
      shardKey: { userId: 1, _id: 1 },
      strategy: 'hash',
      rationale: 'توزیع یکنواخت آزمون‌ها بین کاربران'
    }
  },
  courseExams: {
    indexes: [
      {
        name: 'title_text_idx',
        fields: { title: 'text', description: 'text' },
        type: 'text',
        rationale: 'جستجوی متنی در عنوان و توضیحات دروس'
      },
      {
        name: 'creator_idx',
        fields: { createdBy: 1, createdAt: -1 },
        type: 'compound',
        rationale: 'فیلتر دروس بر اساس سازنده'
      }
    ]
  },
  flashcards: {
    indexes: [
      {
        name: 'user_difficulty_idx',
        fields: { userId: 1, difficulty: 1 },
        type: 'compound',
        rationale: 'فیلتر فلش‌کارت‌ها بر اساس کاربر و سختی'
      },
      {
        name: 'next_review_idx',
        fields: { nextReviewDate: 1 },
        type: 'single',
        rationale: 'یافتن فلش‌کارت‌های آماده مرور'
      }
    ],
    sharding: {
      shardKey: { userId: 1 },
      strategy: 'hash',
      rationale: 'تقسیم بر اساس کاربر'
    }
  }
};
