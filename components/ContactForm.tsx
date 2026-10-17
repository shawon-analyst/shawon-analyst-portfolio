"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Formspree form ID that submissions are POSTed to.
 *
 * Set NEXT_PUBLIC_FORMSPREE_ID to the ID from your form's endpoint
 * (https://formspree.io/f/XXXXXXXX -> XXXXXXXX). The value is public by design:
 * it is what the browser posts to, and it is what forwards the message to the
 * inbox. Formspree's own filters and the honeypot below handle spam.
 *
 * While it is unset the form still works - it hands the message to the visitor's
 * mail client instead of dropping it - so the site is never left with a form
 * that silently does nothing.
 */
const FORMSPREE_FORM_ID = (process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "").trim();
const FORMSPREE_ENDPOINT = FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${FORMSPREE_FORM_ID}`
  : "";

const INTERESTS = ["A project", "Hiring you", "Something else"] as const;
type Interest = (typeof INTERESTS)[number];

type Fields = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;
type Status = "editing" | "sending" | "sent" | "failed" | "handed-off";

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

/** Pre-fills the visitor's mail client when the form has no endpoint yet. */
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
 * Submissions are POSTed straight to Formspree, which delivers them to the
 * inbox, so a visitor never has to leave the site or open a mail client. Every
 * field is validated in the browser first and the outcome is reported inline.
 */
export default function ContactForm() {
  const [interest, setInterest] = useState<Interest>(INTERESTS[0]);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("editing");
  const [failure, setFailure] = useState<string | null>(null);
  const [handoffHref, setHandoffHref] = useState<string | null>(null);

  const update =
    (key: keyof Fields) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setFields((current) => ({ ...current, [key]: value }));
      setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
      setStatus((current) => (current === "failed" ? "editing" : current));
    };

  function handOff(payload: Fields, topic: Interest) {
    const href = buildMailto(payload, topic);
    setHandoffHref(href);
    setStatus("handed-off");

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    // Honeypot: only a bot fills a field it cannot see. Pretend it worked.
    const honeypot = new FormData(event.currentTarget).get("_gotcha");
    if (typeof honeypot === "string" && honeypot.trim()) {
      setFields(EMPTY);
      setStatus("sent");
      return;
    }

    const nextErrors = validate(fields);
    setErrors(nextErrors);

    const firstInvalid = (Object.keys(nextErrors) as (keyof Fields)[])[0];
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    if (!FORMSPREE_ENDPOINT) {
      handOff(fields, interest);
      return;
    }

    setStatus("sending");
    setFailure(null);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          organization: fields.organization.trim() || undefined,
          message: fields.message.trim(),
          interest,
          _subject: `Portfolio inquiry - ${interest}`,
        }),
      });

      if (!response.ok) {
        let detail = "";
        try {
          const payload = (await response.json()) as {
            errors?: { message?: string }[];
          };
          detail =
            payload.errors
              ?.map((entry) => entry.message)
              .filter((message): message is string => Boolean(message))
              .join(" ") ?? "";
        } catch {
          // Non-JSON error body - fall back to the generic copy below.
        }
        throw new Error(
          detail ||
            (response.status === 422
              ? "That could not be sent. Please check the details and try again."
              : "That could not be sent just now."),
        );
      }

      setFields(EMPTY);
      setFailure(null);
      setStatus("sent");
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Something went wrong.");
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="card flex flex-col items-start gap-4 p-6 sm:p-8"
        role="status"
        aria-live="polite"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)]">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg">Thank you, your message has been sent!</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            It is in my inbox now and I&apos;ll get back to you within a day or two. If
            anything else comes to mind, you can send another message any time.
          </p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => setStatus("editing")}>
          Send another message
        </button>
      </div>
    );
  }

  if (status === "handed-off" && handoffHref) {
    return (
      <div className="card flex flex-col items-start gap-4 p-6 sm:p-8" role="status" aria-live="polite">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)]">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg">Your message is ready to send</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            I&apos;ve opened your email app with everything filled in — just hit send. If
            nothing popped up, write to me directly at
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-1 inline-block font-medium text-[var(--accent)] underline decoration-dotted underline-offset-4"
          >
            {site.email}
          </a>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={handoffHref} className="btn btn-primary">
            <Send className="h-4 w-4" aria-hidden="true" />
            Open it again
          </a>
          <button type="button" className="btn btn-secondary" onClick={() => setStatus("editing")}>
            Edit the message
          </button>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form noValidate onSubmit={handleSubmit} className="card flex flex-col gap-5 p-6 sm:p-8">
      <div>
        <h3 className="text-lg">Send an inquiry</h3>
        <p className="mt-1.5 text-sm text-muted">
          Tell me what you need and I&apos;ll get back to you within a day or two.
        </p>
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <fieldset className="flex flex-col" disabled={sending}>
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
            disabled={sending}
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
            disabled={sending}
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
          disabled={sending}
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
          disabled={sending}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-1.5 text-xs text-[var(--danger)]">
            {errors.message}
          </p>
        ) : null}
      </div>

      {status === "failed" && failure ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-[color-mix(in_oklab,var(--danger)_45%,transparent)] bg-[color-mix(in_oklab,var(--danger)_10%,transparent)] p-3.5"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--danger)]" />
          <div className="min-w-0 text-sm">
            <p className="font-medium text-[var(--danger)]">That did not go through</p>
            <p className="mt-0.5 leading-relaxed text-muted">
              {failure} Please try again in a moment, or write to me directly at
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 inline-block font-medium text-[var(--accent)] underline decoration-dotted underline-offset-4"
            >
              {site.email}
            </a>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <button type="submit" className="btn btn-primary" disabled={sending} aria-busy={sending}>
          {sending ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send aria-hidden="true" className="h-4 w-4" />
              Send inquiry
            </>
          )}
        </button>
        <p className="text-xs text-muted">
          {FORMSPREE_ENDPOINT
            ? "Sent straight to my inbox — I reply within a day or two."
            : "Opens your email app with the details filled in."}
        </p>
      </div>
    </form>
  );
}
