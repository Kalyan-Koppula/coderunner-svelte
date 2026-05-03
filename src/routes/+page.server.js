import { getHighlightedCode } from "$lib";
import { code } from "./data";

export async function load() {
  return {highlightedCode: getHighlightedCode(code), code};
}