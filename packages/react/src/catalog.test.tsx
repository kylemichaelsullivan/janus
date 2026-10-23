import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Item,
  JanusPortalHost,
  Kbd,
  Label,
  Main,
  P,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Ul,
} from "./index.js";

function Catalog() {
  return (
    <JanusPortalHost>
      <Main className="mx-auto max-w-xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Catalog</CardTitle>
          </CardHeader>
          <CardContent>Single-source layers compiled to semantic HTML.</CardContent>
          <Field label="Name" htmlFor="name">
            <Input id="name" aria-label="Name" />
          </Field>
          <Label htmlFor="plan-pro">Plan</Label>
          <RadioGroup name="plan" defaultValue="pro">
            <RadioGroupItem value="pro" label="Pro" />
            <RadioGroupItem value="hobby" label="Hobby" />
          </RadioGroup>
          <Progress value={32} />
          <Alert title="Axe-gated">Serious and critical violations fail CI.</Alert>
          <Tabs defaultValue="one">
            <TabsList>
              <TabsTrigger value="one">One</TabsTrigger>
              <TabsTrigger value="two">Two</TabsTrigger>
            </TabsList>
            <TabsContent value="one">First panel</TabsContent>
            <TabsContent value="two">Second panel</TabsContent>
          </Tabs>
          <Select>
            <SelectTrigger>Theme</SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
          <Collapsible>
            <CollapsibleTrigger>More</CollapsibleTrigger>
            <CollapsibleContent>
              <P>
                Press <Kbd>⌘K</Kbd> in a later release.
              </P>
            </CollapsibleContent>
          </Collapsible>
          <Dialog>
            <DialogTrigger>Open dialog</DialogTrigger>
            <DialogContent>
              <DialogTitle>Hello</DialogTitle>
              <P>Dismiss with the close button or the backdrop.</P>
              <DialogClose>Close</DialogClose>
            </DialogContent>
          </Dialog>
          <ButtonGroup>
            <Button>Primary</Button>
          </ButtonGroup>
          <Ul>
            <Item>Wave 1 and wave 2 layers</Item>
          </Ul>
        </Card>
      </Main>
    </JanusPortalHost>
  );
}

describe("@janus/react catalog", () => {
  it("renders composed layers without serious Axe violations", async () => {
    const { container } = render(<Catalog />);
    expect(screen.getByText("Catalog")).toBeTruthy();
    const results = await axe(container);
    expect(results.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual(
      [],
    );
  });
});
