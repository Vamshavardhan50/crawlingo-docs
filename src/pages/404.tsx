import Head from 'next/head';
import Link from 'next/link';
export default function NotFound() {
  return <article className="doc-article"><Head><title>Page not found · Crawlingo</title></Head><span className="eyebrow">404</span><h1>This guide has moved.</h1><p className="lead">Use the documentation search, or start with the dataset quick start.</p><div className="hero-actions"><Link className="button button-primary" href="/quick-start">Open the quick start</Link><Link className="button" href="/">Documentation home</Link></div></article>;
}
