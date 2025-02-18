
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { FormattedMessage } from "react-intl";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Link to="/admin">
        <Button 
          variant="outline" 
          className="bg-background h-10 flex items-center gap-2 px-4 min-w-[120px]"
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span className="truncate">
            <FormattedMessage id="app.admin" />
          </span>
        </Button>
      </Link>
      <ThemeSwitcher />
      <Button
        variant="outline"
        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        className="h-10 px-4"
      >
        {language === 'en' ? 'العربية' : 'English'}
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
