import React, { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import prism from 'react-syntax-highlighter/dist/cjs/styles/prism/prism';

interface Props {
  className?: string;
  children: unknown;
}

const CodeBlock: FC<Props> = ({ className, children }) => {
  const language = className?.replace('language-', '') ?? '';

  if (typeof children === 'string') {
    return (
      <SyntaxHighlighter language={language} style={prism}>{children.replace(/^\n|\n$/g, '')}</SyntaxHighlighter>
    );
  }

  return (
    <SyntaxHighlighter language={language} style={prism}>{children}</SyntaxHighlighter>
  );
};

export default CodeBlock;
