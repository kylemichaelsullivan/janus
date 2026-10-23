export type InputKind = "ok" | "degraded" | "stub";

export interface InputTypeMap {
  type: string;
  native: string;
  status: InputKind;
}

export const inputTypeMap: readonly InputTypeMap[] = [
  { type: "text", native: "TextInput", status: "ok" },
  { type: "email", native: "TextInput", status: "ok" },
  { type: "password", native: "TextInput", status: "ok" },
  { type: "search", native: "TextInput", status: "ok" },
  { type: "tel", native: "TextInput", status: "ok" },
  { type: "url", native: "TextInput", status: "ok" },
  { type: "number", native: "TextInput", status: "ok" },
  { type: "checkbox", native: "Checkbox", status: "ok" },
  { type: "radio", native: "Radio", status: "ok" },
  { type: "range", native: "Slider", status: "ok" },
  { type: "hidden", native: "none", status: "ok" },
  { type: "submit", native: "Button", status: "ok" },
  { type: "button", native: "Button", status: "ok" },
  { type: "reset", native: "Button", status: "ok" },
  { type: "date", native: "DatePicker", status: "degraded" },
  { type: "datetime-local", native: "DatePicker", status: "degraded" },
  { type: "month", native: "DatePicker", status: "degraded" },
  { type: "week", native: "DatePicker", status: "degraded" },
  { type: "time", native: "DatePicker", status: "degraded" },
  { type: "file", native: "none", status: "stub" },
  { type: "color", native: "none", status: "stub" },
  { type: "image", native: "none", status: "stub" },
];

export function inputNativeFor(type = "text"): InputTypeMap {
  return inputTypeMap.find((entry) => entry.type === type) ?? inputTypeMap[0]!;
}
