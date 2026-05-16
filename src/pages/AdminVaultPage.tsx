// Painel técnico temporário para validação manual do Cofre.
// Futuramente será substituído por um dashboard admin completo.

import React, { useEffect, useState } from 'react';
import { getPendingVaultSubmissions, validateVaultSubmission } from '@/services/vault-admin.service';
import { SectionTitle } from '@/components/atoms/SectionTitle';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';

export default function AdminVaultPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getPendingVaultSubmissions();
      setSubmissions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar submissões.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleValidate = async (id: string, isValid: boolean) => {
    if (!confirm(`Tem certeza que deseja ${isValid ? 'APROVAR' : 'REPROVAR'} esta submissão?`)) return;
    
    try {
      setProcessingId(id);
      await validateVaultSubmission(id, isValid);
      setSubmissions(prev => prev.filter(s => s.id !== id));
      alert(`Submissão ${isValid ? 'aprovada' : 'reprovada'} com sucesso!`);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <SectionTitle title="Validação do Cofre" subtitle="Painel Administrativo" />
        <div className="mt-12 flex justify-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="flex justify-between items-end mb-8">
        <SectionTitle 
          title="Validação do Cofre" 
          subtitle="Painel técnico temporário para validação manual de missões." 
          accent="info"
        />
        <Button variant="secondary" size="sm" onClick={fetchSubmissions} disabled={loading}>
          Atualizar Lista
        </Button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          <strong>Erro:</strong> {error}
        </div>
      )}

      <div className="grid gap-6">
        {submissions.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center bg-white/5 border-white/10">
            <p className="text-content-secondary italic">Nenhuma submissão pendente encontrada.</p>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="p-6 bg-white/5 border-white/10 hover:border-white/20 transition-colors">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Jogador */}
                <div className="flex items-start gap-4 min-w-[240px]">
                  <Avatar 
                    src={submission.player?.avatar_url} 
                    fallback={submission.player?.nickname?.charAt(0) || 'U'} 
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-lg leading-tight">{submission.player?.nickname}</span>
                    <span className="text-xs text-content-secondary">{submission.player?.name}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default">Score: {submission.player?.trust_score}</Badge>
                      <span className="text-[10px] uppercase tracking-widest text-content-tertiary">
                        {new Date(submission.created_at).toLocaleDateString()} {new Date(submission.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Missão */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-content-tertiary mb-1">Evento / Missão</h4>
                    <p className="text-white font-medium">{submission.event?.title}</p>
                    <p className="text-sm text-brand-primary font-bold">{submission.task?.title}</p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-content-tertiary mb-1">Dados Enviados (Payload)</h4>
                    <div className="p-3 bg-black/40 rounded border border-white/5 overflow-x-auto">
                      <pre className="text-[11px] font-mono text-content-secondary whitespace-pre-wrap">
                        {JSON.stringify(submission.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-row md:flex-col gap-3 min-w-[140px] justify-center">
                  <Button 
                    variant="success" 
                    fullWidth 
                    size="sm"
                    onClick={() => handleValidate(submission.id, true)}
                    disabled={!!processingId}
                  >
                    {processingId === submission.id ? 'Aprovando...' : 'Aprovar'}
                  </Button>
                  <Button 
                    variant="danger" 
                    fullWidth 
                    size="sm"
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
