/*
 * Types for third-party API objects, if any, go here, e.g.
 */

export interface ReadwiseBook {
  id: string;
  title: string;
  author: string;
  category: string;
  updated: string;
  cover_image_url: string;
  source_url: string | null;
  asin: string | null;
}

// export interface FooAPIResponse {
//   id: number;
//   first_name: string;
//   last_name: string;
//   created_at: string;
// }

/*
 * Types for objects that your formulas return, if any, go here, e.g.
 */

// export interface MyFormulaResponse {
//   id: number;
//   fullName: string;
//   createdAt: string;
// }
