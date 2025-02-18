
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeSwitcher } from "./ThemeSwitcher";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <ThemeSwitcher />
      <Button
        variant="outline"
        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        className="px-4 py-2"
      >
        {language === 'en' ? 'العربية' : 'English'}
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
