
export enum ExamLevel {
  IGCSE = 'IGCSE',
  AS_LEVEL = 'AS Level',
  A_LEVEL = 'A Level',
  O_LEVEL = 'O Level'
}

export enum PaperStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export enum ConfidenceLevel {
  CONFIDENT = 'Confident',
  UNSURE = 'Unsure',
  DIFFICULT = 'Difficult'
}

export enum TaskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum TaskType {
  REVISION = 'Revision',
  EXAM = 'Exam',
  PAST_PAPER = 'Past Paper',
  ASSIGNMENT = 'Assignment',
  MOCK_TEST = 'Mock Test',
  STUDY = 'Study',
  OTHER = 'Other'
}

export type Grade = 'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'U';

export type MistakeCategory = 'Silly Error' | 'Conceptual Gap' | 'Time Management' | 'Misread Question' | 'Other' | string;

export interface Mistake {
  id: string;
  category: MistakeCategory;
  description: string;
  topic?: string;
  questionNumber: string; // Made compulsory
}

export interface WrongQuestion {
  id: string;
  number: string;
  topic?: string;
}

export interface Paper {
  id: string;
  year: number;
  series: 'May/June' | 'Oct/Nov' | 'Feb/March';
  variant: number;
  component: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  level: ExamLevel;
  examBoard: string;
  papers: Paper[];
  syllabus?: string;
  targetGrade?: Grade;
}

export interface PaperProgress {
  paperId: string;
  subjectId: string;
  status: PaperStatus;
  userMark?: number;
  totalMarks?: number;
  score?: number; // percentage
  grade?: Grade;
  timeTaken?: number; // in seconds
  dateCompleted?: string;
  notes?: string;
  mistakes?: Mistake[];
  wrongQuestions?: WrongQuestion[];
  // Metadata for robust filtering
  year?: number;
  session?: string;
  variant?: number;
  component?: string;
}

export interface TopicalProgress {
  id: string;
  subjectId: string;
  topicName: string;
  chapter: string;
  userMark?: number;
  totalMarks?: number;
  score?: number;
  timeTaken?: number;
  dateCompleted: string;
  mistakes?: Mistake[];
  wrongQuestions?: WrongQuestion[];
}

export interface StudyTopic {
  id: string;
  subjectId: string;
  unit: string;
  topic: string;
  confidence: ConfidenceLevel;
  completed: boolean; // Added
  comment?: string;   // Added
}

export interface StudyTask {
  id: string;
  title: string;
  date: string;
  allDay: boolean;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  priority: TaskPriority;
  type: TaskType;
  subjectId: string;
  repeat: string;
  notes: string;
  completed: boolean;
}
