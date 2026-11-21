import { cn } from "@/lib/utils";

type Errors = Record<string, string[] | undefined> | undefined;

function ErrorText({ name, errors }: { name: string; errors: Errors }) {
  const msg = errors?.[name]?.[0];
  return msg ? <p className="mt-1.5 text-sm text-red-600">{msg}</p> : null;
}

type Base = { name: string; label: string; errors?: Errors; hint?: string; className?: string; required?: boolean };

export function TextField({ name, label, errors, hint, className, required, ...props }: Base & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input id={name} name={name} required={required} className={cn("field", errors?.[name] && "field-error")} {...props} />
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      <ErrorText name={name} errors={errors} />
    </div>
  );
}

export function TextArea({ name, label, errors, hint, className, required, ...props }: Base & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea id={name} name={name} required={required} rows={4} className={cn("field resize-y", errors?.[name] && "field-error")} {...props} />
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      <ErrorText name={name} errors={errors} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  errors,
  hint,
  className,
  required,
  options,
  ...props
}: Base & React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select id={name} name={name} required={required} className={cn("field", errors?.[name] && "field-error")} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      <ErrorText name={name} errors={errors} />
    </div>
  );
}

export function Checkbox({ name, label, description, defaultChecked }: { name: string; label: string; description?: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 transition hover:border-navy/30 has-[:checked]:border-gold has-[:checked]:bg-gold/5">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-5 w-5 accent-[#102A43]" />
      <span>
        <span className="block text-sm font-semibold text-navy">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
    </label>
  );
}

export function FormCard({ title, description, children, className }: { title?: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white p-6 sm:p-8", className)}>
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className={cn("space-y-5", title && "mt-6")}>{children}</div>
    </section>
  );
}
