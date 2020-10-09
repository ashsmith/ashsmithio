import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import prism from "react-syntax-highlighter/dist/cjs/styles/prism/prism";

function CodeBlock ({language, value}) {
  return (
    <SyntaxHighlighter language={language} style={prism}>
      {value}
    </SyntaxHighlighter>
  );
}


export default CodeBlock;