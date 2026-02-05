
import { Grade } from '../types';

export const calculateGrade = (percentage: number): Grade => {
  if (percentage >= 85) return 'A*';
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  if (percentage >= 30) return 'E';
  return 'U';
};

export const getGradeColor = (grade: Grade): string => {
  switch (grade) {
    case 'A*': return 'bg-emerald-500 text-white';
    case 'A': return 'bg-green-500 text-white';
    case 'B': return 'bg-blue-500 text-white';
    case 'C': return 'bg-amber-500 text-white';
    case 'D': return 'bg-orange-500 text-white';
    case 'E': return 'bg-red-400 text-white';
    default: return 'bg-slate-400 text-white';
  }
};
