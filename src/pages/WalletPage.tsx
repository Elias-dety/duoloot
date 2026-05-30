import React, { useEffect, useState, useCallback } from 'react';
import {
  getMyWalletAccount,
  getMyWalletLedger,
  getMyRedemptions,
  getRewardCatalog,
  requestWalletRedemption,
} from '@/services/wallet.service';
import type {
  WalletAccount,
  WalletLedgerEntry,
  WalletRedemption,
  RewardCatalogItem,
} from '@/features/wallet/wallet.schema';

import { UiMarker } from '@/components/atoms';
import { UI_MARKERS } from '@/config/uiMarkers';

import duoCoinIcon16 from '@/assets/icons/duoloot_pontos_token_check_16px.png';
import duoCoinIcon32 from '@/assets/icons/duoloot_pontos_token_check_32px.png';
import duoCoinIcon50 from '@/assets/icons/duoloot_pontos_token_check_50px.png';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDuoCoins = (amount: number) =>
  new Intl.NumberFormat('pt-BR').format(amount);

const ledgerTypeLabel: Record<string, string> = {
  mission_reward: 'Missão concluída',
  event_bonus: 'Bônus de evento',
  admin_credit: 'Crédito admin',
  admin_debit: 'Débito admin',
  redemption_debit: 'Resgate solicitado',
  redemption_refund: 'Estorno de resgate',
  fraud_reversal: 'Reversão antifraude',
  manual_adjustment: 'Ajuste manual',
};

const redemptionStatusLabel: Record<string, string> = {
  requested: 'Solicitado',
  under_review: 'Em análise',
  approved: 'Aprovado',
  paid: 'Pago',
  rejected: 'Rejeitado',
  cancelled: 'Cancelado',
};

const redemptionStatusColor: Record<string, string> = {
  requested: 'text-[var(--dl-warning)] border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10',
  under_review: 'text-[var(--dl-number)] border-[var(--dl-number)]/30 bg-[var(--dl-number)]/10',
  approved: 'text-[var(--dl-string)] border-[var(--dl-string)]/30 bg-[var(--dl-string)]/10',
  paid: 'text-[var(--dl-string)] border-[var(--dl-string)]/30 bg-[var(--dl-string)]/10',
  rejected: 'text-[var(--dl-keyword)] border-[var(--dl-keyword)]/30 bg-[var(--dl-keyword)]/10',
  cancelled: 'text-[var(--dl-muted)] border-[var(--dl-muted)]/30 bg-[var(--dl-muted)]/10',
};

