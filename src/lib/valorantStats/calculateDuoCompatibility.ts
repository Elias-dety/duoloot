import type {
  ValorantDuoCompatibilityResult,
  ValorantMockUser,
  ValorantRole,
} from '@/types/valorant.types';

const complementaryRoles: Record<ValorantRole, ValorantRole[]> = {
  Duelist: ['Controller', 'Initiator', 'Sentinel'],
  Controller: ['Duelist', 'Initiator'],
  Initiator: ['Duelist', 'Controller'],
  Sentinel: ['Duelist', 'Controller'],
  Flex: ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Flex'],
};

export function calculateDuoCompatibility(
  userA: ValorantMockUser,
  userB: ValorantMockUser,
): ValorantDuoCompatibilityResult {
  const strengths: string[] = [];
  const risks: string[] = [];
  let score = 50;

  if (areRolesComplementary(userA.matchmakingProfile.primaryRole, userB.matchmakingProfile.primaryRole)) {
    score += 14;
    strengths.push('Roles complementares');
  } else {
    score -= 8;
    risks.push('Roles principais se sobrepoem');
  }

  const rankDelta = Math.abs(userA.profile.currentRank.order - userB.profile.currentRank.order);
  if (rankDelta <= 2) {
    score += 12;
    strengths.push('Nivel de rank proximo');
  } else if (rankDelta >= 6) {
    score -= 14;
    risks.push('Diferenca alta de rank');
  } else {
    score += 4;
  }

  const sharedMaps = countShared(userA.matchmakingProfile.preferredMaps, userB.matchmakingProfile.preferredMaps);
  if (sharedMaps >= 2) {
    score += 10;
    strengths.push('Mapas preferidos parecidos');
  } else {
    risks.push('Poucos mapas favoritos em comum');
  }

  const reliabilityAverage =
    (userA.matchmakingProfile.reliabilityScore + userB.matchmakingProfile.reliabilityScore) / 2;
  if (reliabilityAverage >= 80) {
    score += 10;
    strengths.push('Boa confiabilidade');
  } else if (reliabilityAverage < 60) {
    score -= 10;
    risks.push('Confiabilidade abaixo do ideal');
  }

  const toxicityAverage =
    (userA.matchmakingProfile.toxicityScore + userB.matchmakingProfile.toxicityScore) / 2;
  if (toxicityAverage <= 25) {
    score += 8;
    strengths.push('Baixo risco de toxicidade');
  } else if (toxicityAverage >= 55) {
    score -= 12;
    risks.push('Risco de comunicacao negativa');
  }

  const aggressionDelta = Math.abs(
    userA.matchmakingProfile.aggressionScore - userB.matchmakingProfile.aggressionScore,
  );
  if (aggressionDelta >= 20 && aggressionDelta <= 45) {
    score += 8;
    strengths.push('Agressividade complementar');
  } else if (aggressionDelta > 55) {
    score -= 6;
    risks.push('Diferenca alta de ritmo');
  }

  const consistencyDelta = Math.abs(
    userA.matchmakingProfile.consistencyScore - userB.matchmakingProfile.consistencyScore,
  );
  if (consistencyDelta <= 18) {
    score += 8;
    strengths.push('Consistencia parecida');
  } else {
    risks.push('Consistencia diferente entre os jogadores');
  }

  const compatibilityScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    compatibilityScore,
    title: getCompatibilityTitle(compatibilityScore),
    reason: buildReason(userA, userB, strengths),
    strengths: strengths.slice(0, 4),
    risks: risks.slice(0, 3),
  };
}

function areRolesComplementary(roleA: ValorantRole, roleB: ValorantRole): boolean {
  return complementaryRoles[roleA].includes(roleB);
}

function countShared(itemsA: string[], itemsB: string[]): number {
  const normalizedB = new Set(itemsB.map((item) => item.toLowerCase()));
  return itemsA.filter((item) => normalizedB.has(item.toLowerCase())).length;
}

function getCompatibilityTitle(score: number): string {
  if (score >= 85) return 'Dupla competitiva excelente';
  if (score >= 70) return 'Boa dupla competitiva';
  if (score >= 50) return 'Compatibilidade media';
  return 'Compatibilidade arriscada';
}

function buildReason(userA: ValorantMockUser, userB: ValorantMockUser, strengths: string[]): string {
  const roleA = userA.matchmakingProfile.primaryRole;
  const roleB = userB.matchmakingProfile.primaryRole;
  const base = `Combinacao ${roleA} + ${roleB}`;

  if (strengths.length === 0) {
    return `${base}, mas ainda falta sinergia clara nos dados mockados.`;
  }

  return `${base}, com destaque para ${strengths[0].toLowerCase()}.`;
}
