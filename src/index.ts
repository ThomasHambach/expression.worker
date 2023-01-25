/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { EvaluateOptions, Expression } from "ncalcjs";
import { LogicalExpression } from "ncalcjs/dist/NCalc/Domain";
import { ParameterArgs } from "ncalcjs/dist/NCalc/ParameterArgs";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  KV_EXPRESSIONS: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

const expressions = [
  "(Turnips > 100 AND Apples = 12)",
  "Turnips = 10 AND Apples > 5",
  "Apples = 12 OR Turnips = 20",
];

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // First we need to validate the request and parse the body
    const { headers } = request;
    const contentType = headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return new Response("Content type was not application/json");
    }

    if (request.method !== "POST") {
      return new Response("Request was not a POST");
    }

    const parsed: any = await request.json();
    if (!parsed.hasOwnProperty("data")) {
      return new Response("Your request needs to have the `data` object.");
    }
    let retBody = "Here's what we got\n";

    for (let expression of expressions) {
      try {
        const theExpression = new Expression(
          expression,
          EvaluateOptions.IgnoreCase
        );
        // Cloudflare workers do not support WeakRef, so we need to disable NCalc caching.
        theExpression.Options = EvaluateOptions.NoCache;
        theExpression.Parameters = parsed.data;

        const hasErrors = theExpression.HasErrors();
        if (hasErrors) {
          throw new Error(theExpression.errors);
        }
        const result = theExpression.Evaluate();
        if (result === true) {
          retBody += `(MATCH): ${expression}` + "\n";
        } else {
          retBody += `(NO MATCH): ${expression}` + "\n";
        }
      } catch (e: any) {
        console.error(e); // Allows you to see the error in worker logs
        retBody += `(ERROR): ${expression} (because: ${e.message})` + "\n";
      }
    }

    return new Response(retBody);
  },
};
