import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { App } from "./App.js";

describe("kitchen-sink", () => {
  it("renders the catalog without serious Axe violations", async () => {
    const { container } = render(<App />);
    expect(screen.getByText("Kitchen sink")).toBeTruthy();
    const results = await axe(container);
    expect(results.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual(
      [],
    );
  });
});
