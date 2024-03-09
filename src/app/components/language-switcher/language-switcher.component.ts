import {Component} from '@angular/core';
import {Language, LanguageService} from "../../services/language.service";

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
  Language = Language;

  constructor(public languageService: LanguageService) {
  }

  selectLanguage(language: Language) {
    this.languageService.usedLanguage = language
  }
}
