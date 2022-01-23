# To build
- `npm install`
- `tools/assets fetch`
- `serveit './tools/build' -s out/site/`

# TODO
- Favicon
- CSS for photo gallery
- Write obit

# Notes

## Other one time setup things
- `gsutil web set -m index.html -e 404.html gs://chrisdearman.xyz`
- `gsutil iam ch allUsers:objectViewer gs://chrisdearman.xyz`

## Creating Cloudflare kv namespace
```
$ wrangler kv:namespace create "TRAFFIC"
# Then add output to home-page-worker/wrangler.toml
```

## Creating `GCP_SA_KEY`
1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts/
2. Create service account named githubactions
3. Add "Storage object creator"
4. Add "Storage object viewer"
5. Done.
6. Add key

## Secrets
- `CF_API_TOKEN` for Cloudflare Worker deploy, https://dash.cloudflare.com/profile/api-tokens
- `GCP_PROJECT_ID` project name
- `GCP_SA_KEY` see above
