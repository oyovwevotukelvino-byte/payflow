// src/components/dashboard/business-switcher.tsx
interface BusinessSwitcherProps {
  businessName: string;
}

/**
 * Displays the current business name only — single-business MVP. Isolated
 * as its own component so multi-business support (already anticipated by
 * the UserRole enum on the User model) is a change to this file alone,
 * not a hunt through DashboardHeader, once that feature exists.
 */
export function BusinessSwitcher({ businessName }: BusinessSwitcherProps) {
  return (
    <span className="truncate text-sm font-medium text-foreground">
      {businessName}
    </span>
  );
}