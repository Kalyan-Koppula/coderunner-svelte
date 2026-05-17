import { getHighlightedCode } from "$lib/codeMirrorUtils/server";
import { code } from "./data";

export async function load() {
  return {
    jsx: {highlightedCode: getHighlightedCode(code.jsx, "jsx"), code: code.jsx, language: "jsx"},
    html: {highlightedCode: getHighlightedCode(code.html, "html"), code: code.html, language: "html"},
  }
}