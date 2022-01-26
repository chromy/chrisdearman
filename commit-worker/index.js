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

async function fetchRepo() {
  const query = `
    query {
      repository(owner: "chromy", name: "chrisdearman") {
        id
        defaultBranchRef {
          target {
            oid
          }
        }
      }
    }
  `;
  const { data: { repository } } = (await github(query, {}));
  return {
      repository_id: repository.id,
      main_branch_node_id: repository.defaultBranchRef.target.oid,
  };
}

async function createBranch(name, repository) {
  const query = `
    mutation($input:CreateRefInput!) {
      createRef(input: $input) {
        ref {
          name
        }
      }
    }
  `;
  const variables = {
    "input": {
      "name": `refs/heads/${name}`,
      "oid": repository.main_branch_node_id,
      "repositoryId": repository.repository_id,
    },
  };
  const data = await github(query, variables);
  return data;
}

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
  const repository = await fetchRepo();
  console.log('BEFORE HANDLE', JSON.stringify(repository));
  const newBranch = await createBranch('test_new_branch', repository);
  console.log('AFTER HANDLE', JSON.stringify(newBranch));
  return new Response(repository);
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});


