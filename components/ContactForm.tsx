"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { site } from "@/lib/site";

const INTERESTS = ["A project", "Hiring you", "Something else"] as const;
type Interest = (typeof INTERESTS)[number];

type Fields = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", organization: "", message: "" };

function validate({ name, email, message }: Fields): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Please add your name.";
  if (!email.trim()) {
    errors.email = "Please add an email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
    errors.email = "That address looks incomplete - check for a typo.";
  }
  if (!message.trim()) errors.message = "Tell me a little about what you have in mind.";
  return errors;
}

/** Builds a pre-filled mailto: link from the current form state. */
function buildMailto(fields: Fields, interest: Interest) {
  const subject = `Portfolio inquiry - ${interest}`;
  const body = [
    `Interest: ${interest}`,
    `Name: ${fields.name.trim()}`,
    fields.organization.trim() ? `Organization: ${fields.organization.trim()}` : null,
    `Email: ${fields.email.trim()}`,
    "",
    fields.message.trim(),
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Inquiry form for the contact section.
 *
 * The site is static, so there is no endpoint to post to: submitting composes a
 * pre-filled email and hands it to the visitor's mail client, then says plainly
 * what happened. Every field is checked in the browser first, and the direct
 * address stays on screen beside the form as a fallback.
 */
export default function ContactForm() {
  const [interest, setInterest] = useState<Interest>(INTERESTS[0]);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sentHref, setSentHref] = useState<string | null>(null);

  const update =
    (key: keyof Fields) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setFields((current) => ({ ...current, [key]: value }));
      setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
    };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(fields);
    setErrors(nextErrors);

    const firstInvalid = (Object.keys(nextErrors) as (keyof Fields)[])[0];
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    const href = buildMailto(fields, interest);
    setSentHref(href);

    // A real, attached anchor click, so the browser treats it like any other
    // mailto link the visitor clicked themselves.
    const link = document.createElement("a");
    link.href = href;
    link.rel = "noopener";
    link.style.display = "none";
    document.body.append(link);
    link.click();
    window.setTimeout(() => link.remove(), 0);
  }

  if (sentHref) {
    return (
      <div className="card flex flex-col items-start gap-4 p-6 sm:p-8">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)]">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-lg">Your message is ready to send</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            I&apos;ve opened your email app with everything filled in — just hit send. If
            nothing popped up, write to me directly at{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-[var(--accent)] underline decoration-dotted underline-offset-4"
            >
              {site.email}
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={sentHref} className="btn btn-primary">
            <Send className="h-4 w-4" />
            Open it again
          </a>
          <button type="button" className="btn btn-secondary" onClick={() => setSentHref(null)}>
            Edit the message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="card flex flex-col gap-5 p-6 sm:p-8">
      <div>
        <h3 className="text-lg">Send an inquiry</h3>
        <p className="mt-1.5 text-sm text-muted">
          Tell me what you need and I&apos;ll get back to you within a day or two.
        </p>
      </div>

      <fieldset className="flex flex-col">
        <legend className="field-label">What&apos;s this about?</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {INTERESTS.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="interest"
                value={option}
                checked={interest === option}
                onChange={() => setInterest(option)}
                className="option-input sr-only"
              />
              <span className="option-chip">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            className="field-input"
            placeholder="Your full name"
            value={fields.name}
            onChange={update("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name ? (
            <p id="contact-name-error" className="mt-1.5 text-xs text-[var(--danger)]">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="field-label" htmlFor="contact-email">
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="field-input"
            placeholder="you@company.com"
            value={fields.email}
            onChange={update("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email ? (
            <p id="contact-email-error" className="mt-1.5 text-xs text-[var(--danger)]">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="contact-organization">
          Organization{" "}
          <span className="font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="contact-organization"
          name="organization"
          autoComplete="organization"
          className="field-input"
          placeholder="Company, team or university"
          value={fields.organization}
          onChange={update("organization")}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="contact-message">
          What do you have in mind?
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          className="field-input resize-y"
          placeholder="A short brief is plenty — the problem, the data you already have, and what a good outcome looks like."
          value={fields.message}
          onChange={update("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-1.5 text-xs text-[var(--danger)]">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <button type="submit" className="btn btn-primary">
          <Send className="h-4 w-4" />
          Send inquiry
        </button>
        <p className="text-xs text-muted">
          Opens your email app with the details filled in.
        </p>
      </div>
    </form>
  );
}
