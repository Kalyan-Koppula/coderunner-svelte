import { highlightCode, tagHighlighter } from "@lezer/highlight";
import { bodhakTagClasses, languageLoaders, normalizeLanguage } from "../common";

export const getHighlightedCode = async (code, language) => {
  let langServer = await languageLoaders[normalizeLanguage(language)]();
  
  const parser = langServer.language.parser;
  const tree = parser.parse(code);

  const serverHighlighter = tagHighlighter(bodhakTagClasses);

  let htmlOutput = "";

  highlightCode(
    code,
    tree,
    serverHighlighter,
    (text, classes) => {
      const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      htmlOutput += classes ? `<span class="${classes}">${escaped}</span>` : escaped;
    },
    () => htmlOutput += "\n"
  );

  return htmlOutput;
}