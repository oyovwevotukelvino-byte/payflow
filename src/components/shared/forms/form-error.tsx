// src/components/shared/forms/form-error.tsx
interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p role="alert" className="text-sm font-medium text-destructive">
      {message}
    </p>
  );
}