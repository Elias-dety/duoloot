import React, { useState, useEffect } from 'react';
import { intervalToDuration, isBefore, Duration } from 'date-fns';

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
      <div className="flex gap-2 items-center text-danger font-bold uppercase tracking-wider text-sm">
        <span>Encerrado</span>
      </div>
    );
  }

  if (!duration) return null;

  const formatUnit = (value: number | undefined) => String(value || 0).padStart(2, '0');

  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white tabular-nums">{formatUnit(duration.days)}</span>
        <span className="text-[10px] uppercase text-content-muted font-medium">Dias</span>
      </div>
      <span className="text-zinc-700 font-bold mb-4">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white tabular-nums">{formatUnit(duration.hours)}</span>
        <span className="text-[10px] uppercase text-content-muted font-medium">Horas</span>
      </div>
      <span className="text-zinc-700 font-bold mb-4">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white tabular-nums">{formatUnit(duration.minutes)}</span>
        <span className="text-[10px] uppercase text-content-muted font-medium">Min</span>
      </div>
      <span className="text-zinc-700 font-bold mb-4">:</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-orange-500 tabular-nums">{formatUnit(duration.seconds)}</span>
        <span className="text-[10px] uppercase text-content-muted font-medium">Seg</span>
      </div>
    </div>
  );
};
