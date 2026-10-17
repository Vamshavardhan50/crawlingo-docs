export default function LegacyDocs() { return null; }
export function getServerSideProps() {
  return { redirect: { destination: '/quick-start', permanent: true } };
}
