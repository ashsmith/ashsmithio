import React, { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import prism from 'react-syntax-highlighter/dist/cjs/styles/prism/prism';

interface Props {
  className?: string;
  children: unknown;
}

const CodeBlock: FC<Props> = ({ className, children }) => {
  const language = className?.replace('language-', '') ?? '';
  return (
    <SyntaxHighlighter language={language} style={prism}>
      {children}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
