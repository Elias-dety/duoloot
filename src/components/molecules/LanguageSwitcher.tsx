import React from 'react';
import { Languages } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/atoms';
import { getNextLanguage, languageOptions, useLanguage } from '@/i18n';

interface LanguageSwitcherProps {
  size?: ButtonProps['size'];
  fullWidth?: boolean;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  size = 'sm',
  fullWidth = false,
  className = '',
}) => {
  const { language, messages: copy, setLanguage } = useLanguage();
  const currentLanguage = languageOptions.find((option) => option.code === language) ?? languageOptions[0];

  return (
    <Button
      type="button"
      variant="secondary"
      size={size}
      fullWidth={fullWidth}
      className={className}
      onClick={() => setLanguage(getNextLanguage(language))}
      aria-label={`${copy.common.switchLanguage}: ${currentLanguage.label}`}
      title={`${copy.common.switchLanguage}: ${currentLanguage.label}`}
    >
      <Languages aria-hidden="true" className="h-4 w-4" />
      <span>{currentLanguage.shortLabel}</span>
    </Button>
  );
};
