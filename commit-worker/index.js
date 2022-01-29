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
          target {
            oid
          }
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
  const { data: { createRef: { ref } } } = await github(query, variables);
  return {
      branch_name: ref.name,
      branch_node_id: ref.target.oid,
  };
}

async function createMessage(branch, fileName, fileContents) {
  const query = `
    mutation($input: CreateCommitOnBranchInput!) {
      createCommitOnBranch(input: $input) {
        commit {
          message
          oid
          url
        }
      }
    }
  `;
  const variables = {
    "input": {
      "branch": {
        "repositoryNameWithOwner": "chromy/chrisdearman",
        "branchName": branch.branch_name,
      },
      "expectedHeadOid": branch.branch_node_id,
      "fileChanges": {
        "additions": [
          {
            "path": fileName,
            "contents": Buffer.from(fileContents).toString("base64"),
          },
        ],
      },
      "message": {
        "headline": `Add ${fileName}`,
      },
    },
  };
  return await github(query, variables);
}

async function handleRequest(request) {
  const branchName = 'branch-for-me';
  const fileName = 'src/b.txt';
  const fileContents = 'some message\n';

  const repository = await fetchRepo();
  const newBranch = await createBranch(branchName, repository);
  const commit = await createMessage(newBranch, fileName, fileContents);
  return new Response(JSON.stringify(commit));
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
