// Site-wide values Elias fills in before launch (src/config/site.json): contact
// email, analytics and email provider. Same launch rule as the tax parameters:
// NOSTOS_ENV=production fails the build while any is null; other builds render
// a visible placeholder. Self-contained (no imports) so Node can run it directly.

export interface SiteConfig {
  contactEmail: string | null;
  analytics: { provider: string | null; privacyUrl: string | null };
  emailProvider: { name: string | null; privacyUrl: string | null };
}

/** Dotted paths of every unset value. analytics.privacyUrl isn't needed when provider is "none". */
export function missingSiteValues(config: SiteConfig): string[] {
  const missing: string[] = [];
  if (!config.contactEmail) missing.push('contactEmail');
  if (!config.analytics.provider) missing.push('analytics.provider');
  if (config.analytics.provider !== 'none' && !config.analytics.privacyUrl) missing.push('analytics.privacyUrl');
  if (!config.emailProvider.name) missing.push('emailProvider.name');
  if (!config.emailProvider.privacyUrl) missing.push('emailProvider.privacyUrl');
  return missing;
}
