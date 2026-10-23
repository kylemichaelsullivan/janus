import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Ul } from "@janus/primitives";
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  Empty,
  Field,
  Input,
  Item,
  Kbd,
  Label,
  NativeSelect,
  NativeSelectOption,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Separator,
  Spinner,
  Toggle,
  TypographyH2,
} from "./index.js";

async function expectAxeClean(container: HTMLElement) {
  const results = await axe(container);
  expect(results.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual(
    [],
  );
}

describe("ui layers", () => {
  it("compose without Axe violations", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <Badge>New</Badge>
        </CardHeader>
        <CardContent>Details</CardContent>
        <Label htmlFor="email">Email</Label>
        <Input id="email" aria-label="Email" />
        <Separator />
        <Alert title="Saved">Your changes are stored.</Alert>
        <Button>Continue</Button>
        <Spinner />
      </Card>,
    );
    expect(container.querySelector("h3")).toHaveTextContent("Profile");
    await expectAxeClean(container);
  });

  it("covers wave 1 form and display layers", async () => {
    const { container } = render(
      <Card>
        <TypographyH2>Settings</TypographyH2>
        <Field label="Handle" htmlFor="handle">
          <Input id="handle" aria-label="Handle" />
        </Field>
        <RadioGroup name="plan" defaultValue="pro">
          <RadioGroupItem value="pro" label="Pro" />
          <RadioGroupItem value="free" label="Free" />
        </RadioGroup>
        <ButtonGroup>
          <Button>Save</Button>
          <Toggle>Bold</Toggle>
        </ButtonGroup>
        <Kbd>⌘K</Kbd>
        <Progress value={40} />
        <Empty>Nothing queued.</Empty>
        <Ul>
          <Item>First item</Item>
        </Ul>
      </Card>,
    );
    expect(screen.getByLabelText("Handle")).toBeTruthy();
    expect(screen.getByRole("progressbar")).toBeTruthy();
    await expectAxeClean(container);
  });

  it("opens select and collapsible overlays", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Card>
        <Select defaultValue="one">
          <SelectTrigger>Choose</SelectTrigger>
          <SelectContent>
            <SelectItem value="one">One</SelectItem>
            <SelectItem value="two">Two</SelectItem>
          </SelectContent>
        </Select>
        <Collapsible>
          <CollapsibleTrigger>More</CollapsibleTrigger>
          <CollapsibleContent>Hidden copy</CollapsibleContent>
        </Collapsible>
        <Combobox label="Fruit" options={["Apple", "Pear"]} />
        <NativeSelect aria-label="Native fruit">
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
        </NativeSelect>
      </Card>,
    );
    await user.click(screen.getByRole("button", { name: "Choose" }));
    await user.click(screen.getByRole("option", { name: "Two" }));
    await user.click(screen.getByRole("button", { name: "More" }));
    expect(screen.getByText("Hidden copy")).toBeTruthy();
    await expectAxeClean(container);
  });
});
