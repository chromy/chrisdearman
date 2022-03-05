const GITHUB_USER = "chromy";
const GITHUB_REPO = "chrisdearman";
const BUCKET_NAME = 'chrisdearman.xyz';

async function github(query, variables) {
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": GITHUB_USER,
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
      repository(owner: "${GITHUB_USER}", name: "${GITHUB_REPO}") {
        id
        defaultBranchRef {
          target {
            oid
          }
        }
      }
    }
  `;
  const { data: { repository } } = await github(query, {});
  return {
      repositoryId: repository.id,
      mainBranchNodeId: repository.defaultBranchRef.target.oid,
  };
}

async function createBranch(name, repository) {
  const query = `
    mutation($input: CreateRefInput!) {
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
      "oid": repository.mainBranchNodeId,
      "repositoryId": repository.repositoryId,
    },
  };
  const { data: { createRef: { ref } } } = await github(query, variables);
  return {
      branchName: ref.name,
      branchNodeId: ref.target.oid,
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
        "repositoryNameWithOwner": `${GITHUB_USER}/${GITHUB_REPO}`,
        "branchName": branch.branchName,
      },
      "expectedHeadOid": branch.branchNodeId,
      "fileChanges": {
        "additions": [
          {
            "path": fileName,
            "contents": Buffer.from(fileContents).toString("base64"),
          },
        ],
      },
      "message": {
        "headline": `Add message ${fileName}`,
      },
    },
  };
  return await github(query, variables);
}

async function createPullRequest(branchName, repositoryId) {
  const query = `
    mutation($input: CreatePullRequestInput!) {
      createPullRequest(input: $input) {
        pullRequest {
          url
        }
      }
    }
  `;
  const variables = {
    "input": {
      repositoryId,
      "baseRefName": "main",
      "headRefName": branchName,
      "title": `Land ${branchName}`,
      "body": "",
      "draft": false,
      "maintainerCanModify": true,
    },
  };
  return await github(query, variables);
}


function timestamp() {
  const datetime = new Date();
  const iso = datetime.toISOString();
  return iso.slice(0, 19).replaceAll(":", "-").replaceAll("T", "-")
}


//const fileName = 'foo';
//const {Storage} = require('@google-cloud/storage');
//const storage = new Storage();
//async function generateV4UploadSignedUrl() {
//  const options = {
//    version: 'v4',
//    action: 'write',
//    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
//    contentType: 'application/octet-stream',
//  };
//
//  // Get a v4 signed URL for uploading file
//  const [url] = await storage
//    .bucket(BUCKET_NAME)
//    .file(fileName)
//    .getSignedUrl(options);
//
//  return new Response(JSON.stringify({
//    url,
//  }));
//}


async function handleAddMessage(request) {
  const { headers, method } = request;
  const contentType = headers.get("content-type") || "";

  if (method !== "POST") {
    return new Response(JSON.stringify({
      "error": "Expected POST method",
    }));
  }

  if (!contentType.includes("form")) {
    return new Response(JSON.stringify({
      "error": "Expected contentType is form",
    }));
  }

  const formData = await request.formData()
  const form = {}
  for (const [k, v] of formData.entries()) {
    form[k] = v;
  }

  const branchName = timestamp();
  const fileName = `src/${branchName}.json`;
  const fileContents = JSON.stringify(form, null, 2);
  const repository = await fetchRepo();
  const newBranch = await createBranch(branchName, repository);
  const commit = await createMessage(newBranch, fileName, fileContents);
  const pr = await createPullRequest(branchName, repository.repositoryId);
  const pullRequestUrl = pr.data.createPullRequest.pullRequest.url;
  const url = new URL("https://chrisdearman.xyz");
  url.searchParams.append("flash", pullRequestUrl);
  return Response.redirect(url.toString(), 301);
}

async function handleRequest(request) {
  return handleAddMessage(request);
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
