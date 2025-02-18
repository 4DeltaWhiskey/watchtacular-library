
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { FormattedMessage } from "react-intl";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Link to="/admin">
        <Button variant="outline" size="icon" className="bg-background flex gap-2 px-3">
          <Settings className="h-5 w-5" />
          <FormattedMessage id="app.admin" />
        </Button>
      </Link>
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
