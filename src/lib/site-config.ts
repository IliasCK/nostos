// Site-wide values Elias fills in before launch (src/config/site.json): analytics
// and email provider. Same launch rule as the tax parameters: NOSTOS_ENV=production
// fails the build while any is null; other builds render a visible placeholder.
// Self-contained (no imports) so Node can run it directly.

export interface SiteConfig {
  analytics: { provider: string | null; privacyUrl: string | null };
  /** "none" in v1: no email signup. */
  emailProvider: 'none' | { name: string | null; privacyUrl: string | null };
}

/** Dotted paths of every unset value. No privacy URL is needed for a provider set to "none". */
export function missingSiteValues(config: SiteConfig): string[] {
  const missing: string[] = [];
  if (!config.analytics.provider) missing.push('analytics.provider');
  if (config.analytics.provider !== 'none' && !config.analytics.privacyUrl) missing.push('analytics.privacyUrl');
  if (config.emailProvider !== 'none') {
    if (!config.emailProvider.name) missing.push('emailProvider.name');
    if (!config.emailProvider.privacyUrl) missing.push('emailProvider.privacyUrl');
  }
  return missing;
}
