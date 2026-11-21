import { Fragment } from "react";

/**
 * Renders the lightweight markup used for blog content:
 *   "## Heading", "### Subheading", "- list item", and blank-line paragraphs.
 * Content is rendered as React text nodes, so no HTML from the database is ever injected.
 */
export function renderContent(text: string) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block, i) => {
    if (block.startsWith("### ")) return <h3 key={i}>{block.slice(4)}</h3>;
    if (block.startsWith("## ")) return <h2 key={i}>{block.slice(3)}</h2>;
    const lines = block.split("\n");
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      return (
        <ul key={i}>
          {lines.map((l, j) => <li key={j}>{l.replace(/^[-*]\s+/, "")}</li>)}
        </ul>
      );
    }
    return (
      <p key={i}>
        {lines.map((l, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {l}
          </Fragment>
        ))}
      </p>
    );
  });
}
