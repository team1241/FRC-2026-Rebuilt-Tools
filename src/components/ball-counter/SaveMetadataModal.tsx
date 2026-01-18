import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  MetadataFormValues,
  metadataSchema,
} from "./schemas/create-metadata.schema";
import { toast } from "sonner";

type SaveMetadataModalProps = {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none";

export default function SaveMetadataModal({
  isOpen,
  onClose,
  videoUrl,
}: SaveMetadataModalProps) {
  const createMetadata = useMutation(api.metadata.createMetadata);

  const form = useForm<MetadataFormValues>({
    defaultValues: {
      eventCode: "",
      matchNumber: "",
      teamNumber: "",
    },
    validators: {
      onChange: metadataSchema,
    },
    onSubmit: async ({ value }) => {
      const trimmedUrl = videoUrl.trim();
      try {
        await createMetadata({
          eventCode: value.eventCode,
          matchNumber: value.matchNumber,
          teamNumber: Number(value.teamNumber),
          videoUrl: trimmedUrl,
          userId: "local",
        });
        form.reset();
        onClose();
        toast.success(
          `Successfully saved data for Team ${value.teamNumber} - ${value.eventCode} Match ${value.matchNumber}`,
        );
      } catch (error) {
        toast.error("Unable to save metadata. Try again.");
      }
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [form, isOpen]);

  if (!isOpen) return null;

  const isSubmitting = form.state.isSubmitting;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-lg font-semibold text-[var(--color-ink)]">
              Save match metadata
            </h4>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Capture event, match, and team details alongside this clip.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-transparent p-2 text-[var(--color-ink-muted)] transition hover:border-[var(--color-border)] hover:text-[var(--color-ink)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field name="eventCode">
            {(field) => {
              const fieldError = field.state.meta.isTouched
                ? field.state.meta.errors?.[0]
                : undefined;
              return (
                <label className="block text-sm font-semibold text-[var(--color-ink)]">
                  Event code
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="ex: 2025onbar"
                    className={inputClassName}
                  />
                  {fieldError ? (
                    <span className="mt-2 block text-xs text-[var(--color-danger)]">
                      {fieldError}
                    </span>
                  ) : null}
                </label>
              );
            }}
          </form.Field>

          <form.Field name="matchNumber">
            {(field) => {
              const fieldError = field.state.meta.isTouched
                ? field.state.meta.errors?.[0]
                : undefined;
              return (
                <label className="block text-sm font-semibold text-[var(--color-ink)]">
                  Match number
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="ex: Q42"
                    className={inputClassName}
                  />
                  {fieldError ? (
                    <span className="mt-2 block text-xs text-[var(--color-danger)]">
                      {fieldError}
                    </span>
                  ) : null}
                </label>
              );
            }}
          </form.Field>

          <form.Field name="teamNumber">
            {(field) => {
              const fieldError = field.state.meta.isTouched
                ? field.state.meta.errors?.[0]
                : undefined;
              return (
                <label className="block text-sm font-semibold text-[var(--color-ink)]">
                  Team number
                  <input
                    type="number"
                    inputMode="numeric"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="ex: 4334"
                    className={inputClassName}
                  />
                  {fieldError ? (
                    <span className="mt-2 block text-xs text-[var(--color-danger)]">
                      {fieldError}
                    </span>
                  ) : null}
                </label>
              );
            }}
          </form.Field>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-gradient-to-br from-[var(--color-accent-strong)] to-[var(--color-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-surface)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
