import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { allowedEntries } from "@janus/core";
import { Button, Div, H1, Input, P, catalog } from "./index.js";
import { registerNativeHost } from "./native-host.js";
import { omitAria } from "./hooks.js";

describe("primitives web", () => {
  it("renders semantic HTML with merged class names", () => {
    render(
      <Div>
        <H1 className="text-xl">Head1</H1>
        <P>Hello</P>
        <Button onPress={() => undefined}>Go</Button>
        <Input aria-label="Name" />
      </Div>,
    );
    expect(document.querySelector("h1")).toHaveTextContent("Head1");
    expect(document.querySelector("h1")?.className).toContain("H1");
    expect(document.querySelector("h1")?.className).toContain("text-xl");
    expect(document.querySelector("p")?.className).toContain("P");
  });

  it("has no serious Axe violations on the core set", async () => {
    const { container } = render(
      <main>
        <H1>Head1</H1>
        <P>Body copy</P>
        <Button>Save</Button>
        <Input aria-label="Email" />
      </main>,
    );
    const results = await axe(container);
    const blocking = results.violations.filter(
      (item) => item.impact === "serious" || item.impact === "critical",
    );
    expect(blocking).toEqual([]);
  });

  it("exports every allowed mapping entry", () => {
    for (const entry of allowedEntries()) {
      expect(catalog[entry.janus], entry.janus).toBeTypeOf("object");
    }
  });

  it("throws stubs in development", () => {
    const Canvas = catalog.Canvas!;
    expect(() => render(<Canvas />)).toThrow(/no portable native equivalent/);
  });

  it("omits aria keys", () => {
    expect(omitAria({ "aria-label": "x", id: "n" })).toEqual({ id: "n" });
  });
});

describe("primitives native host", () => {
  it("uses the registered host and maps a11y", () => {
    registerNativeHost({ Text: "span", View: "section" });
    const previous = process.env.JANUS_PLATFORM;
    process.env.JANUS_PLATFORM = "native";
    const { container } = render(<H1 aria-label="Title">Native title</H1>);
    const node = container.querySelector(".H1");
    expect(node?.getAttribute("accessibilitylabel") ?? node?.getAttribute("aria-label")).toBeTruthy();
    if (previous === undefined) delete process.env.JANUS_PLATFORM;
    else process.env.JANUS_PLATFORM = previous;
  });
});
