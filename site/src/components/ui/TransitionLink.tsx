"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Link into a case study. The picture is a shared element, and a shared element
 * can only morph if its destination renders in the same commit as the
 * navigation — so these links prefetch the whole page, not just its shell.
 */
export function ProjectLink(props: ComponentProps<typeof Link>) {
  return <Link prefetch {...props} transitionTypes={["to-project"]} />;
}

/**
 * Link back to the home page, landing on the project's own section so the
 * picture travels back into the frame it came from.
 */
export function BackLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} transitionTypes={["to-home"]} />;
}
