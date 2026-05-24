import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/atoms';

export function RiotConnectPanel() {
  const navigate = useNavigate();

  return (
    <Card variant="elevated" className="max-w-md w-full mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-2">Conectar Conta Riot</h3>
        <p className="text-sm text-[var(--dl-muted-light)]">
          Vincule sua conta Riot via login seguro para sincronizar estatísticas reais, histórico de partidas e habilitar recompensas do Cofre.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={() => navigate('/riot/connect')}
        >
          Conectar via Riot Sign-On
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[10px] text-[var(--dl-muted)] uppercase tracking-wider">
          Ao conectar, você autoriza o Duo Loot a ler suas estatísticas e partidas do VALORANT através da API oficial da Riot Games.
        </p>
      </div>
    </Card>
  );
}
