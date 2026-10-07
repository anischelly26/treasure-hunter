"use client";

export default function PrintButton() {
  return (
    <button type="button" className="textlink" onClick={() => window.print()}>
      Print / save as PDF
    </button>
  );
}
