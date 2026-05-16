-- DUO LOOT - MIGRATION 002
-- Seed de Dados de Desenvolvimento

DO $$
DECLARE
  v_event_id uuid;
BEGIN
  -- Cria o evento do cofre se não existir
  SELECT id INTO v_event_id
  FROM public.vault_events
  WHERE title = 'Cofre Diário Duo Loot'
  LIMIT 1;

  IF v_event_id IS NULL THEN
    INSERT INTO public.vault_events (
      title,
      description,
      prize_pool,
      prize_currency,
      status,
      total_participants,
      online_participants,
      starts_at,
      ends_at
    ) VALUES (
      'Cofre Diário Duo Loot',
      'Evento diário onde o primeiro jogador a concluir as tarefas válidas leva o prêmio.',
      250.00,
      'BRL',
      'active',
      0,
      0,
      now(),
      now() + interval '24 hours'
    ) RETURNING id INTO v_event_id;
  END IF;

  -- Cria a Tarefa 1 se não existir
  IF NOT EXISTS (
    SELECT 1 FROM public.vault_tasks 
    WHERE event_id = v_event_id AND title = 'Primeira vitória do dia'
  ) THEN
    INSERT INTO public.vault_tasks (event_id, title, description, rules, validation_type)
    VALUES (
      v_event_id,
      'Primeira vitória do dia',
      'Vença uma partida válida durante o evento.',
      ARRAY['A partida deve acontecer durante o período do evento', 'O jogador precisa estar inscrito no Cofre', 'A validação pode ser manual nesta primeira versão'],
      'manual'
    );
  END IF;

  -- Cria a Tarefa 2 se não existir
  IF NOT EXISTS (
    SELECT 1 FROM public.vault_tasks 
    WHERE event_id = v_event_id AND title = 'Duo confirmado'
  ) THEN
    INSERT INTO public.vault_tasks (event_id, title, description, rules, validation_type)
    VALUES (
      v_event_id,
      'Duo confirmado',
      'Forme dupla com outro jogador através do lobby.',
      ARRAY['O lobby precisa estar completo', 'Os jogadores precisam confirmar presença', 'A conclusão será validada pela equipe'],
      'manual'
    );
  END IF;

  -- Cria a Tarefa 3 se não existir
  IF NOT EXISTS (
    SELECT 1 FROM public.vault_tasks 
    WHERE event_id = v_event_id AND title = 'Print da missão'
  ) THEN
    INSERT INTO public.vault_tasks (event_id, title, description, rules, validation_type)
    VALUES (
      v_event_id,
      'Print da missão',
      'Envie uma evidência da missão concluída.',
      ARRAY['A imagem deve ser legível', 'A evidência precisa bater com a missão do dia', 'Tentativas falsas podem reduzir o trust score'],
      'manual'
    );
  END IF;

END $$;
