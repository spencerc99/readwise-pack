import { AuthenticationType, PackVersionDefinition } from "@codahq/packs-sdk";
import { formats } from "./formulas";
import { formulas } from "./formulas";
import { syncTables } from "./formulas";

export const manifest: PackVersionDefinition = {
  version: "1.0.1",
  formulaNamespace: "MyPack",
  // The substance of the pack, imported from other files.
  formulas,
  syncTables,
  formats,
  systemConnectionAuthentication: {
    type: AuthenticationType.CustomHeaderToken,
    headerName: "Authorization",
    tokenPrefix: "Token",
  },
  networkDomains: ["readwise.io"],
};
