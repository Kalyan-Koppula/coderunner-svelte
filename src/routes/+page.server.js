import { javascript } from "@codemirror/lang-javascript";
import { highlightCode, classHighlighter } from "@lezer/highlight";
import { code } from "./data";

export async function load() {

  // 1. Initialize the language support (exactly like client-side)
  const lang = javascript({ jsx: true });
  
  // 2. Extract the parser from the language object
  const parser = lang.language.parser;
  const tree = parser.parse(code);

  let htmlOutput = "";

  // 3. Use highlightCode (it manages the 'gaps' between tokens automatically)
  highlightCode(
    code,
    tree,
    classHighlighter,
    (text, classes) => {
      // Escape HTML characters to prevent the browser from rendering raw tags
      const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      htmlOutput += classes 
        ? `<span class="${classes}">${escaped}</span>` 
        : escaped;
    },
    () => {
      htmlOutput += "\n"; // Handle line breaks
    }
  );

  return {
    highlightedHtml: `<pre class="cm-s-custom">${htmlOutput}</pre>`
  };
}