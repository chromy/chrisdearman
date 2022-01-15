class ElementHandler {
  constructor(path) {
    this.path = path;
  }

  element(element) {
    element.prepend(`<base href="//${this.path}">`, {
      html: true,
    });
  }

  comments(comment) {
  }

  text(text) {
  }
}

async function handleRequest(request) {
  const buildId = await TRAFFIC.get("build");
  const path = `chrisdearman.xyz/builds/${buildId}/`;
  const r = await fetch(`https://${path}`);
  return new HTMLRewriter().on("head", new ElementHandler(path)).transform(r);
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
});
