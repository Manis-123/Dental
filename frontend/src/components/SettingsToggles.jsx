import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsToggles({ className = '' }) {
  const { t } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className={`settings-toggles ${className}`.trim()}>
      <button type="button" className="icon-btn" onClick={toggleTheme} title={isDark ? t('lightMode') : t('darkMode')}>
        {isDark ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
