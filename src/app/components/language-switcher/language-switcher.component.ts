import {Component} from '@angular/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
  Language = Language;

  usedLanguage: Language = Language.English;

  selectLanguage(language: Language) {
    this.usedLanguage = language;
  }
}

enum Language {
  English,
  Hungarian
}
