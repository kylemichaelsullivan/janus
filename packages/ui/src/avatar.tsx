import { Img, Span } from "@janus/primitives";

export function Avatar({ src, alt }: { src: string; alt: string }) {
  return <Img src={src} alt={alt} className="Avatar size-10 rounded-full" />;
}

export function AvatarFallback({ initials }: { initials: string }) {
  return <Span className="AvatarFallback">{initials}</Span>;
}
