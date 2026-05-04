import { getHighlightedCode } from "$lib";
import { code } from "./data";

export async function load() {
  return {
    jsx: {highlightedCode: getHighlightedCode(code.jsx, "jsx"), code: code.jsx},
    html: {highlightedCode: getHighlightedCode(code.html, "html"), code: code.html},
  }
  // return {highlightedCode: getHighlightedCode(code.jsx), code: code.jsx};
}