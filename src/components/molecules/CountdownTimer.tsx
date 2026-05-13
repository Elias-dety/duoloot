import React, { useEffect, useState } from 'react';
import { Duration, intervalToDuration, isBefore } from 'date-fns';

export interface CountdownTimerProps {
  targetDate: string;
  size?: 'sm' | 'md' | 'lg';
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onExpire }) => {
  const [duration, setDuration] = useState<Duration | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);

      if (isBefore(target, now)) {
        setIsExpired(true);
        setDuration(null);
        clearInterval(timer);
        onExpire?.();
      } else {
        setDuration(intervalToDuration({ start: now, end: target }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-danger">
        <span>Encerrado</span>
      </div>
    );
  }

  if (!duration) return null;

  const formatUnit = (value: number | undefined) => String(value || 0).padStart(2, '0');

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold tabular-nums text-content-base">{formatUnit(duration.days)}</span>
        <span className="text-[10px] font-medium uppercase text-content-muted">Dias</span>
      </div>
      <span className="mb-4 font-bold text-surface-hover">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold tabular-nums text-content-base">{formatUnit(duration.hours)}</span>
        <span className="text-[10px] font-medium uppercase text-content-muted">Horas</span>
      </div>
      <span className="mb-4 font-bold text-surface-hover">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold tabular-nums text-content-base">{formatUnit(duration.minutes)}</span>
        <span className="text-[10px] font-medium uppercase text-content-muted">Min</span>
      </div>
      <span className="mb-4 font-bold text-surface-hover">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold tabular-nums text-warning">{formatUnit(duration.seconds)}</span>
        <span className="text-[10px] font-medium uppercase text-content-muted">Seg</span>
      </div>
    </div>
  );
};
