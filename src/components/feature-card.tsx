'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy, Terminal, ChevronDown, BookOpen, Clock } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   COPY BUTTON
   ═══════════════════════════════════════════════════════════ */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150',
        copied
          ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
          : 'bg-white/5 text-[var(--code-comment)] hover:bg-white/10 hover:text-white'
      )}
      aria-label="Copy code"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   SYNTAX TOKENIZER (lightweight, no runtime dep)
   ═══════════════════════════════════════════════════════════ */
function tokenizePython(code: string): React.ReactNode {
  const lines = code.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="table-row">
          <span className="table-cell pr-6 select-none text-right text-[#3D4F6B] text-xs w-8">{i + 1}</span>
          <span className="table-cell">
            <PythonLine line={line} />
          </span>
        </div>
      ))}
    </>
  );
}

function PythonLine({ line }: { line: string }) {
  const tokens = line.match(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*'|`[^`]*`|f"[^"]*"|f'[^']*'|\/\/[^\n]*|#[^\n]*|\b(?:from|import|as|with|for|in|if|elif|else|return|def|class|True|False|None|print|lambda|and|or|not|is|await|async|const|let|var|function|pub|use|fn|struct|impl|mut|std|type|interface|export|default)\b|\b\d+\.?\d*\b|@[a-zA-Z_][a-zA-Z0-9_.]*|\b[a-zA-Z_][a-zA-Z0-9_]*\s*(?=\()|\b[a-zA-Z_][a-zA-Z0-9_]*\b|[^\w\s]+|\s+)/g);
  if (!tokens) return <>{line}</>;

  return (
    <>
      {tokens.map((token, idx) => {
        if (token.startsWith('#') || token.startsWith('//')) {
          return <span key={idx} className="token-comment">{token}</span>;
        }
        if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`') || token.startsWith('f"') || token.startsWith("f'")) {
          return <span key={idx} className="token-string">{token}</span>;
        }
        if (token.startsWith('@')) {
          return <span key={idx} className="token-decorator">{token}</span>;
        }
        if (/^(?:from|import|as|with|for|in|if|elif|else|return|def|class|True|False|None|print|lambda|and|or|not|is|await|async|const|let|var|function|pub|use|fn|struct|impl|mut|std|type|interface|export|default)$/.test(token)) {
          return <span key={idx} className="token-keyword">{token}</span>;
        }
        if (/^\d+\.?\d*$/.test(token)) {
          return <span key={idx} className="token-number">{token}</span>;
        }
        if (/\s*(?=\()/.test(token) && /^[a-zA-Z_]/.test(token)) {
          return <span key={idx} className="token-function">{token}</span>;
        }
        if (/^[^\w\s]+$/.test(token)) {
          return <span key={idx} className="token-operator">{token}</span>;
        }
        return <span key={idx}>{token}</span>;
      })}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   CODE BLOCK — Premium design
   ═══════════════════════════════════════════════════════════ */
export function CodeBlock({
  code,
  language = 'python',
  title,
  fileName,
  showLineNumbers = true,
}: {
  code: string;
  language?: string;
  title?: string;
  fileName?: string;
  showLineNumbers?: boolean;
}) {
  const langColors: Record<string, string> = {
    python:     'bg-[#3B82F6]/20 text-[#60A5FA]',
    typescript: 'bg-[#A78BFA]/20 text-[#A78BFA]',
    javascript: 'bg-[#FBBF24]/20 text-[#FBBF24]',
    rust:       'bg-[#FB923C]/20 text-[#FB923C]',
    bash:       'bg-[#34D399]/20 text-[#34D399]',
    toml:       'bg-[#F472B6]/20 text-[#F472B6]',
  };
  const langColor = langColors[language] || 'bg-white/5 text-[var(--code-comment)]';

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--code-border)] bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#28CA41]" />
          </div>
          <div className="flex items-center gap-2">
            {fileName && (
              <span className="text-xs font-mono text-[var(--code-comment)] bg-white/5 px-2 py-0.5 rounded">
                {fileName}
              </span>
            )}
            {title && !fileName && (
              <span className="text-xs text-[var(--code-comment)]">{title}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-mono px-2 py-0.5 rounded font-medium', langColor)}>
            {language}
          </span>
          <CopyBtn text={code} />
        </div>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed m-0 bg-transparent border-none rounded-none">
          <code className="block table w-full font-mono">
            {showLineNumbers ? tokenizePython(code) : (
              <span dangerouslySetInnerHTML={{
                __html: code
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
              }} />
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TERMINAL BLOCK
   ═══════════════════════════════════════════════════════════ */
export function TerminalBlock({
  commands,
  title = 'Terminal',
}: {
  commands: string[];
  title?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] shadow-lg">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--code-border)] bg-white/[0.02]">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <div className="h-3 w-3 rounded-full bg-[#28CA41]" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--code-comment)]">
          <Terminal className="h-3 w-3" />
          {title}
        </div>
        <div className="ml-auto">
          <CopyBtn text={commands.join('\n')} />
        </div>
      </div>
      <div className="p-4 space-y-2 font-mono text-sm">
        {commands.map((cmd, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-[#34D399] select-none mt-0.5">$</span>
            <span className="text-[var(--code-fg)]">{cmd}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB CODE BLOCK — multi-language
   ═══════════════════════════════════════════════════════════ */
const LANG_LABELS: Record<string, string> = {
  python:     '🐍 Python',
  typescript: '📘 Node.js',
  rust:       '🦀 Rust',
  bash:       '💻 Shell',
};

export function TabCodeBlock({
  tabs,
  defaultTab,
}: {
  tabs: { language: string; label?: string; code: string; fileName?: string }[];
  defaultTab?: string;
}) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.language);
  const activeTab = tabs.find(t => t.language === active) || tabs[0];

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] shadow-lg">
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-[var(--code-border)] overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-r border-[var(--code-border)] flex-shrink-0">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <div className="h-3 w-3 rounded-full bg-[#28CA41]" />
        </div>
        {tabs.map(tab => (
          <button
            key={tab.language}
            onClick={() => setActive(tab.language)}
            className={cn(
              'px-4 py-2.5 text-xs font-medium transition-all duration-150 flex-shrink-0 border-r border-[var(--code-border)]',
              active === tab.language
                ? 'bg-white/5 text-white'
                : 'text-[var(--code-comment)] hover:text-white hover:bg-white/[0.03]'
            )}
          >
            {tab.label || LANG_LABELS[tab.language] || tab.language}
          </button>
        ))}
        <div className="ml-auto pr-3 flex-shrink-0">
          <CopyBtn text={activeTab.code} />
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed m-0 bg-transparent border-none rounded-none">
          <code className="block table w-full font-mono">
            {tokenizePython(activeTab.code)}
          </code>
        </pre>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FEATURE CARD
   ═══════════════════════════════════════════════════════════ */
export function FeatureCard({
  icon,
  title,
  description,
  accent = false,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group relative p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--brand-orange)]/30',
        className
      )}
    >
      {/* Icon */}
      <div className={cn(
        'flex h-11 w-11 items-center justify-center rounded-xl mb-4 transition-transform duration-200 group-hover:scale-110',
        accent
          ? 'bg-[var(--brand-orange)] shadow-orange'
          : 'bg-[var(--surface)] border border-[var(--border)]'
      )}>
        <span className={accent ? 'text-white' : 'text-[var(--brand-orange)]'}>
          {icon}
        </span>
      </div>

      <h3 className="font-semibold text-[var(--foreground)] mb-2 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {title}
      </h3>
      <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP CARD
   ═══════════════════════════════════════════════════════════ */
export function StepCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0">
        <div className="step-number">{step}</div>
      </div>
      <div className="flex-1 pb-10">
        <h3 className="font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--foreground-muted)] mb-4">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STATUS BADGE
   ═══════════════════════════════════════════════════════════ */
export function StatusBadge({
  status,
  text,
}: {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  text: string;
}) {
  const styles = {
    success: 'badge-green',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
    error:   'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20',
    info:    'badge-indigo',
    neutral: 'badge-gray',
  };
  const icons = { success: '✓', warning: '⚠', error: '✗', info: 'ℹ', neutral: '·' };

  return (
    <span className={cn('badge', styles[status])}>
      {icons[status]} {text}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE META (reading time, edit on GitHub)
   ═══════════════════════════════════════════════════════════ */
export function PageMeta({
  title,
  description,
  readingTime,
  lastUpdated,
  githubPath,
}: {
  title: string;
  description?: string;
  readingTime?: string;
  lastUpdated?: string;
  githubPath?: string;
}) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
        {title}
      </h1>
      {description && (
        <p className="text-lg text-[var(--foreground-muted)] leading-relaxed mb-4">
          {description}
        </p>
      )}
      {(readingTime || lastUpdated) && (
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--foreground-subtle)]">
          {readingTime && (
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> {readingTime} read
            </span>
          )}
          {lastUpdated && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Updated {lastUpdated}
            </span>
          )}
        </div>
      )}
      <div className="mt-6 border-b border-[var(--border)]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CALLOUT
   ═══════════════════════════════════════════════════════════ */
export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: 'info' | 'tip' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info:    { border: '#6366F1', bg: 'rgba(99,102,241,0.05)', icon: 'ℹ️', label: 'Info' },
    tip:     { border: '#10B981', bg: 'rgba(16,185,129,0.05)', icon: '💡', label: 'Tip' },
    warning: { border: '#F59E0B', bg: 'rgba(245,158,11,0.05)', icon: '⚠️', label: 'Warning' },
    danger:  { border: '#EF4444', bg: 'rgba(239,68,68,0.05)',  icon: '🚨', label: 'Important' },
  };
  const s = styles[type];

  return (
    <div
      className="rounded-xl p-4 my-6 border-l-4"
      style={{ borderLeftColor: s.border, background: s.bg, borderTop: `1px solid ${s.border}20`, borderRight: `1px solid ${s.border}20`, borderBottom: `1px solid ${s.border}20` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
        <div>
          <p className="font-semibold text-[var(--foreground)] text-sm mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {title || s.label}
          </p>
          <div className="text-sm text-[var(--foreground-muted)] leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PREV/NEXT NAVIGATION
   ═══════════════════════════════════════════════════════════ */
export function DocNav({
  prev,
  next,
}: {
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
}) {
  return (
    <div className="mt-16 pt-6 border-t border-[var(--border)] flex items-center justify-between gap-4">
      {prev ? (
        <a
          href={prev.href}
          className="group flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <span className="text-[var(--foreground-subtle)] group-hover:text-[var(--brand-orange)] transition-colors">←</span>
          <div>
            <div className="text-xs text-[var(--foreground-subtle)]">Previous</div>
            <div className="font-medium">{prev.label}</div>
          </div>
        </a>
      ) : <div />}
      {next ? (
        <a
          href={next.href}
          className="group flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors text-right"
        >
          <div>
            <div className="text-xs text-[var(--foreground-subtle)]">Next</div>
            <div className="font-medium">{next.label}</div>
          </div>
          <span className="text-[var(--foreground-subtle)] group-hover:text-[var(--brand-orange)] transition-colors">→</span>
        </a>
      ) : <div />}
    </div>
  );
}
