export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src="/images/hull-hawks-logo.png"
      alt="Hull Hawks HC"
      className={`block object-contain ${
        compact ? "h-12 w-auto max-w-[78px]" : "h-24 w-auto max-w-[160px]"
      }`}
    />
  );
}
