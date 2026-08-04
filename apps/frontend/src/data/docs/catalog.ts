import instructionsData from '@/data/instructions.json';
import type { Instruction } from '@/types';

export type ProductGroup = 'desktop' | 'cloud' | 'mobile';

export interface DocScenario {
  href: string;
  label: string;
  short?: string;
  desc?: string;
}

export interface DocProduct {
  id: string;
  label: string;
  desc: string;
  group: ProductGroup;
  color: string;
  bgGradient: string;
  href: string;
  scenarios: DocScenario[];
}

export interface SidebarSection {
  label: string;
  items: {
    href: string;
    label: string;
    children?: { href: string; label: string }[];
  }[];
}

export const docProducts: DocProduct[] = [];

const instructions = instructionsData as unknown as Instruction[];

export const docSections: SidebarSection[] = [
  {
    label: 'Инструкции',
    items: instructions.map((ins) => ({ href: `/docs/${ins.id}`, label: ins.title })),
  },
];
