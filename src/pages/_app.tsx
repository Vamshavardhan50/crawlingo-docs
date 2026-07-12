import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/theme-provider';
import { Layout } from '@/components/layout';
import '@/styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
