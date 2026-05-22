import { getHighlightedCode } from "$lib/codeMirrorUtils/server";
import { code } from "./data";

export async function load() {
  const [jsx, html] = await Promise.all([getHighlightedCode(code.jsx, "jsx"),getHighlightedCode(code.html, "html")])
  return {
    jsx: {highlightedCode: jsx, code: code.jsx, language: "jsx"},
    html: {highlightedCode: html, code: code.html, language: "html"},
  }
}