import production from 'react/jsx-runtime';
import rehypeReact from 'rehype-react';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export async function MarkdownViewer({ text }: { text: string }) {
  const file = await unified()
    // text -> MDAST(markdown AST)
    .use(remarkParse)
    // MDAST -> HAST(HTML AST)
    .use(remarkRehype)
    // HAST -> React elements
    .use(rehypeReact, production)
    .process(text);

  return <div className="markdown-viewer">{file.result}</div>;
}
