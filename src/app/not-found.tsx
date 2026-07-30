import Link from "next/link";

export default function NotFound() {
  return (
    <div className="food-checker" style={{ textAlign: "center", paddingTop: 64 }}>
      <span className="pill">404</span>
      <h1 style={{ fontFamily: "var(--rc-font-heading)", fontSize: "2.6rem" }}>
        Page not found
      </h1>
      <p style={{ color: "var(--rc-muted)" }}>
        That page isn’t on the new content site yet — the shop and product
        pages will come later.
      </p>
      <div className="btn-row" style={{ justifyContent: "center", marginTop: 20 }}>
        <Link className="btn btn-primary" href="/">
          Back to home
        </Link>
        <Link className="btn btn-secondary" href="/learn-more">
          Browse guides
        </Link>
      </div>
    </div>
  );
}
