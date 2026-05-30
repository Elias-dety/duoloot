import React, { useEffect, useState } from 'react';
import { Card, Button, SectionTitle, Badge } from '@/components/atoms';
import { getPendingVaultSubmissions, validateVaultSubmission } from '@/services/vault-admin.service';

type VaultSubmission = {
  id: string;
  created_at: string;
  payload: Record<string, unknown>;
  event?: {
    title?: string;
  } | null;
  task?: {
    title?: string;
    description?: string;
  } | null;
  player?: {
    name?: string;
    nickname?: string;
    avatar_url?: string | null;
    trust_score?: number | null;
  } | null;
};

export default function AdminVaultPage() {
  const [submissions, setSubmissions] = useState<VaultSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getPendingVaultSubmissions();
      setSubmissions(data);
      setError(null);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar submissões.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSubmissions();
  }, []);

  const handleValidate = async (id: string, isValid: boolean) => {
    if (!window.confirm(`Tem certeza que deseja ${isValid ? 'APROVAR' : 'REPROVAR'} esta submissão?`)) return;

    try {
      setProcessingId(id);
      await validateVaultSubmission(id, isValid);
      setSubmissions((previous) => previous.filter((submission) => submission.id !== id));
      window.alert(`Submissão ${isValid ? 'aprovada' : 'reprovada'} com sucesso!`);
    } catch (error: unknown) {
      window.alert(`Erro: ${error instanceof Error ? error.message : 'Falha ao validar submissão.'}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="container mx-auto p-8 border-t-4 border-[var(--dl-error)] bg-[var(--dl-error-rgb)]/5 min-h-screen">
        <SectionTitle title="Validação do Cofre" subtitle="Painel Administrativo" />
        <div className="mt-12 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-[2560px] 3xl:px-12 4xl:px-24 p-8 border-t-4 border-[var(--dl-error)] bg-black min-h-screen">
      <div className="mb-8 flex items-end justify-between">
        <SectionTitle
          title="Validação do Cofre (ADMIN)"
          subtitle="Painel técnico temporário para validação manual de missões."
          eyebrow="DANGER ZONE"
        />
        <Button variant="secondary" size="sm" onClick={fetchSubmissions} disabled={loading}>
          Atualizar Lista
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-[1rem] border border-[var(--dl-error)] bg-[var(--dl-error)]/10 p-4 text-sm text-[var(--dl-error)]">
          <strong>Erro:</strong> {error}
        </div>
      )}

      <div className="grid gap-6">
        {submissions.length === 0 ? (
          <Card variant="muted" className="flex flex-col items-center justify-center p-12 text-center border-[var(--dl-error)]/20">
            <p className="italic text-[var(--dl-muted-light)]">Nenhuma submissão pendente encontrada.</p>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} variant="accent" className="p-6 transition-colors border-[var(--dl-error)]/30 hover:border-[var(--dl-error)]/60">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex min-w-[240px] items-start gap-4">
                  {submission.player?.avatar_url ? (
                    <img src={submission.player.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full border border-[var(--dl-border)]" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-white border border-[var(--dl-border)]">
                      {submission.player?.nickname?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-lg font-bold leading-tight text-[var(--dl-error)]">{submission.player?.nickname}</span>
                    <span className="text-xs text-[var(--dl-muted-light)]">{submission.player?.name}</span>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="accent">Score: {submission.player?.trust_score || 0}</Badge>
                      <span className="text-[10px] uppercase tracking-widest text-[var(--dl-muted)]">
                        {new Date(submission.created_at).toLocaleDateString()} {new Date(submission.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="mb-1 text-xs uppercase tracking-widest text-[var(--dl-muted)]">Evento / Missão</h4>
                    <p className="font-medium text-white">{submission.event?.title}</p>
                    <p className="text-sm font-bold text-[var(--dl-error)]">{submission.task?.title}</p>
                  </div>

                  <div>
                    <h4 className="mb-1 text-xs uppercase tracking-widest text-[var(--dl-muted)]">Dados Enviados (Payload)</h4>
                    <div className="overflow-x-auto rounded border border-[var(--dl-border)] bg-black/40 p-3">
                      <pre className="whitespace-pre-wrap text-[11px] font-mono text-[var(--dl-muted-light)]">
                        {JSON.stringify(submission.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="flex min-w-[140px] flex-row justify-center gap-3 md:flex-col">
                  <Button
                    variant="primary"
                    size="sm"
                    className="!bg-[var(--dl-success)]"
                    onClick={() => handleValidate(submission.id, true)}
                    disabled={!!processingId}
                  >
                    {processingId === submission.id ? 'Aprovando...' : 'Aprovar'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="!bg-[var(--dl-error)]"
                    onClick={() => handleValidate(submission.id, false)}
                    disabled={!!processingId}
                  >
                    {processingId === submission.id ? 'Reprovando...' : 'Reprovar'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
