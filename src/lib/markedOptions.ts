import marked, { MarkedOptions, Renderer } from 'marked';
import hljs from 'highlight.js';

const rendererInstance = new marked.Renderer();

rendererInstance.link = (href, title, text) => {
  return (
    '<a target="_blank" href="' +
    href +
    '" title="' +
    title +
    '">' +
    text +
    "</a>"
  );
};

export const markedOptions = ((): MarkedOptions => {
  return {
    highlight: (code, lang) => {
      if (hljs.getLanguage(lang)) return hljs.highlight(lang, code).value;
      return hljs.highlightAuto(code).value;
    }
  }
})();

export const renderer = ((): Renderer => {
  return rendererInstance;
})();
