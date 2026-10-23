export type {
  AriaMapEntry,
  JanusCategory,
  JanusPlatform,
  JanusStatus,
  MappingEntry,
  NativeTarget,
} from "./types.js";
export {
  allowedEntries,
  forbiddenNames,
  getEntry,
  getEntryByWhatwg,
  htmlIntrinsics,
  janusComponentNames,
  mapping,
  type JanusTag,
} from "./mapping.js";
export {
  WEB_ARIA_PROP_NAMES,
  ariaMap,
  mapAriaToNative,
  type MappedA11y,
} from "./a11y.js";
export { clearClassNameCache, mergeClassName } from "./classname.js";
export { getRuntimePlatform, type RuntimePlatform } from "./platform.js";
export {
  FAMILY_ORDER,
  SOURCE_EXTENSIONS,
  assertNoCrossFamily,
  familyFor,
  isWebPlatform,
  overrideCandidates,
  pickOverride,
  splitPlatformSuffix,
  stripSourceExtension,
} from "./resolve-override.js";
export { inputNativeFor, inputTypeMap, type InputKind, type InputTypeMap } from "./input-types.js";
