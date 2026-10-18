import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({ text, label = 'Copy code', className = '' }: { text: string; label?: string; className?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => { setStatus('idle'); }, [text]);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch {
      // Keep copying available in embedded previews and non-secure local origins.
      const focus = document.activeElement as HTMLElement | null;
      const selection = window.getSelection();
      const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : [];
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
      document.body.appendChild(textarea);
      textarea.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      textarea.remove();
      focus?.focus({ preventScroll: true });
      selection?.removeAllRanges();
      ranges.forEach(range => selection?.addRange(range));
    }
    setStatus(copied ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 3000);
  }
  return <button type="button" className={`copy-button ${className}`} onClick={copy} aria-label={label} title={status === 'failed' ? 'Copy failed. Select the text and use your keyboard to copy.' : label}>
    {status === 'copied' ? <Check size={15} /> : <Copy size={15} />}
    <span aria-live="polite">{status === 'copied' ? 'Copied!' : status === 'failed' ? 'Select to copy' : label}</span>
  </button>;
}
