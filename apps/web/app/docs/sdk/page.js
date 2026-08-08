import fs from 'fs';
import path from 'path';
import Markdown from 'react-markdown';

function getDocContent(pkgName) {
  try {
    let p = path.join(process.cwd(), '../../packages', pkgName, 'README.md');
    if (!fs.existsSync(p)) {
      p = path.join(process.cwd(), 'packages', pkgName, 'README.md');
    }
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf-8');
    }
    return `# Error\nCould not find README.md for ${pkgName} at ${p}`;
  } catch (err) {
    return `# Error\nFailed to load docs for ${pkgName}: ${err.message}`;
  }
}

export default async function SDKDocsPage() {
  const coreDocs = getDocContent('media-core');
  const reactDocs = getDocContent('media-react');

  return (
    <>
      <Markdown>{coreDocs}</Markdown>
      <hr style={{ margin: '4rem 0', borderColor: '#333' }} />
      <Markdown>{reactDocs}</Markdown>
    </>
  );
}
