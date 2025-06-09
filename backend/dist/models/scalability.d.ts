/**
 * Scalability Models
 *
 * Models for database optimization, indexing, and sharding strategies
 */
export interface DatabaseIndex {
    id: string;
    collection: string;
    fields: Record<string, 1 | -1 | 'text'>;
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
        avgExecutionTime: number;
        hitRate: number;
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
    executionTime: number;
    docsExamined: number;
    docsReturned: number;
    indexUsed?: string;
    queryPlan: any;
    cpu: number;
    memory: number;
    diskIO: number;
}
export interface CacheConfiguration {
    id: string;
    type: 'redis' | 'memory' | 'disk';
    size: number;
    ttl: number;
    hitRate: number;
    evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'random';
    collections: string[];
    patterns: string[];
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
        performanceGain: number;
        resourceSavings: number;
        complexityIncrease: number;
    };
    implementation: {
        command: string;
        estimatedTime: number;
        riskLevel: 'low' | 'medium' | 'high';
    };
    status: 'pending' | 'implementing' | 'completed' | 'rejected';
    createdAt: Date;
    implementedAt?: Date;
}
export declare const COLLECTION_OPTIMIZATIONS: {
    questions: {
        indexes: ({
            name: string;
            fields: {
                courseExamId: number;
                difficulty: number;
                questionText?: undefined;
                options?: undefined;
                createdAt?: undefined;
                isPublishedForTestExam?: undefined;
            };
            type: string;
            rationale: string;
        } | {
            name: string;
            fields: {
                questionText: string;
                options: string;
                courseExamId?: undefined;
                difficulty?: undefined;
                createdAt?: undefined;
                isPublishedForTestExam?: undefined;
            };
            type: string;
            rationale: string;
        } | {
            name: string;
            fields: {
                createdAt: number;
                courseExamId?: undefined;
                difficulty?: undefined;
                questionText?: undefined;
                options?: undefined;
                isPublishedForTestExam?: undefined;
            };
            type: string;
            rationale: string;
        } | {
            name: string;
            fields: {
                isPublishedForTestExam: number;
                difficulty: number;
                courseExamId?: undefined;
                questionText?: undefined;
                options?: undefined;
                createdAt?: undefined;
            };
            type: string;
            rationale: string;
        })[];
        sharding: {
            shardKey: {
                courseExamId: number;
                _id: number;
            };
            strategy: string;
            rationale: string;
        };
    };
    testExams: {
        indexes: ({
            name: string;
            fields: {
                userId: number;
                status: number;
                createdAt?: undefined;
                finalScore?: undefined;
            };
            type: string;
            rationale: string;
            options?: undefined;
        } | {
            name: string;
            fields: {
                createdAt: number;
                userId?: undefined;
                status?: undefined;
                finalScore?: undefined;
            };
            type: string;
            rationale: string;
            options?: undefined;
        } | {
            name: string;
            fields: {
                finalScore: number;
                userId?: undefined;
                status?: undefined;
                createdAt?: undefined;
            };
            type: string;
            options: {
                sparse: boolean;
            };
            rationale: string;
        })[];
        sharding: {
            shardKey: {
                userId: number;
                _id: number;
            };
            strategy: string;
            rationale: string;
        };
    };
    courseExams: {
        indexes: ({
            name: string;
            fields: {
                title: string;
                description: string;
                createdBy?: undefined;
                createdAt?: undefined;
            };
            type: string;
            rationale: string;
        } | {
            name: string;
            fields: {
                createdBy: number;
                createdAt: number;
                title?: undefined;
                description?: undefined;
            };
            type: string;
            rationale: string;
        })[];
    };
    flashcards: {
        indexes: ({
            name: string;
            fields: {
                userId: number;
                difficulty: number;
                nextReviewDate?: undefined;
            };
            type: string;
            rationale: string;
        } | {
            name: string;
            fields: {
                nextReviewDate: number;
                userId?: undefined;
                difficulty?: undefined;
            };
            type: string;
            rationale: string;
        })[];
        sharding: {
            shardKey: {
                userId: number;
            };
            strategy: string;
            rationale: string;
        };
    };
};
