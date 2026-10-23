import { JanusPortalHost } from "@janus/headless";
import { Slot } from "@janus/router";

export default function RootLayout() {
  return (
    <JanusPortalHost>
      <Slot />
    </JanusPortalHost>
  );
}
