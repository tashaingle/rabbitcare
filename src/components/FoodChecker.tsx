"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FoodItem } from "@/lib/content";

function normalise(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function statusClass(status: string) {
  if (status === "safe") return "safe";
  if (status === "treat") return "treat";
  if (status === "unsafe") return "unsafe";
  return "caution";
}

export function FoodChecker({ foods }: { foods: FoodItem[] }) {
  const [query, setQuery] = useState("");

  const popular = useMemo(
    () =>
      ["Carrot", "Apple", "Celery", "Banana", "Tomato", "Cucumber"]
        .map((name) => foods.find((f) => f.name === name))
        .filter(Boolean) as FoodItem[],
    [foods]
  );

  const match = useMemo(() => {
    const q = normalise(query);
    if (!q) return null;
    return (
      foods.find((food) => {
        const names = [food.name].concat(food.aliases || []);
        return names.some((name) => {
          const n = normalise(name);
          return n === q || n.includes(q) || q.includes(n);
        });
      }) || null
    );
  }, [foods, query]);

  const searching = query.trim().length > 0;

  return (
    <div className="food-checker">
      <div className="food-checker-hero">
        <span className="pill">Safe food checker</span>
        <h1>Can rabbits eat this?</h1>
        <p>
          Search common fruits, vegetables, herbs and treats to see whether they
          are safe, best as an occasional treat, or need extra caution.
        </p>

        <label className="food-search-label" htmlFor="food-search">
          Search a food
        </label>
        <div className="food-search-row">
          <span aria-hidden>🔍</span>
          <input
            id="food-search"
            type="search"
            placeholder="e.g. apple, carrot, lettuce…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="food-popular">
          {popular.map((food) => (
            <button
              key={food.name}
              type="button"
              onClick={() => setQuery(food.name)}
            >
              {food.emoji} {food.name}
            </button>
          ))}
        </div>
      </div>

      <div className="food-result-panel" aria-live="polite">
        {!searching && (
          <div className="food-empty">
            <div className="food-emoji" aria-hidden>
              🥬
            </div>
            <h2>Start typing a food</h2>
            <p>
              Search by name, or choose one of the popular foods to see a quick
              result.
            </p>
          </div>
        )}

        {searching && !match && (
          <div className="food-empty">
            <div className="food-emoji" aria-hidden>
              🤔
            </div>
            <h2>Not found</h2>
            <p>
              We don’t have “{query}” yet. Try another spelling, or browse the
              full food guides below.
            </p>
          </div>
        )}

        {match && (
          <article className={`food-result status-${statusClass(match.status)}`}>
            <div className="food-result-top">
              <span className="food-emoji" aria-hidden>
                {match.emoji}
              </span>
              <div>
                <p className={`food-status-badge ${statusClass(match.status)}`}>
                  {match.label}
                </p>
                <h2>{match.name}</h2>
                <p className="food-category">{match.category}</p>
              </div>
            </div>
            <p className="food-summary">{match.summary}</p>
            <dl className="food-meta">
              {match.frequency && (
                <>
                  <dt>How often</dt>
                  <dd>{match.frequency}</dd>
                </>
              )}
              {match.amount && (
                <>
                  <dt>Amount</dt>
                  <dd>{match.amount}</dd>
                </>
              )}
              {match.prepare && (
                <>
                  <dt>Prepare</dt>
                  <dd>{match.prepare}</dd>
                </>
              )}
              {match.warning && (
                <>
                  <dt>Watch out</dt>
                  <dd>{match.warning}</dd>
                </>
              )}
            </dl>
            {match.url && (
              <Link className="food-more" href={match.url}>
                Read full guide →
              </Link>
            )}
          </article>
        )}
      </div>

      <section className="food-grid-section">
        <h2>Browse all foods in the checker</h2>
        <div className="food-grid">
          {foods.map((food) => (
            <button
              key={food.name}
              type="button"
              className={`food-chip ${statusClass(food.status)}`}
              onClick={() => {
                setQuery(food.name);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span aria-hidden>{food.emoji}</span>
              <span>{food.name}</span>
              <small>{food.label}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
