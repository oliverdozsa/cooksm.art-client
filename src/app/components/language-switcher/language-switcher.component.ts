import {Component, Inject, LOCALE_ID} from '@angular/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
  Language = Language;

  usedLanguage: Language = Language.English;

  constructor(@Inject(LOCALE_ID) public activeLocale: string) {
    const activeLanguage = LanguageSwitcherComponent.toLanguage(activeLocale);
    this.usedLanguage = activeLanguage;
  }

  selectLanguage(language: Language) {
    if(this.usedLanguage == language) {
      return;
    }

    this.usedLanguage = language;
    const currentPath = window.location.pathname;
    const newLocale = this.currentLanguageToLocale();
    const newPath = `/${newLocale}/${currentPath.slice(4)}`;
    window.location.href = newPath;
  }

  private static toLanguage(locale: string): Language {
    if(locale === "en") {
      return Language.English;
    } else if(locale === "hu") {
      return Language.Hungarian;
    }

    return Language.English;
  }

  private currentLanguageToLocale() {
    if(this.usedLanguage === Language.English) {
      return "en"
    } else if(this.usedLanguage === Language.Hungarian) {
      return "hu";
    }

    return "en";
  }
}

enum Language {
  English,
  Hungarian
}
