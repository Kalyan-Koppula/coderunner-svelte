import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { HighlightStyle } from "@codemirror/language";
import { highlightCode, tagHighlighter, tags as t } from "@lezer/highlight";

const bodhakTagClasses = Object.entries(t).map(([key,value]) =>({tag: value, class: `tok-${key}`}));

export const bodhakHighlightStyle = HighlightStyle.define(bodhakTagClasses);

export const getHighlightedCode = (code, language) => {
  let langServer;
  switch(language){
    case("javascript"):
    case("typescript"):
    case("js"):
    case("ts"):
    case("jsx"):
    case("tsx"):
      langServer = javascript({jsx: true});
      break;
    case ("html"):
      langServer = html();
      break;
    default:
      langServer = javascript({jsx: true});
  }
  
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