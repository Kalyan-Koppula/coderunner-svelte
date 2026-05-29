import { getHighlightedCode } from "$lib/codeMirrorUtils/server";
import { code } from "./data";

export async function load() {
  const [jsx, html] = await Promise.all([getHighlightedCode(code.jsx, "jsx"),getHighlightedCode(code.html, "html")])
  return {
    jsx: {highlightedCode: jsx.htmlOutput, code: code.jsx, language: "jsx", lineCount: jsx.lineCount},
    html: {highlightedCode: html.htmlOutput, code: code.html, language: "html", lineCount: html.lineCount},
  }
}