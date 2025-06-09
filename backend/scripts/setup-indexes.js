// MongoDB Index Installation Script
// اسکریپت نصب ایندکس‌های MongoDB
// این اسکریپت را در MongoDB shell اجرا کنید

// text_search_index برای Question
db.Question.createIndex({
  "text": "text"
}, {
  "background": true,
  "name": "question_text_search"
});

// difficulty_category_compound برای Question
db.Question.createIndex({
  "difficulty": 1,
  "category": 1
}, {
  "background": true,
  "name": "question_difficulty_category"
});

// author_published_index برای Question
db.Question.createIndex({
  "authorId": 1,
  "isPublished": 1
}, {
  "background": true,
  "name": "question_author_published"
});

// title_search_index برای CourseExam
db.CourseExam.createIndex({
  "title": "text"
}, {
  "background": true,
  "name": "courseexam_title_search"
});

// author_grade_compound برای CourseExam
db.CourseExam.createIndex({
  "authorId": 1,
  "grade": 1
}, {
  "background": true,
  "name": "courseexam_author_grade"
});

// published_difficulty_index برای CourseExam
db.CourseExam.createIndex({
  "isPublished": 1,
  "difficulty": 1
}, {
  "background": true,
  "name": "courseexam_published_difficulty"
});

// بررسی ایندکس‌های ایجاد شده
print("=== بررسی ایندکس‌های Question ===");
db.Question.getIndexes();

print("=== بررسی ایندکس‌های CourseExam ===");
db.CourseExam.getIndexes();

print("✅ تمام ایندکس‌ها با موفقیت ایجاد شدند!"); 