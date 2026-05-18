import React from 'react';

interface DuolootMetricCardProps {
  label: string;
  value: string;
}

export const DuolootMetricCard: React.FC<DuolootMetricCardProps> = ({ label, value }) => (
  <div className="rounded-[1.35rem] border border-[var(--dl-border)] bg-white/[0.03] p-5">
    <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">{label}</p>
    <p className="mt-3 font-['Rajdhani'] text-4xl font-bold uppercase text-[var(--dl-text)]">{value}</p>
  </div>
);
