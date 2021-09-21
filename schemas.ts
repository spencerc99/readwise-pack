/*
 * Schemas for your formulas and sync table go here, e.g.
 */

import { makeObjectSchema, ValueHintType, ValueType } from "@codahq/packs-sdk";

export const bookSchema = makeObjectSchema({
  type: ValueType.Object,
  id: "id",
  primary: "title",
  properties: {
    id: { type: ValueType.String },
    title: { type: ValueType.String },
    author: { type: ValueType.String },
    category: { type: ValueType.String },
    updated: { type: ValueType.String, codaType: ValueHintType.DateTime },
    coverImageUrl: {
      type: ValueType.String,
      codaType: ValueHintType.ImageAttachment,
      fromKey: "cover_image_url",
    },
    sourceUrl: {
      type: ValueType.String,
      codaType: ValueHintType.Url,
      fromKey: "source_url",
    },
    asin: { type: ValueType.String },
  },
  featured: ["id", "author", "title", "category", "updated", "sourceUrl"],
});

export const highlightSchema = makeObjectSchema({
  type: ValueType.Object,
  id: "id",
  primary: "id",
  properties: {
    id: { type: ValueType.String },
    text: { type: ValueType.String },
    note: { type: ValueType.String },
    url: {
      type: ValueType.String,
      codaType: ValueHintType.Url,
    },
    updated: { type: ValueType.String, codaType: ValueHintType.DateTime },
    bookId: {
      type: ValueType.String,
      fromKey: "book_id",
    },
  },
  featured: ["id", "text", "note", "url"],
});
