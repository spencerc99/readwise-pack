import {
  ConnectionRequirement,
  ExecutionContext,
  FetchResponse,
  Format,
  makeSyncTable,
  newPack,
  withQueryParams,
} from "@codahq/packs-sdk";
import type { GenericSyncTable } from "@codahq/packs-sdk";
import type { Formula } from "@codahq/packs-sdk";
import { bookSchema } from "./schemas";
import {
  Continuation,
  SyncFormula,
  SyncFormulaResult,
} from "@codahq/packs-sdk/dist/api";
import { ReadwiseBook } from "./types";

const baseApiUrl = "readwise.io/api/v2";

export function apiUrl(path: string, params?: Record<string, any>): string {
  const url = `https://${baseApiUrl}${path}`;
  return withQueryParams(url, params || {});
}

// See if Readwise has given us the url of a next page of results.
function nextUrlFromResponse(
  path: string,
  params: Record<string, any>,
  response: FetchResponse<any>
): string | undefined {
  const nextPageUrl = response.body?.next;
  if (nextPageUrl) {
    return nextPageUrl;
  }
}

async function listBooks(
  [],
  context: ExecutionContext,
  continuation: Continuation | undefined
) {
  const url = continuation
    ? (continuation.nextUrl as string)
    : apiUrl(`/books`);
  const response = await context.fetcher.fetch({ method: "GET", url });
  const { results } = response.body;
  const nextUrl = nextUrlFromResponse("", {}, response);
  return {
    result: mapBooks(results),
    continuation: nextUrl ? { nextUrl } : undefined,
  };
}

export const formulas: Formula[] = [
  // Formula definitions go here, e.g.
  // makeStringFormula({ ... }),
];

function mapBooks(books: ReadwiseBook[]) {
  return books;
}

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
      connectionRequirement: ConnectionRequirement.None,
    },
    // The resultType defines what will be returned in your Coda doc. Here, we're returning a simple text string.
    schema: bookSchema,
  }),
];

export const formats: Format[] = [
  // Column formats go here, e.g.
  // {name: 'MyFormat', formulaNamespace: 'MyPack', formulaName: 'MyFormula'}
];
