const SLUG = 'csv-import-cleanroom';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 86_400_000;

interface Verdict { valid: boolean; checkedAt: number; reason?: string }

function cachedVerdict(): Verdict | null {
  try {
    const value = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as Partial<Verdict> | null;
    return value && typeof value.valid === 'boolean' && Number.isFinite(value.checkedAt) ? value as Verdict : null;
  } catch { return null; }
}

export function captureLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  storeLicense(token);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function storeLicense(token: string): void {
  const nextToken = token.trim();
  if (localStorage.getItem(LICENSE_KEY) !== nextToken) localStorage.removeItem(VERDICT_KEY);
  localStorage.setItem(LICENSE_KEY, nextToken);
}

export function hasOptimisticLicense(): boolean {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return false;
  return cachedVerdict()?.valid === true;
}

export async function verifyLicense(force = false): Promise<{ valid: boolean; reason?: string }> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { valid: false, reason: 'missing' };
  const cached = cachedVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) return cached;
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verification unavailable');
    const result = await response.json() as { valid?: unknown; reason?: unknown };
    const verdict = { valid: result.valid === true, reason: typeof result.reason === 'string' ? result.reason : undefined, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return verdict;
  } catch {
    return cached ?? { valid: false, reason: 'unavailable' };
  }
}

export const CHECKOUT_URL = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;
