import { useState } from 'react';
import { FileCode2, WrapText } from 'lucide-react';
import type { CodeExample } from '@/content/types';
import CopyButton from './copy-button';

function HighlightedCode({ code, language }: { code: string; language: string }) {
  if (language === 'text') return <>{code}</>;
  const hashComments = ['python', 'shell', 'bash', 'powershell', 'toml', 'yaml'].includes(language);
  const pattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/[^\n]*|#[^\n]*|\b(?:import|from|as|with|async|await|def|return|if|else|raise|try|except|finally|for|in|const|let|new|export|type|interface|function|class|throw|catch|use|pub|fn|mut|impl|struct|enum|self|Self|True|False|None|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/g;
  return <>{code.split(pattern).map((token, i) => {
    let kind = '';
    if (/^["'`]/.test(token)) kind = 'string';
    else if (token.startsWith('//') || (hashComments && token.startsWith('#'))) kind = 'comment';
    else if (/^\d/.test(token)) kind = 'number';
    else if (/^[\w]+$/.test(token)) kind = 'keyword';
    return kind ? <span key={i} className={`syntax-${kind}`}>{token}</span> : token;
  })}</>;
}

export function CodeBlock({ examples }: { examples: CodeExample[] }) {
  const [selected, setSelected] = useState(0);
  const [wrap, setWrap] = useState(false);
  const current = examples[selected] ?? examples[0];
  return <div className={`code-block ${wrap ? 'code-wrap' : ''}`}>
    <div className="code-toolbar">
      <div className="code-tabs" role="group" aria-label="Code examples">
        {examples.map((example, index) => <button key={example.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{examples.length === 1 && <FileCode2 size={14} />}{example.label}</button>)}
      </div>
      <div className="code-actions"><button className="wrap-code" type="button" aria-label="Wrap code lines" aria-pressed={wrap} title="Wrap code lines" onClick={() => setWrap(value => !value)}><WrapText size={16} /></button><CopyButton text={current.code} className="copy-code" /></div>
    </div>
    <pre tabIndex={0} aria-label={`${current.language} example`}><code><HighlightedCode code={current.code} language={current.language} /></code></pre>
    <div className="code-caption"><span>{current.language}</span><span>{current.code.split('\n').length} lines · copy-ready</span></div>
  </div>;
}
