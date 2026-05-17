import { HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

export const bodhakTagClasses = Object.entries(t).map(([key,value]) =>({tag: value, class: `tok-${key}`}));

export const bodhakHighlightStyle = HighlightStyle.define(bodhakTagClasses);