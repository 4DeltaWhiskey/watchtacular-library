
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { FormattedMessage } from "react-intl";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50 grid grid-cols-2 gap-2">
      <ThemeSwitcher />
      <Button
        variant="outline"
        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        className="h-10 px-4"
      >
        {language === 'en' ? 'العربية' : 'English'}
      </Button>
      <Link to="/admin" className="col-span-2">
        <Button 
          variant="outline" 
          className="bg-background h-10 w-full flex items-center gap-2 px-4"
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span className="truncate">
            <FormattedMessage id="app.admin" />
          </span>
        </Button>
      </Link>
    </div>
  );
};

export default LanguageSwitcher;
