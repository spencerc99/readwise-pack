/*
 * Schemas for your formulas and sync table go here, e.g.
 */

import {
  makeObjectSchema,
  makeReferenceSchemaFromObjectSchema,
  ValueHintType,
  ValueType,
} from "@codahq/packs-sdk";

export const bookSchema = makeObjectSchema({
  type: ValueType.Object,
  idProperty: "id",
  displayProperty: "title",
  identity: { name: "Book" },
  properties: {
    id: { type: ValueType.String, required: true },
    title: { type: ValueType.String, required: true },
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
  featuredProperties: [
    "author",
    "category",
    "updated",
    "sourceUrl",
    "coverImageUrl",
  ],
});

export const tagSchema = makeObjectSchema({
  idProperty: "id",
  displayProperty: "name",
  properties: {
    id: { type: ValueType.String, required: true },
    name: { type: ValueType.String, required: true },
  },
});

export const highlightSchema = makeObjectSchema({
  type: ValueType.Object,
  idProperty: "id",
  displayProperty: "text",
  properties: {
    id: { type: ValueType.String, required: true },
    text: { type: ValueType.String, codaType: ValueHintType.Markdown },
    note: { type: ValueType.String, codaType: ValueHintType.Markdown },
    url: {
      type: ValueType.String,
      codaType: ValueHintType.Url,
    },
    updated: { type: ValueType.String, codaType: ValueHintType.DateTime },
    bookId: {
      type: ValueType.String,
      fromKey: "book_id",
    },
    book: makeReferenceSchemaFromObjectSchema(bookSchema),
    tags: { type: ValueType.Array, items: tagSchema },
  },
  featuredProperties: ["note", "url", "updated"],
});
