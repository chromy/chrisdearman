addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  const access_token = GITHUB_ACCESS_TOKEN;
  return new Response("Hello World");
}
