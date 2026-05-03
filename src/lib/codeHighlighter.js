import { javascript } from "@codemirror/lang-javascript";
import { HighlightStyle } from "@codemirror/language";
import { highlightCode, tagHighlighter, tags as t } from "@lezer/highlight";

const bodhakTagClasses = Object.entries(t).map(([key,value]) =>({tag: value, class: `tok-${key}`}));

export const bodhakHighlightStyle = HighlightStyle.define(bodhakTagClasses);

export const getHighlightedCode = (code) => {
  const lang = javascript({ jsx: true });
  const parser = lang.language.parser;
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