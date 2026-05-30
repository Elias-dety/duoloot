import React, { useEffect, useState, useCallback } from 'react';
import {
  adminGetPendingRedemptions,
  adminGetAllRedemptions,
  adminApproveRedemption,
  adminRejectRedemption,
} from '@/services/wallet-admin.service';
import type { WalletRedemption } from '@/features/wallet/wallet.schema';

import { UiMarker } from '@/components/atoms';
import { UI_MARKERS } from '@/config/uiMarkers';

import duoCoinIcon16 from '@/assets/icons/duoloot_pontos_token_check_16px.png';
import duoCoinIcon32 from '@/assets/icons/duoloot_pontos_token_check_32px.png';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDuoCoins = (amount: number) =>
  new Intl.NumberFormat('pt-BR').format(amount);

const statusLabel: Record<string, string> = {
  requested: 'Solicitado',
  under_review: 'Em análise',
  approved: 'Aprovado',
  paid: 'Pago',
  rejected: 'Rejeitado',
  cancelled: 'Cancelado',
};

const statusColor: Record<string, string> = {
  requested: 'text-[var(--dl-warning)] border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10',
  under_review: 'text-[var(--dl-number)] border-[var(--dl-number)]/30 bg-[var(--dl-number)]/10',
  approved: 'text-[var(--dl-string)] border-[var(--dl-string)]/30 bg-[var(--dl-string)]/10',
  paid: 'text-[var(--dl-string)] border-[var(--dl-string)]/30 bg-[var(--dl-string)]/10',
  rejected: 'text-[var(--dl-keyword)] border-[var(--dl-keyword)]/30 bg-[var(--dl-keyword)]/10',
  cancelled: 'text-[var(--dl-muted)] border-[var(--dl-muted)]/30 bg-[var(--dl-muted)]/10',
};

