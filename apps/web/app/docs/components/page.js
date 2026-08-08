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

export default async function ComponentsDocsPage() {
  const uiDocs = getDocContent('media-ui-react');

  return (
    <>
      <Markdown>{uiDocs}</Markdown>
    </>
  );
}
