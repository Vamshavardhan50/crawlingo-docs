import type { GetStaticPaths, GetStaticProps } from 'next';
import DocumentationPage from '@/components/documentation-page';
import { SDK_REFERENCE_DOCS } from '@/content/sdk-reference';
import { REFERENCE_OPERATIONS } from '@/content/reference-operations';

const pages = { ...SDK_REFERENCE_DOCS, ...REFERENCE_OPERATIONS };
export const getStaticPaths: GetStaticPaths = () => ({
  paths: Object.keys(pages).map(path => ({ params: { slug: path.slice('/reference/'.length).split('/') } })),
  fallback: false,
});
export const getStaticProps: GetStaticProps = ({ params }) => {
  const path = '/reference/' + (params?.slug as string[]).join('/');
  return pages[path] ? { props: { path } } : { notFound: true };
};
export default function Reference({ path }: { path: string }) {
  return <DocumentationPage path={path} />;
}
