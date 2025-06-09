import Parse from 'parse/node';
/**
 * Question Schema for Back4App
 * Represents a question entity with comprehensive metadata
 *
 * ویژگی‌های اصلی:
 * - 4 گزینه با اعتبارسنجی
 * - ذخیره لحظه‌ای
 * - صفحه منبع اختیاری
 * - انواع مختلف سوال
 */
declare class Question extends Parse.Object {
    constructor();
    get type(): any;
    get text(): any;
    get options(): any;
    get correctOptions(): any;
    get correctAnswer(): any;
    get allowMultipleCorrect(): any;
    get difficulty(): any;
    get points(): any;
    get explanation(): any;
    get category(): any;
    get lesson(): any;
    get tags(): any;
    get timeLimit(): any;
    get sourcePage(): any;
    get sourceBook(): any;
    get sourceChapter(): any;
    get isDraft(): any;
    get isPublished(): any;
    get authorId(): any;
    get author(): any;
    get lastAutoSave(): any;
    get version(): any;
    get metadata(): any;
    set type(value: any);
    set text(value: any);
    set options(value: any);
    set correctOptions(value: any);
    set correctAnswer(value: any);
    set allowMultipleCorrect(value: any);
    set difficulty(value: any);
    set points(value: any);
    set explanation(value: any);
    set category(value: any);
    set lesson(value: any);
    set tags(value: any);
    set timeLimit(value: any);
    set sourcePage(value: any);
    set sourceBook(value: any);
    set sourceChapter(value: any);
    set isDraft(value: any);
    set isPublished(value: any);
    set authorId(value: any);
    set author(value: any);
    set lastAutoSave(value: any);
    set version(value: any);
    set metadata(value: any);
    static create(data: any): Promise<any>;
    static findById(id: any): Promise<any>;
    static findByAuthor(authorId: any, options?: {}): Promise<any>;
    static findPublished(options?: {}): Promise<any>;
    static searchByText(searchText: any, options?: {}): Promise<any>;
    static getStats(authorId: any): Promise<{
        totalQuestions: any;
        publishedQuestions: any;
        draftQuestions: number;
        validQuestions: any;
        invalidQuestions: number;
        difficultyStats: {
            Easy: any;
            Medium: any;
            Hard: any;
        };
        typeStats: {
            'multiple-choice': any;
            'true-false': any;
            'short-answer': any;
            essay: any;
        };
        categoryStats: any;
        questionsWithSource: any;
    }>;
    publish(): Promise<any>;
    unpublish(): Promise<any>;
    autoSave(data: any): Promise<any>;
    validate(): {
        isValid: boolean;
        errors: any[];
    };
    toJSON(): {
        id: any;
        type: any;
        text: any;
        options: any;
        correctOptions: any;
        correctAnswer: any;
        allowMultipleCorrect: any;
        difficulty: any;
        points: any;
        explanation: any;
        category: any;
        lesson: any;
        tags: any;
        timeLimit: any;
        sourcePage: any;
        sourceBook: any;
        sourceChapter: any;
        isDraft: any;
        isPublished: any;
        authorId: any;
        lastAutoSave: any;
        version: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    };
}
export { Question };
export default Question;
