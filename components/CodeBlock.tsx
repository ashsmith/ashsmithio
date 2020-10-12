import React, { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import prism from 'react-syntax-highlighter/dist/cjs/styles/prism/prism';

interface Props {
  language: string;
  value: unknown;
}

const CodeBlock: FC<Props> = ({ language, value }) => (
  <SyntaxHighlighter language={language} style={prism}>
    {value}
  </SyntaxHighlighter>
);

export default CodeBlock;
