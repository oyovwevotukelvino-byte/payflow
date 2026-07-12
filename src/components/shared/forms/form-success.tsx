// src/components/shared/forms/form-success.tsx
interface FormSuccessProps {
  message?: string;
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <p role="status" className="text-sm font-medium text-emerald-600">
      {message}
    </p>
  );
}