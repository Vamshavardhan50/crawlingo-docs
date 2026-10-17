import { Html, Head, Main, NextScript } from 'next/document';
import site from '@/content/site.json';
export default function Document() {
  return <Html lang="en" suppressHydrationWarning><Head>
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" /><meta name="theme-color" content="#111916" media="(prefers-color-scheme: dark)" />
    <meta name="google-site-verification" content="2-zTpn3SPBWwB369vAfc9yYPnjYuTvffXoxnlRHVJMo" /><meta property="og:type" content="website" /><meta property="og:site_name" content="Crawlingo" /><meta property="og:image" content={`${site.url}/logo.png`} /><meta name="twitter:card" content="summary" />
    <link rel="icon" href="/favicon.png" type="image/png" /><link rel="apple-touch-icon" href="/favicon.png" /><link rel="manifest" href="/site.webmanifest" />
  </Head><body><Main /><NextScript /></body></Html>;
}
