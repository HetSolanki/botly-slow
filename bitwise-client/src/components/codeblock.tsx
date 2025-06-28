import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import "prism-themes/themes/prism-vsc-dark-plus.css";
import "./styles.css"; // for custom button styles

const CodeBlock = ({ code }) => {
  return (
    <ReactMarkdown
      children={code}
      rehypePlugins={[rehypePrism]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const language = className?.replace("language-", "") || "";
          const text = String(children).replace(/\n$/, "");

          return !inline ? (
            <div className="code-container">
              <button
                className="copy-button"
                onClick={() => navigator.clipboard.writeText(text)}
              >
                Copy
              </button>
              <pre className={className} {...props}>
                <code className={className}>{children}</code>
              </pre>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default CodeBlock;
