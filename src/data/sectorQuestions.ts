import { SectorQuestion } from './_part1';
import { part1 } from './_part1';
import { part2 } from './_part2';
import { part3 } from './_part3';
import { part4 } from './_part4';
import { part5 } from './_part5';

export type { SectorQuestion };

export const sectorQuestions: Record<string, SectorQuestion[]> = {
  ...part1,
  ...part2,
  ...part3,
  ...part4,
  ...part5,
};
