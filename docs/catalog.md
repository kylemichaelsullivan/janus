# Catalog

App code imports ShadCN names from `@janus/react` (or `@janus/ui`) or copies them with `janus add`. Never import Radix, Base UI, or RN Primitives in app source.

## Wave 1

Button, Button Group, Input, Label, Field, Card, Badge, Separator, Alert, Checkbox, Radio Group, Switch, Textarea, Skeleton, Spinner, Kbd, Typography, Aspect Ratio, Avatar, Progress, Toggle, Toggle Group, Empty, Item, Accordion.

## Wave 2

Dialog, Alert Dialog, Drawer, Sheet, Popover, Tooltip, Hover Card (degraded), Collapsible, Scroll Area, Tabs, Dropdown Menu, Context Menu, Select, Native Select, Combobox, Command.

## Wave 3 exceptions

Chart, Table, Calendar, and Sidebar are listed in `packages/ui/src/registry.json` as exceptions. Chart is web-primary. Table semantics are degraded on native. Calendar uses an Expo date-picker override. Sidebar ships after `1.0.0`.
