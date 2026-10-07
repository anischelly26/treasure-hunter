import type { CSSProperties, ReactNode } from "react";

/** Characters as individually animatable spans. Decorative: the parent carries the accessible text. */
export function Chars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className ? `chars ${className}` : "chars"} aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <span className="char" key={i} style={{ "--i": i } as CSSProperties}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/** A masked line: the inner span slides inside a clipping box. */
export function Line({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={className ? `line ${className}` : "line"}>
      <span className="line__inner">{children}</span>
    </span>
  );
}
