# Cloudflare Worker Expression Parser

## Description

This repository is a starter-kit to get NCalc running within Cloudflare workers. This example uses wrangler instead of miniflare, as `node_compat` is not supported on miniflare at the time of writing.

### Why?

An expression parser can be useful for segmentation. One of the main ways is that it allows for the creation of complex and flexible segmentation rules. A segmentation rule is a set of conditions that determine which users or data belong to a particular segment.

With an expression parser, developers can create complex rules by combining multiple conditions and operators. For example, a rule could be created to segment users based on their location, behavior, and purchase history. The expression parser would then parse this rule and determine which users match the conditions, and therefore belong to the segment.

Additionally, an expression parser can also be useful for creating dynamic segments. These segments automatically update based on changing data, such as real-time user behavior. An expression parser would be used to evaluate the conditions in real-time, allowing the segment to update automatically.

Overall, an expression parser enables more granular and accurate segmentation, making it useful for targeted marketing campaigns, personalization, and analytics.

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
curl --location --request POST 'https://expression-worker.thambach.workers.dev' \
--header 'Content-Type: application/json' \
--data-raw '{"data": {"Apples": 12}}'
```

You will receive this output

```
Here's what we got
(ERROR): (Turnips > 100 AND Apples = 12) (because: Parameter 'Turnips' was not defined )
(ERROR): Turnips = 10 AND Apples > 5 (because: Parameter 'Turnips' was not defined )
(MATCH): Apples = 12 OR Turnips = 20
```

You may notice that the output above contains (ERROR). However, you should not consider this an actual error. Any expression that has insufficient parameters defined will cause an error. If we were to change our request to:

```
curl --location --request POST 'https://expression-worker.thambach.workers.dev' \
--header 'Content-Type: application/json' \
--data-raw '{"data": {"Apples": 12, "Turnips": 1000}}'
```

The output will also show mismatches

```
Here's what we got
(MATCH): (Turnips > 100 AND Apples = 12)
(NO MATCH): Turnips = 10 AND Apples > 5
(MATCH): Apples = 12 OR Turnips = 20
```

## Usage

### With Github Actions

Fork the repository and in your forked repository, add the following action secrets. You can find these in your Cloudflare Dashboard.

- CF_API_TOKEN
- CF_ACCOUNT_ID
