# NCalc Cloudflare Worker Example

## Description

This repository is a starter-kit to get NCalc running within Cloudflare workers.

## Example

There are currently 3 expressions defined inside `src/index.ts` that match apples and turnips.

```typescript
const expressions = [
  "(Turnips > 100 AND Apples = 12)",
  "Turnips = 10 AND Apples > 5",
  "Apples = 12 OR Turnips = 20",
];
```

By sending the following `curl` request to the demo worker

```
curl --location --request POST 'https://ncalc-worker-init.thambach.workers.dev' \
--header 'Content-Type: application/json' \
--data-raw '{"data": {"Apples": 103, "Turnips": 10}}'
```

You will receive this output

```
Here's what we go
(ERROR): (Balance > 100 AND Matches = 12) (because: Parameter 'Balance' was not defined )
{}(ERROR): Turnips = 10 AND Apples > 5 (because: Parameter 'Turnips' was not defined )
{}(MATCH): Apples = 12 OR Turnips = 20
```

## Usage

### With Github Actions

Fork the repository and in your forked repository, add the following action secrets. You can find these in your Cloudflare Dashboard.

- CF_API_TOKEN
- CF_ACCOUNT_ID

### Locally

TODO
