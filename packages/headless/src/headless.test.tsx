import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  JanusPortalHost,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./index.js";

describe("headless dialog", () => {
  it("opens, is axe-clean, and dismisses", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <JanusPortalHost>
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Settings</DialogTitle>
            <DialogClose>Done</DialogClose>
          </DialogContent>
        </Dialog>
      </JanusPortalHost>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    const results = await axe(container);
    expect(results.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual([]);
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("headless collapsible and select", () => {
  it("toggles disclosure and picks a value", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Collapsible>
          <CollapsibleTrigger>Details</CollapsibleTrigger>
          <CollapsibleContent>Shown</CollapsibleContent>
        </Collapsible>
        <Select>
          <SelectTrigger>Pick</SelectTrigger>
          <SelectContent>
            <SelectItem value="alpha">Alpha choice</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger>Hint</PopoverTrigger>
          <PopoverContent>Tip</PopoverContent>
        </Popover>
      </>,
    );
    expect(screen.queryByText("Shown")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Details" }));
    expect(screen.getByText("Shown")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Pick" }));
    await user.click(screen.getByRole("option", { name: "Alpha choice" }));
    await user.click(screen.getByRole("button", { name: "Hint" }));
    expect(screen.getByLabelText("Popover")).toBeTruthy();
    const results = await axe(container);
    expect(results.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual([]);
  });
});

describe("headless tabs", () => {
  it("switches panels", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Alpha</TabsContent>
        <TabsContent value="two">Beta</TabsContent>
      </Tabs>,
    );
    expect(screen.getByText("Alpha")).toBeTruthy();
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByText("Beta")).toBeTruthy();
  });
});
