"use client";

import { useSyncExternalStore } from "react";
import { projectTypes, type TypeFilter } from "@/content/projects";

let current: TypeFilter = "all";
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};

export const getTypeFilter = () => current;

/** The first paint is always everything; a choice in the address arrives right after it. */
export const useTypeFilter = () => useSyncExternalStore(subscribe, getTypeFilter, () => "all" as TypeFilter);

/** `?type=games` makes a view of the work that can be sent to someone. */
export function typeFromAddress(): TypeFilter | null {
  const type = new URLSearchParams(window.location.search).get("type");
  return projectTypes.find((t) => t.key === type)?.key ?? null;
}

/** The stylesheet hides every `[data-types]` that does not match `html[data-show]`. */
export function setTypeFilter(next: TypeFilter) {
  current = next;
  document.documentElement.dataset.show = next;
  const url = new URL(window.location.href);
  if (next === "all") url.searchParams.delete("type");
  else url.searchParams.set("type", next);
  window.history.replaceState(null, "", url);
  listeners.forEach((listener) => listener());
}
