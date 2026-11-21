"use client";

import { createContext, useContext, useTransition } from "react";

const PendingContext = createContext(false);
export const useActionFormPending = () => useContext(PendingContext);

/**
 * A <form> for server actions that keeps what the admin typed. React 19 resets
 * uncontrolled fields after a native form action, which wiped every field when
 * validation failed and reverted settings to their old values after saving.
 * Submitting via onSubmit + a transition avoids that reset.
 */
export function ActionForm({
  action,
  children,
  ...props
}: Omit<React.FormHTMLAttributes<HTMLFormElement>, "action" | "onSubmit"> & { action: (formData: FormData) => void }) {
  const [pending, startTransition] = useTransition();
  return (
    <PendingContext.Provider value={pending}>
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startTransition(() => action(formData));
        }}
      >
        {children}
      </form>
    </PendingContext.Provider>
  );
}
