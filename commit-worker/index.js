
async function github(query, variables) {
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "chromy",
      "Authorization": `bearer ${GITHUB_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const j = await r.json();
  return j;
}

async function fetchRepoId() {
  const query = `
    query {
      repository(owner: "chromy", name: "chrisdearman") {
        id
      }
    }
  `;
  return (await github(query, {})).data.repository.id;
}

//async function createBranch(name) {
//  const query = `
//    mutation ($input: CreateRefInput!) {
//      ref {
//        name
//      }
//    }
//  `;
//  const variables = {
//    "input": {
//      "name": `refs/heads/${name}`,
//
//    },
//  };
//  const r = await graphql(query, variables);
//  const j = await r.json();
//}
//
//async function createMessage(name) {
//  const query = `
//    mutation ($input: CreateCommitOnBranchInput!) {
//      createCommitOnBranchInput {
//        commit {
//          url
//        }
//      }
//    }
//  `;
//  const variables = {
//    "input": {
//      "branch": {
//        "repositoryNameWithOwner": "chromy/chrisdearman",
//        "branchName": "foo",
//      },
//      "message": {
//        "headline": "Hello, world!",
//      },
//      "fileChanges": {
//        "additions" [
//          {
//            "path": "src/a.txt",
//            "contents": Buffer.from("new content here\n").toString("base64"),
//          }
//        ],
//      },
//    },
//  };
//  const r = await graphql(query, variables);
//  const j = await r.json();
//}

async function handleRequest(request) {
  const id = await fetchRepoId();
  console.log(id);
  return new Response(id);
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});


