export type CodeExample = { label: string; language: string; code: string };
export type DocSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  code?: CodeExample[];
  bullets?: string[];
  table?: { headings: string[]; rows: string[][] };
  links?: { label: string; href: string }[];
};
export type Doc = { title: string; description: string; category: string; sections: DocSection[] };
