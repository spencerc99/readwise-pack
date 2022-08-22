import { AuthenticationType } from "@codahq/packs-sdk";
import { ConnectionRequirement, withQueryParams } from "@codahq/packs-sdk";
import { highlightSchema, bookSchema } from "./schemas";
import { ReadwiseBook } from "./types";
import * as coda from "@codahq/packs-sdk";

export const pack = coda.newPack();

pack.setUserAuthentication({
  type: AuthenticationType.CustomHeaderToken,
  headerName: "Authorization",
  tokenPrefix: "Token",
});

pack.addNetworkDomain("readwise.io");

const baseApiUrl = "readwise.io/api/v2";

export function apiUrl(path: string, params?: Record<string, any>): string {
  const url = `https://${baseApiUrl}${path}`;
  return withQueryParams(url, params || {});
}

function mapBooks(books: ReadwiseBook[]) {
  return books;
}

function mapHighlights(highlights) {
  return highlights;
}

async function listBooks([], context: coda.ExecutionContext) {
  const { continuation } = context.sync || {};
  console.log("Continuation: " + JSON.stringify(continuation, null, 2));
  const url = continuation
    ? (continuation.nextUrl as string)
    : withQueryParams(apiUrl(`/books`), { page_size: 500 });
  console.log(`Fetching from ${url}`);
  const response = await context.fetcher.fetch({ method: "GET", url });
  const { results, next: nextUrl } = response.body;
  console.log(response.body);
  console.log("Next URL: " + nextUrl);
  console.log(`Found ${results.length} books`);
  return {
    result: mapBooks(results),
    continuation: nextUrl ? { nextUrl } : undefined,
  };
}

async function listHighlights([], context: coda.ExecutionContext) {
  const { continuation } = context.sync || {};
  const url = continuation
    ? (continuation.nextUrl as string)
    : withQueryParams(apiUrl(`/highlights`), { page_size: 1000 });
  console.log(`Fetching from ${url}`);
  const response = await context.fetcher.fetch({ method: "GET", url });
  const { results, next: nextUrl } = response.body;
  console.log(response.body);
  console.log("Next URL: " + nextUrl);
  console.log(`Found ${results.length} highlights`);
  return {
    result: mapHighlights(results),
    continuation: nextUrl ? { nextUrl } : undefined,
  };
}

pack.addSyncTable({
  // This is the name that will be called in the formula builder. Remember, your formula name cannot have spaces in it.
  name: "Books",
  identityName: "Books",

  formula: {
    name: "GetBooks",
    description: "get books from readwise.",
    // If your formula requires one or more inputs, you’ll define them here.
    // Here, we're creating a string input called “name”.
    parameters: [],

    // Everything inside this execute statement will happen anytime your Coda function is called in a doc.
    // An array of all user inputs is always the 1st parameter.
    execute: listBooks,
    // This indicates whether or not your sync table requires an account connection.
    connectionRequirement: ConnectionRequirement.Required,
  },
  // The resultType defines what will be returned in your Coda doc. Here, we're returning a simple text string.
  schema: bookSchema,
});
pack.addSyncTable({
  // This is the name that will be called in the formula builder. Remember, your formula name cannot have spaces in it.
  name: "Highlights",
  identityName: "Highlights",

  formula: {
    name: "GetHighlights",
    description: "get highlights from readwise.",
    // If your formula requires one or more inputs, you’ll define them here.
    // Here, we're creating a string input called “name”.
    parameters: [],

    // Everything inside this execute statement will happen anytime your Coda function is called in a doc.
    // An array of all user inputs is always the 1st parameter.
    execute: listHighlights,
    // This indicates whether or not your sync table requires an account connection.
    connectionRequirement: ConnectionRequirement.Required,
  },
  // The resultType defines what will be returned in your Coda doc. Here, we're returning a simple text string.
  schema: highlightSchema,
});
