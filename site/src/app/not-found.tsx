import Link from "next/link";

export default function NotFound() {
  return (
    <main className="lost" data-world="index">
      <p className="mono">404</p>
      <h1 className="display">
        Nothing
        <br />
        here.
      </h1>
      <Link className="button" href="/">
        Back to the portfolio <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
