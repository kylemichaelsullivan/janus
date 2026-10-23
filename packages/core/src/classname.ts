const CLASS_CACHE = new Map<string, string>();
const CLASS_CACHE_LIMIT = 512;

export function mergeClassName(semantic: string, user?: string): string {
  const key = user ? `${semantic}\0${user}` : semantic;
  const cached = CLASS_CACHE.get(key);
  if (cached !== undefined) return cached;

  const next = user ? `${semantic} ${user}` : semantic;
  if (CLASS_CACHE.size >= CLASS_CACHE_LIMIT) {
    const first = CLASS_CACHE.keys().next().value;
    if (first !== undefined) CLASS_CACHE.delete(first);
  }
  CLASS_CACHE.set(key, next);
  return next;
}

export function clearClassNameCache(): void {
  CLASS_CACHE.clear();
}
