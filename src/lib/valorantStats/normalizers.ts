export function normalizeValorantId(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function normalizeAgentName(value: string): string {
  return normalizeDisplayName(value);
}

export function normalizeMapName(value: string): string {
  return normalizeDisplayName(value);
}

export function normalizeWeaponName(value: string): string {
  return normalizeDisplayName(value);
}

export function normalizeQueueName(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (['comp', 'ranked', 'competitivo'].includes(normalized)) {
    return 'competitive';
  }

  return normalized;
}

function normalizeDisplayName(value: string): string {
  return value
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
