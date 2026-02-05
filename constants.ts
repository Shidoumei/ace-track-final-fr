
import { ExamLevel, Subject, Paper } from './types';

const generatePapers = (startYear: number, endYear: number, subjectId: string): Paper[] => {
  const papers: Paper[] = [];
  const series: ('May/June' | 'Oct/Nov' | 'Feb/March')[] = ['May/June', 'Oct/Nov'];
  const components = ['P1', 'P2'];
  
  for (let year = endYear; year >= startYear; year--) {
    series.forEach(s => {
      [1, 2, 3].forEach(v => {
        components.forEach(c => {
          papers.push({
            id: `${subjectId}-${year}-${s.substring(0,2)}-${v}-${c}`,
            year,
            series: s,
            variant: v,
            component: c
          });
        });
      });
    });
  }
  return papers;
};

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'cs-9618',
    code: '9618',
    name: 'Computer Science',
    level: ExamLevel.A_LEVEL,
    examBoard: 'Cambridge (CAIE)',
    papers: generatePapers(2021, 2024, 'cs-9618')
  },
  {
    id: 'maths-0580',
    code: '0580',
    name: 'Mathematics',
    level: ExamLevel.IGCSE,
    examBoard: 'Cambridge (CAIE)',
    papers: generatePapers(2020, 2024, 'maths-0580')
  },
  {
    id: 'physics-9702',
    code: '9702',
    name: 'Physics',
    level: ExamLevel.A_LEVEL,
    examBoard: 'Cambridge (CAIE)',
    papers: generatePapers(2021, 2024, 'physics-9702')
  },
  {
    id: 'bio-0610',
    code: '0610',
    name: 'Biology',
    level: ExamLevel.IGCSE,
    examBoard: 'Cambridge (CAIE)',
    papers: generatePapers(2022, 2024, 'bio-0610')
  }
];
