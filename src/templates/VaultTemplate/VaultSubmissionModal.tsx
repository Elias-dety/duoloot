import React, { useState } from 'react';
import { Button, Input } from '@/components/atoms';

interface VaultSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionTitle: string;
  onSubmit: (evidenceText: string, evidenceUrl: string) => Promise<void>;
  isLoading: boolean;
}

export function VaultSubmissionModal({
  isOpen,
  onClose,
  missionTitle,
  onSubmit,
  isLoading,
}: VaultSubmissionModalProps) {
  const [evidenceText, setEvidenceText] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceText.trim() && !evidenceUrl.trim()) {
      setError('Forneça um texto explicativo ou um link de evidência.');
      return;
    }
    setError('');
    await onSubmit(evidenceText, evidenceUrl);
    setEvidenceText('');
    setEvidenceUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1115] border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h3 className="font-['Rajdhani'] text-xl font-bold uppercase text-white">Enviar Conclusão</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h4 className="mb-1 text-xs uppercase tracking-widest text-[var(--dl-muted)]">Missão</h4>
            <p className="font-bold text-white">{missionTitle}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-[var(--dl-error)]">{error}</p>}

            <div>
              <label className="block mb-1 text-sm text-[var(--dl-muted-light)]">Link da Evidência (Opcional)</label>
              <Input 
                type="url" 
                placeholder="https://exemplo.com/screenshot" 
                value={evidenceUrl} 
                onChange={(e) => setEvidenceUrl(e.target.value)} 
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-[var(--dl-muted-light)]">Texto ou explicação (Opcional)</label>
              <textarea
                className="w-full rounded border border-[var(--dl-border)] bg-black/50 p-3 text-sm text-white focus:border-[var(--dl-string)] outline-none"
                rows={4}
                placeholder="Descreva aqui sua conclusão ou cole dados adicionais..."
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-4">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" disabled={isLoading} className="bg-[var(--dl-string)] hover:bg-[var(--dl-string)]/80 text-white">
                {isLoading ? 'Enviando...' : 'Enviar Evidência'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
