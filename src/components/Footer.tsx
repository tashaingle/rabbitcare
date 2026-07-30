import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <p className="footer-brand">
            <span aria-hidden>🐇</span> RabbitCare.co.uk
          </p>
          <p className="footer-tagline">
            Practical rabbit care advice for UK owners.
          </p>
        </div>

        <div className="footer-cols">
          <div>
            <h2>Tools</h2>
            <ul>
              <li>
                <Link href="/can-rabbits-eat-this">Food checker</Link>
              </li>
              <li>
                <Link href="/rabbit-symptom-checker">Symptom checker</Link>
              </li>
              <li>
                <Link href="/rabbit-housing-size-calculator">
                  Housing calculator
                </Link>
              </li>
              <li>
                <Link href="/new-rabbit-owner-checklist">Owner checklist</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>Guides</h2>
            <ul>
              <li>
                <Link href="/guides">
                  <strong>All pages index</strong>
                </Link>
              </li>
              <li>
                <Link href="/best-hay-for-rabbits">Best hay</Link>
              </li>
              <li>
                <Link href="/best-bedding-for-rabbits">Best bedding</Link>
              </li>
              <li>
                <Link href="/what-do-rabbits-eat">What rabbits eat</Link>
              </li>
              <li>
                <Link href="/rabbit-health">Rabbit health</Link>
              </li>
              <li>
                <Link href="/rabbit-behaviour">Rabbit behaviour</Link>
              </li>
              <li>
                <Link href="/rabbit-toys">Rabbit toys</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>Site</h2>
            <ul>
              <li>
                <Link href="/contact-us">Contact</Link>
              </li>
              <li>
                <Link href="/author">About the author</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-disclaimer">
        <p>
          <strong>RabbitCare.co.uk provides general rabbit care information
          for UK rabbit owners.</strong>{" "}
          It does not replace advice from a rabbit-savvy vet. If your rabbit
          stops eating, stops pooing, seems in pain or is suddenly unwell,
          contact a vet urgently.
        </p>
        <p className="footer-copy">
          © {new Date().getFullYear()} RabbitCare.co.uk · Content migrated from
          WordPress · Shop coming later
        </p>
      </div>
    </footer>
  );
}
