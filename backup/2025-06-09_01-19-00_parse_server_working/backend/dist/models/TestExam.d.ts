declare const Parse: any;
declare const Question: any;
/**
 * TestExam Schema for Back4App
 * Represents a test exam entity with 40 questions and difficulty distribution
 *
 * ویژگی‌های اصلی:
 * - 40 سوال با توزیع سختی
 * - شخصی‌سازی تعداد/سطح
 * - مدیریت جلسات آزمون
 * - محاسبه نتایج و تحلیل
 */
declare class TestExam extends Parse.Object {
    constructor();
    get title(): any;
    get description(): any;
    get type(): any;
    get status(): any;
    get configuration(): any;
    get questions(): any;
    get questionIds(): any;
    get authorId(): any;
    get author(): any;
    get startTime(): any;
    get endTime(): any;
    get isPublished(): any;
    get metadata(): any;
    set title(value: any);
    set description(value: any);
    set type(value: any);
    set status(value: any);
    set configuration(value: any);
    set questions(value: any);
    set questionIds(value: any);
    set authorId(value: any);
    set author(value: any);
    set startTime(value: any);
    set endTime(value: any);
    set isPublished(value: any);
    set metadata(value: any);
    static create(data: any): Promise<any>;
    static findById(id: any): Promise<any>;
    static findByAuthor(authorId: any, options?: {}): Promise<any>;
    static findPublished(options?: {}): Promise<any>;
    generateQuestions(config?: any): Promise<any[]>;
    publish(): Promise<any>;
    unpublish(): Promise<any>;
    updateStats(sessionResult: any): Promise<any>;
    validate(): {
        isValid: boolean;
        errors: any[];
    };
    shuffleArray(array: any): any[];
    toJSON(): {
        id: any;
        title: any;
        description: any;
        type: any;
        status: any;
        configuration: any;
        questions: any;
        questionIds: any;
        authorId: any;
        startTime: any;
        endTime: any;
        isPublished: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    };
}
declare class ExamSession extends Parse.Object {
    constructor();
    get examId(): any;
    get exam(): any;
    get participantId(): any;
    get participant(): any;
    get status(): any;
    get startTime(): any;
    get endTime(): any;
    get timeRemaining(): any;
    get currentQuestionIndex(): any;
    get answers(): any;
    get score(): any;
    get percentage(): any;
    get resultStatus(): any;
    get metadata(): any;
    set examId(value: any);
    set exam(value: any);
    set participantId(value: any);
    set participant(value: any);
    set status(value: any);
    set startTime(value: any);
    set endTime(value: any);
    set timeRemaining(value: any);
    set currentQuestionIndex(value: any);
    set answers(value: any);
    set score(value: any);
    set percentage(value: any);
    set resultStatus(value: any);
    set metadata(value: any);
    static create(data: any): Promise<any>;
    submitAnswer(questionId: any, answer: any): Promise<any>;
    finishExam(): Promise<any>;
    calculateResult(): Promise<{
        score: number;
        percentage: number;
        totalQuestions: any;
        correctAnswers: number;
        incorrectAnswers: number;
        unansweredQuestions: number;
        resultStatus: string;
        detailedResults: any[];
    }>;
    toJSON(): {
        id: any;
        examId: any;
        participantId: any;
        status: any;
        startTime: any;
        endTime: any;
        timeRemaining: any;
        currentQuestionIndex: any;
        answers: any;
        score: any;
        percentage: any;
        resultStatus: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    };
}