const statusFilters = [
  { value: 'pending', label: 'Pendentes' },
  { value: 'all', label: 'Todos' },
  { value: 'paid', label: 'Pagos' },
  { value: 'rejected', label: 'Rejeitados' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AdminWalletPage: React.FC = () => {
  const [redemptions, setRedemptions] = useState<WalletRedemption[]>([]);
  const [filter, setFilter] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'danger' } | null>(null);

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: WalletRedemption[];
      if (filter === 'pending') {
        data = await adminGetPendingRedemptions();
      } else {
        data = await adminGetAllRedemptions(filter === 'all' ? undefined : filter);
      }
      setRedemptions(data);
    } catch (err) {
      console.error(err);
      setMessage({ text: err instanceof Error ? err.message : 'Erro ao carregar resgates.', tone: 'danger' });
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // -----------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------

  const handleApprove = async (redemptionId: string) => {
    const notes = notesInput[redemptionId]?.trim();
    if (!notes) {
      setMessage({ text: 'Observação obrigatória para aprovar.', tone: 'danger' });
      return;
    }

    setProcessingId(redemptionId);
    try {
      const result = await adminApproveRedemption(redemptionId, notes);
      setMessage({ text: result.message || 'Resgate aprovado.', tone: 'success' });
      await loadData();
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Erro ao aprovar.', tone: 'danger' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (redemptionId: string) => {
    const notes = notesInput[redemptionId]?.trim();
    if (!notes) {
      setMessage({ text: 'Observação obrigatória para rejeitar.', tone: 'danger' });
      return;
    }

    setProcessingId(redemptionId);
    try {
      const result = await adminRejectRedemption(redemptionId, notes);
      setMessage({ text: result.message || 'Resgate rejeitado.', tone: 'success' });
      await loadData();
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Erro ao rejeitar.', tone: 'danger' });
    } finally {
      setProcessingId(null);
    }
  };

  const canAct = (status: string) => ['requested', 'under_review', 'approved'].includes(status);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-16 pt-12 sm:px-6">
      {/* Background effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 15% 22%, rgba(176,132,255,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 50% 45% at 85% 35%, rgba(255,70,85,0.06) 0%, transparent 55%)',
            'radial-gradient(ellipse 45% 38% at 60% 8%, rgba(13,240,255,0.06) 0%, transparent 55%)',
          ].join(', '),
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-6">

        {/* Toast */}
        {message && (
          <div className={`rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl flex justify-between items-start ${
            message.tone === 'danger' ? 'border-[var(--dl-keyword)]/20' : 'border-[var(--dl-string)]/20'
          }`}>
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                {message.tone === 'success' ? '✓ Sucesso' : '✕ Erro'}
              </p>
              <p className="text-sm text-[var(--dl-muted-light)]">{message.text}</p>
            </div>
            <button onClick={() => setMessage(null)} className="text-[var(--dl-muted)] hover:text-white transition">
              ✕
            </button>
          </div>
        )}

        {/* Header */}
        {/* UI_MARKER: admin-wallet.hero.401 | Hero Admin Carteira */}
        <section
          data-ui-id={UI_MARKERS.adminWallet.hero.id}
          data-ui-label={UI_MARKERS.adminWallet.hero.label}
          className="rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl md:p-8"
        >
          <UiMarker {...UI_MARKERS.adminWallet.hero} />
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--dl-keyword)] shadow-[0_0_6px_var(--dl-keyword)]" />
              <span className="font-['Inter'] text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                Painel Admin · Carteira
              </span>
            </div>

            <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
              Gerenciar Resgates
              <span className="block text-[var(--dl-function)]">DuoCoins</span>
            </h1>

            <p className="max-w-2xl font-['Inter'] text-[1rem] font-light leading-[1.75] text-[var(--dl-muted-light)]">
              Revise, aprove ou rejeite solicitações de resgate. Toda ação requer uma observação e gera registro de auditoria.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-xl border px-4 py-2.5 font-['Inter'] text-[0.75rem] font-semibold uppercase tracking-[0.1em] transition ${
                filter === f.value
                  ? 'border-[var(--dl-number)]/40 bg-[var(--dl-number)]/15 text-[var(--dl-number)]'
                  : 'border-white/[0.08] bg-white/[0.04] text-[var(--dl-muted-light)] hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </section>

        {/* Redemption Queue */}
        {/* UI_MARKER: admin_wallet.pending_redemptions.403 | Fila de resgates */}
        <section
          data-ui-id={UI_MARKERS.adminWallet.pendingRedemptions.id}
          data-ui-label={UI_MARKERS.adminWallet.pendingRedemptions.label}
          className="space-y-4"
        >
          <UiMarker {...UI_MARKERS.adminWallet.pendingRedemptions} />
          {isLoading ? (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 text-center backdrop-blur-xl">
              <p className="text-[var(--dl-muted-light)] animate-pulse">Carregando resgates...</p>
            </div>
          ) : redemptions.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 text-center backdrop-blur-xl">
              <p className="text-[var(--dl-muted-light)]">Nenhum resgate encontrado para este filtro.</p>
            </div>
          ) : (
            redemptions.map((r) => (
              <article
                key={r.id}
                data-ui-id={UI_MARKERS.adminWallet.redemptionCard.id}
                data-ui-label={UI_MARKERS.adminWallet.redemptionCard.label}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.07]"
              >
                {/* UI_MARKER: admin_wallet.redemption_card.404 | Card de resgate */}
                <UiMarker {...UI_MARKERS.adminWallet.redemptionCard} hideInProduction={true} />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-['Rajdhani'] text-xl font-bold uppercase text-white">
                        {r.reward_label}
                      </h3>
                      <span className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[0.62rem] ${
                        statusColor[r.status] || 'text-[var(--dl-muted)]'
                      }`}>
                        {statusLabel[r.status] || r.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 font-mono text-[0.72rem] text-[var(--dl-muted)]">
                      <span>Valor: <strong className="inline-flex items-center gap-1 text-[var(--dl-number)]"><img src={duoCoinIcon16} alt="" className="h-3.5 w-3.5" />{formatDuoCoins(r.amount)}</strong></span>
                      <span>Tipo: <strong className="text-white">{r.reward_type}</strong></span>
                      <span>Data: {new Date(r.requested_at).toLocaleDateString('pt-BR')}</span>
                      <span className="break-all">ID: {r.user_id.slice(0, 8)}…</span>
                    </div>

                    {r.admin_notes && (
                      <p className="mt-2 text-sm italic text-[var(--dl-muted)]">
                        Obs: {r.admin_notes}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="text-right flex flex-col items-end">
                    <span className="flex items-center gap-1.5 font-mono text-2xl font-bold text-[var(--dl-warning)]">
                      {formatDuoCoins(r.amount)}
                      <img src={duoCoinIcon32} alt="DC" className="h-7 w-7 drop-shadow-[0_0_8px_rgba(255,209,102,.4)]" />
                    </span>
                  </div>
                </div>

                {/* Admin actions */}
                {canAct(r.status) && (
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <label className="mb-2 block font-['Inter'] text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                      Observação admin (obrigatória)
                    </label>
                    <textarea
                      value={notesInput[r.id] || ''}
                      onChange={(e) => setNotesInput((prev) => ({ ...prev, [r.id]: e.target.value }))}
                      placeholder="Motivo da decisão..."
                      rows={2}
                      className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white placeholder-[var(--dl-muted)] outline-none transition focus:border-white/[0.18] focus:bg-black/30"
                    />

                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleApprove(r.id)}
                        disabled={processingId === r.id}
                        className="rounded-xl bg-[var(--dl-string)] px-5 py-2.5 font-['Inter'] text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_4px_16px_rgba(71,227,147,0.2)] transition hover:shadow-[0_4px_24px_rgba(71,227,147,0.35)] disabled:opacity-40"
                      >
                        {processingId === r.id ? 'Processando...' : '✓ Aprovar e Pagar'}
                      </button>

                      <button
                        onClick={() => handleReject(r.id)}
                        disabled={processingId === r.id}
                        className="rounded-xl border border-[var(--dl-keyword)]/30 bg-[var(--dl-keyword)]/10 px-5 py-2.5 font-['Inter'] text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[var(--dl-keyword)] transition hover:bg-[var(--dl-keyword)]/20 disabled:opacity-40"
                      >
                        {processingId === r.id ? 'Processando...' : '✕ Rejeitar'}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </section>

        {/* Admin guidelines */}
        {/* UI_MARKER: admin_wallet.operational_summary.402 | Resumo operacional */}
        <section
          data-ui-id={UI_MARKERS.adminWallet.operationalSummary.id}
          data-ui-label={UI_MARKERS.adminWallet.operationalSummary.label}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl"
        >
          <UiMarker {...UI_MARKERS.adminWallet.operationalSummary} />
          <h4 className="mb-3 font-['Rajdhani'] text-xl font-bold uppercase text-white">
            Regras de administração
          </h4>
          <ul className="space-y-2 text-sm text-[var(--dl-muted-light)]">
            <li>• Toda ação de aprovação ou rejeição exige uma observação obrigatória.</li>
            <li>• Cada ação gera um registro de auditoria (wallet_audit_logs).</li>
            <li>• Resgate aprovado: saldo sai de "bloqueado" e vira "resgatado".</li>
            <li>• Resgate rejeitado: saldo retorna para "disponível" + registro de estorno.</li>
            <li>• Nenhuma entrada do ledger pode ser apagada ou editada.</li>
            <li>• Em caso de fraude, congelar a carteira antes de investigar.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminWalletPage;
