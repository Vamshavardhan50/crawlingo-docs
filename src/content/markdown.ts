import type { Doc } from './types';

export function docToMarkdown(page: Doc, resolveLink: (href: string) => string = href => href) {
  const blocks = [`# ${page.title}`, page.description];
  for (const section of page.sections) {
    blocks.push(`<a id="${section.id}"></a>`, `## ${section.title}`, ...(section.paragraphs ?? []));
    for (const example of section.code ?? []) blocks.push(`### ${example.label}`, `\`\`\`${example.language}\n${example.code}\n\`\`\``);
    if (section.table) {
      const row = (cells: string[]) => `| ${cells.map(cell => cell.replaceAll('|', '\\|')).join(' | ')} |`;
      blocks.push([row(section.table.headings), row(section.table.headings.map(() => '---')), ...section.table.rows.map(row)].join('\n'));
    }
    if (section.bullets) blocks.push(section.bullets.map(item => `- ${item}`).join('\n'));
    if (section.links) blocks.push(section.links.map(link => `- [${link.label}](${resolveLink(link.href)})`).join('\n'));
  }
  return blocks.join('\n\n') + '\n';
}
