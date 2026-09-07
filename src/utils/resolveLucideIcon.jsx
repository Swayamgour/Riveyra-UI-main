import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Resolves a Lucide icon component dynamically from a string name.
 * Supports direct names ("Shield"), lowercase ("shield"), kebab-case ("shield-check"),
 * snake_case ("shield_check"), and space-separated ("shield check").
 */
export const resolveLucideIcon = (name, size = 24, props = {}) => {
  if (!name || typeof name !== 'string') return null;
  const trimmed = name.trim();
  if (!trimmed) return null;

  // 1. Direct match (e.g. "Shield", "Cpu")
  if (LucideIcons[trimmed]) {
    const IconComponent = LucideIcons[trimmed];
    return <IconComponent size={size} {...props} />;
  }

  // 2. PascalCase conversion (e.g. "shield-check" -> "ShieldCheck", "cpu" -> "Cpu")
  const pascal = trimmed
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  if (LucideIcons[pascal]) {
    const IconComponent = LucideIcons[pascal];
    return <IconComponent size={size} {...props} />;
  }

  // 3. Capitalize first letter only (e.g. "cpu" -> "Cpu")
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (LucideIcons[capitalized]) {
    const IconComponent = LucideIcons[capitalized];
    return <IconComponent size={size} {...props} />;
  }

  return null;
};

export default resolveLucideIcon;
