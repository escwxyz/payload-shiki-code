"use client";

import { useCallback, useState } from "react";

export type CopyButtonProps = {
  /** The code content to copy */
  code: string;
  /** Optional CSS class name */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
  /** Callback when copy succeeds */
  onCopySuccess?: () => void;
  /** Callback when copy fails */
  onCopyError?: (error: Error) => void;
  /** Duration to show success state in milliseconds */
  successDuration?: number;
};

const CopyIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect height="14" rx="2" ry="2" width="14" x="8" y="8" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const CopyButton = ({
  code,
  className,
  ariaLabel = "Copy code to clipboard",
  onCopySuccess,
  onCopyError,
  successDuration = 2000,
}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (isCopied) {
      return;
    } // Prevent multiple clicks during success state

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopySuccess?.();

      setTimeout(() => {
        setIsCopied(false);
      }, successDuration);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onCopyError?.(err);
    }
  }, [code, isCopied, onCopySuccess, onCopyError, successDuration]);

  const classes = ["shiki-copy-button", className].filter(Boolean).join(" ");

  return (
    <button
      aria-label={ariaLabel}
      className={classes}
      data-copied={isCopied}
      onClick={handleCopy}
      type="button"
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
};