const ledgerStatusColor: Record<string, string> = {
  pending: 'text-[var(--dl-warning)]',
  confirmed: 'text-[var(--dl-string)]',
  cancelled: 'text-[var(--dl-muted)]',
  reversed: 'text-[var(--dl-keyword)]',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const WalletPage: React.FC = () => {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [ledger, setLedger] = useState<WalletLedgerEntry[]>([]);
  const [redemptions, setRedemptions] = useState<WalletRedemption[]>([]);
  const [catalog, setCatalog] = useState<RewardCatalogItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'danger' | 'info' } | null>(null);

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [accountData, ledgerData, redemptionData, catalogData] = await Promise.all([
        getMyWalletAccount(),
        getMyWalletLedger(50),
        getMyRedemptions(20),
        getRewardCatalog(),
      ]);
      setAccount(accountData);
      setLedger(ledgerData);
      setRedemptions(redemptionData);
      setCatalog(catalogData);
    } catch (err) {
      console.error(err);
      setMessage({ text: err instanceof Error ? err.message : 'Erro ao carregar carteira.', tone: 'danger' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // -----------------------------------------------------------------------
  // Redeem handler
  // -----------------------------------------------------------------------

  const handleRedeem = async (item: RewardCatalogItem) => {
    if (isRedeeming) return;

    if (!account || account.available_balance < item.cost) {
      setMessage({ text: 'Saldo insuficiente para este resgate.', tone: 'danger' });
      return;
    }

    if (account.status !== 'active') {
      setMessage({ text: 'Sua carteira está bloqueada.', tone: 'danger' });
      return;
    }

    setIsRedeeming(item.id);
    try {
      const result = await requestWalletRedemption({
        rewardType: item.reward_type,
        rewardLabel: item.title,
        amount: item.cost,
      });

      if (result.success) {
        setMessage({ text: 'Resgate solicitado com sucesso! Aguarde aprovação.', tone: 'success' });
        await loadData();
      }
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Erro ao solicitar resgate.', tone: 'danger' });
    } finally {
      setIsRedeeming(null);
    }
  };

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
            'radial-gradient(ellipse 60% 50% at 15% 22%, rgba(13,240,255,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 50% 45% at 85% 35%, rgba(176,132,255,0.08) 0%, transparent 55%)',
            'radial-gradient(ellipse 45% 38% at 60% 8%, rgba(255,209,102,0.06) 0%, transparent 55%)',
            'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(13,240,255,0.05) 0%, transparent 60%)',
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

        {/* Toast message */}
        {message && (
          <div className={`rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl flex justify-between items-start ${
            message.tone === 'danger' ? 'border-[var(--dl-keyword)]/20' : message.tone === 'success' ? 'border-[var(--dl-string)]/20' : ''
          }`}>
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                {message.tone === 'success' ? '✓ Sucesso' : message.tone === 'danger' ? '✕ Erro' : 'ℹ Info'}
              </p>
              <p className="text-sm text-[var(--dl-muted-light)]">{message.text}</p>
            </div>
            <button onClick={() => setMessage(null)} className="text-[var(--dl-muted)] hover:text-white transition">
              ✕
            </button>
          </div>
        )}

        {/* Hero */}
        {/* UI_MARKER: wallet.hero.301 | Hero Carteira */}
        <section
          data-ui-id={UI_MARKERS.wallet.hero.id}
          data-ui-label={UI_MARKERS.wallet.hero.label}
          className="grid items-center gap-8 rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_360px] md:p-8"
        >
          <UiMarker {...UI_MARKERS.wallet.hero} />
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--dl-number)] shadow-[0_0_6px_var(--dl-number)]" />
              <span className="font-['Inter'] text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                Carteira DuoCoins
              </span>
            </div>

            <div>
              <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
                Minha Carteira
                <span className="block text-[var(--dl-number)]">
                  DuoCoins
                </span>
              </h1>
              <p className="mt-5 max-w-2xl font-['Inter'] text-[1rem] font-light leading-[1.75] text-[var(--dl-muted-light)]">
                Complete missões, acumule DuoCoins e troque por recompensas exclusivas dentro da plataforma.
              </p>
            </div>
          </div>

          {/* Balance showcase */}
          <div className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-black/20 p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(13,240,255,.16),transparent_55%)]" />
            <div className="relative z-10 flex h-full min-h-[260px] flex-col items-center justify-center text-center">
              <div className="grid h-32 w-32 place-items-center rounded-[2rem] border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 shadow-[0_0_44px_rgba(255,209,102,.22)]">
                <img src={duoCoinIcon50} alt="DuoCoin" className="h-[72px] w-[72px] drop-shadow-[0_0_14px_rgba(255,209,102,.5)]" />
              </div>

              <p className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--dl-number)]">
                saldo disponível
              </p>

              {isLoading ? (
                <span className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white animate-pulse">
                  Carregando...
                </span>
              ) : (
                <strong className="mt-2 font-['Rajdhani'] text-5xl font-bold uppercase text-white">
                  {formatDuoCoins(account?.available_balance ?? 0)}
                  <span className="ml-2 text-lg text-[var(--dl-number)]">DC</span>
                </strong>
              )}
            </div>
          </div>
        </section>

        {/* Balance stats */}
        {/* UI_MARKER: wallet.balance_summary.302 | Resumo de saldo */}
        <section
          data-ui-id={UI_MARKERS.wallet.balanceSummary.id}
          data-ui-label={UI_MARKERS.wallet.balanceSummary.label}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="col-span-full">
            <UiMarker {...UI_MARKERS.wallet.balanceSummary} />
          </div>
          {[
            { value: formatDuoCoins(account?.available_balance ?? 0), label: 'Disponível', color: 'text-[var(--dl-number)]', useToken: true },
            { value: formatDuoCoins(account?.locked_balance ?? 0), label: 'Bloqueado', color: 'text-[var(--dl-warning)]', useToken: true },
            { value: formatDuoCoins(account?.lifetime_earned ?? 0), label: 'Total ganho', color: 'text-[var(--dl-string)]', useToken: true },
            { value: formatDuoCoins(account?.lifetime_redeemed ?? 0), label: 'Total resgatado', color: 'text-[var(--dl-function)]', useToken: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.07]"
            >
              {stat.useToken ? (
                <img src={duoCoinIcon32} alt="DC" className="h-8 w-8 shrink-0 drop-shadow-[0_0_8px_rgba(255,209,102,.4)]" />
              ) : (
                <span className="text-2xl">{String('💰')}</span>
              )}
              <div className="flex flex-col gap-0.5">
                <span className={`font-mono text-2xl font-bold leading-none ${stat.color}`}>
                  {isLoading ? '—' : stat.value}
                </span>
                <span className="font-['Inter'] text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[var(--dl-muted)]">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-6">

            {/* Reward Catalog */}
            {/* UI_MARKER: wallet.reward_catalog.303 | Catálogo de recompensas */}
            <section
              data-ui-id={UI_MARKERS.wallet.rewardCatalog.id}
              data-ui-label={UI_MARKERS.wallet.rewardCatalog.label}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <UiMarker {...UI_MARKERS.wallet.rewardCatalog} />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div>
                  <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-warning)]">
                    ↳ Catálogo de recompensas
                  </span>
                  <h2 className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">
                    Troque seus DuoCoins
                  </h2>
                </div>
                <span className="rounded-full border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 px-3 py-1 font-mono text-[0.68rem] text-[var(--dl-warning)]">
                  {catalog.length} disponíveis
                </span>
              </div>

              {catalog.length === 0 && !isLoading ? (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 text-center backdrop-blur-xl">
                  <p className="text-[var(--dl-muted-light)]">Nenhuma recompensa disponível no momento.</p>
                  <p className="mt-1 text-sm text-[var(--dl-muted)]">Em breve novas recompensas serão adicionadas.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {catalog.map((item) => {
                    const canAfford = (account?.available_balance ?? 0) >= item.cost;
                    const isActive = account?.status === 'active';

                    return (
                      <article
                        key={item.id}
                        className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.07]"
                      >
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-['Rajdhani'] text-xl font-bold uppercase text-white">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="mt-2 text-sm leading-relaxed text-[var(--dl-muted-light)]">
                                {item.description}
                              </p>
                            )}
                          </div>

                          <span className="shrink-0 flex items-center gap-1.5 rounded-full border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 px-2.5 py-1 font-mono text-[0.7rem] font-bold text-[var(--dl-warning)]">
                            <img src={duoCoinIcon16} alt="" className="h-4 w-4" />
                            {formatDuoCoins(item.cost)}
                          </span>
                        </div>

                        {item.stock_available != null && (
                          <p className="mb-3 font-mono text-[0.68rem] text-[var(--dl-muted)]">
                            {item.stock_available} restantes
                          </p>
                        )}

                        <button
                          onClick={() => handleRedeem(item)}
                          disabled={!canAfford || !isActive || isRedeeming === item.id}
                          className="w-full rounded-xl bg-[var(--dl-number)] px-4 py-3 font-['Inter'] text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_4px_16px_rgba(13,240,255,0.2)] transition hover:shadow-[0_4px_24px_rgba(13,240,255,0.35)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                          {isRedeeming === item.id
                            ? 'Solicitando...'
                            : !canAfford
                              ? 'Saldo insuficiente'
                              : 'Resgatar'}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Ledger / Statement */}
            {/* UI_MARKER: wallet.ledger.305 | Extrato da Carteira */}
            <section
              id="wallet-ledger"
              data-ui-id={UI_MARKERS.wallet.ledger.id}
              data-ui-label={UI_MARKERS.wallet.ledger.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl"
            >
              <UiMarker {...UI_MARKERS.wallet.ledger} />
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div>
                  <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-string)]">
                    ↳ Extrato
                  </span>
                  <h2 className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">
                    Movimentações
                  </h2>
                </div>
                <span className="rounded-full border border-[var(--dl-string)]/30 bg-[var(--dl-string)]/10 px-3 py-1 font-mono text-[0.68rem] text-[var(--dl-string)]">
                  {ledger.length} entradas
                </span>
              </div>

              {ledger.length === 0 && !isLoading ? (
                <p className="py-6 text-center text-sm text-[var(--dl-muted)]">
                  Nenhuma movimentação ainda. Complete missões para ganhar DuoCoins!
                </p>
              ) : (
                <div className="space-y-2">
                  {ledger.map((entry) => (
                    <div
                      key={entry.id}
                      className="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/[0.05] bg-black/20 px-3 py-3"
                    >
                      <span className={`grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] font-mono text-lg ${
                        entry.direction === 'credit' ? 'text-[var(--dl-string)]' : 'text-[var(--dl-keyword)]'
                      }`}>
                        {entry.direction === 'credit' ? '↑' : '↓'}
                      </span>

                      <div className="min-w-0">
                        <strong className="block truncate text-sm text-white">
                          {ledgerTypeLabel[entry.type] || entry.type}
                        </strong>
                        <span className={`block truncate font-mono text-[0.65rem] ${ledgerStatusColor[entry.status] || 'text-[var(--dl-muted)]'}`}>
                          {entry.status} · {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <span className={`flex items-center gap-1 font-mono text-sm font-bold ${
                        entry.direction === 'credit' ? 'text-[var(--dl-string)]' : 'text-[var(--dl-keyword)]'
                      }`}>
                        {entry.direction === 'credit' ? '+' : '-'}{formatDuoCoins(entry.amount)}
                        <img src={duoCoinIcon16} alt="DC" className="h-4 w-4" />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Wallet status */}
            {account && account.status !== 'active' && (
              <section className="rounded-2xl border border-[var(--dl-keyword)]/20 bg-[var(--dl-keyword)]/5 p-5 backdrop-blur-xl">
                <h4 className="mb-2 font-['Rajdhani'] text-xl font-bold uppercase text-[var(--dl-keyword)]">
                  ⚠ Carteira {account.status === 'frozen' ? 'Congelada' : 'Encerrada'}
                </h4>
                <p className="text-sm text-[var(--dl-muted-light)]">
                  {account.status === 'frozen'
                    ? 'Sua carteira está temporariamente congelada. Você pode ver seu saldo e extrato, mas não pode fazer resgates.'
                    : 'Sua carteira foi encerrada. Entre em contato com o suporte para mais informações.'}
                </p>
              </section>
            )}

            {/* Redemption history */}
            {/* UI_MARKER: wallet.redemption_history.304 | Histórico de resgates */}
            <section
              data-ui-id={UI_MARKERS.wallet.redemptionHistory.id}
              data-ui-label={UI_MARKERS.wallet.redemptionHistory.label}
              className="space-y-4"
            >
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <UiMarker {...UI_MARKERS.wallet.redemptionHistory} />
                </div>
              </div>
              <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-function)]">
                ↳ Resgates
              </span>

              <h2 className="mt-3 font-['Rajdhani'] text-3xl font-bold uppercase text-white">
                Seus resgates
              </h2>

              <div className="mt-5 space-y-3">
                {redemptions.length === 0 && !isLoading ? (
                  <p className="py-4 text-center text-sm text-[var(--dl-muted)]">
                    Nenhum resgate solicitado ainda.
                  </p>
                ) : (
                  redemptions.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-xl border border-white/[0.06] bg-black/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <strong className="block text-sm text-white">{r.reward_label}</strong>
                          <span className="mt-1 block text-xs text-[var(--dl-muted-light)]">
                            {formatDuoCoins(r.amount)} DC · {new Date(r.requested_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        <span className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[0.62rem] ${
                          redemptionStatusColor[r.status] || 'text-[var(--dl-muted)]'
                        }`}>
                          {redemptionStatusLabel[r.status] || r.status}
                        </span>
                      </div>

                      {r.admin_notes && (
                        <p className="mt-2 text-xs italic text-[var(--dl-muted)]">
                          Admin: {r.admin_notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* How it works */}
            {/* UI_MARKER: wallet.explainer.306 | Como funcionam DuoCoins */}
            <section
              data-ui-id={UI_MARKERS.wallet.explainer.id}
              data-ui-label={UI_MARKERS.wallet.explainer.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl"
            >
              <UiMarker {...UI_MARKERS.wallet.explainer} />
              <h4 className="mb-3 font-['Rajdhani'] text-xl font-bold uppercase text-white">Como funciona</h4>
              <ul className="space-y-3 text-sm text-[var(--dl-muted-light)]">
                <li className="flex gap-2">
                  <span className="text-[var(--dl-number)]">1.</span>
                  Complete missões no Cofre e ganhe DuoCoins.
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--dl-string)]">2.</span>
                  Escolha uma recompensa no catálogo.
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--dl-warning)]">3.</span>
                  Solicite o resgate. Seu saldo fica bloqueado até a aprovação.
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--dl-function)]">4.</span>
                  Um admin revisa e aprova (ou devolve o saldo).
                </li>
              </ul>
            </section>

            {/* Important note */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
              <h4 className="mb-3 font-['Rajdhani'] text-xl font-bold uppercase text-white">Informações</h4>
              <ul className="space-y-2 text-sm text-[var(--dl-muted-light)]">
                <li>• DuoCoins são saldo interno da plataforma.</li>
                <li>• Recompensas são benefícios internos (badges, temas, destaque).</li>
                <li>• Todo resgate passa por revisão manual.</li>
                <li>• Saldo não pode ser transferido entre contas.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
