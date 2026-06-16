/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as allianceSelections from "../allianceSelections.js";
import type * as annotatedVideos from "../annotatedVideos.js";
import type * as annotationAuth from "../annotationAuth.js";
import type * as annotationReplies from "../annotationReplies.js";
import type * as annotations from "../annotations.js";
import type * as ballCounter from "../ballCounter.js";
import type * as cycles from "../cycles.js";
import type * as frcEvents from "../frcEvents.js";
import type * as http from "../http.js";
import type * as metadata from "../metadata.js";
import type * as picklists from "../picklists.js";
import type * as tba from "../tba.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  allianceSelections: typeof allianceSelections;
  annotatedVideos: typeof annotatedVideos;
  annotationAuth: typeof annotationAuth;
  annotationReplies: typeof annotationReplies;
  annotations: typeof annotations;
  ballCounter: typeof ballCounter;
  cycles: typeof cycles;
  frcEvents: typeof frcEvents;
  http: typeof http;
  metadata: typeof metadata;
  picklists: typeof picklists;
  tba: typeof tba;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
