import {
  ConnectionRequirement,
  ExecutionContext,
  FetchResponse,
  Format,
  makeSyncTable,
  newPack,
  ParameterType,
  withQueryParams,
} from "@codahq/packs-sdk";
import type { GenericSyncTable } from "@codahq/packs-sdk";
import type { Formula } from "@codahq/packs-sdk";
import { highlightSchema, bookSchema } from "./schemas";
import {
  Continuation,
  makeFormula,
  makeObjectFormula,
  SyncFormula,
  SyncFormulaResult,
} from "@codahq/packs-sdk/dist/api";
import { ReadwiseBook } from "./types";

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

async function listBooks([], context: ExecutionContext) {
  const { continuation } = context.sync;
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

async function listHighlights([], context: ExecutionContext) {
  const { continuation } = context.sync;
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

export const formulas: Formula[] = [
  // Formula definitions go here, e.g.
  // makeStringFormula({ ... }),
];

export const syncTables: GenericSyncTable[] = [
  // Sync table definitions go here, e.g.
  makeSyncTable({
    // This is the name that will be called in the formula builder. Remember, your formula name cannot have spaces in it.
    name: "GetBooks",
    identityName: "GetBooks",

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
  }),
  makeSyncTable({
    // This is the name that will be called in the formula builder. Remember, your formula name cannot have spaces in it.
    name: "GetHighlights",
    identityName: "GetHighlights",

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
  }),
];

export const formats: Format[] = [
  // Column formats go here, e.g.
  // {name: 'MyFormat', formulaNamespace: 'MyPack', formulaName: 'MyFormula'}
];
