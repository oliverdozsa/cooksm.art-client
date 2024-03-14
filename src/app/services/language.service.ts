import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {SearchSnapshotService} from "./search-snapshot.service";
import {SnapshotTranslator} from "./snapshot-translator";
import {SearchSnapshot} from "../data/search-snapshot";
import {RecipesService} from "./recipes.service";
import {WhenSnapshotLoadedOps} from "./recipe-service-operations/when-snapshot-loaded-ops";
import {UserService} from "./user.service";
import {IngredientSearchService} from "./ingredient-search.service";
import {SearchSnapshotTransform} from "../data/search-snapshot-ops/search-snapshot-transform";
import {NgxSpinner, NgxSpinnerService} from "ngx-spinner";

export enum Language {
  English,
  Hungarian
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  isSwitchingInProgress = false;

  set usedLanguage(value: Language) {
    if (this._usedLanguage == value) {
      return;
    }

    this._usedLanguage = value;
    localStorage.setItem("usedLocale", this.usedLanguageToLocale());
    this.changePath();
  }

  get usedLanguage(): Language {
    return this._usedLanguage;
  }

  get usedLanguageId(): number {
    if(this.usedLanguage == Language.Hungarian) {
      return 1;
    } else if(this.usedLanguage == Language.English) {
      return 2;
    }

    return 1;
  }

  private _usedLanguage;
  private snapshotTranslator: SnapshotTranslator;

  constructor(@Inject(LOCALE_ID) public activeLocale: string, private searchSnapshotService: SearchSnapshotService,
              private recipesService: RecipesService, private userService: UserService, private ingredientSearchService: IngredientSearchService,
              private spinnerService: NgxSpinnerService) {

    const savedUsedLocale = localStorage.getItem("usedLocale");
    const localeToUse = savedUsedLocale == null ? activeLocale : savedUsedLocale;

    this.snapshotTranslator = new SnapshotTranslator(ingredientSearchService);

    this.snapshotTranslator.translated$.subscribe({
      next: s => this.onSnapshotTranslated(s),
      error: () => this.translateSnapshotFinished()
    });

    this._usedLanguage = LanguageService.toLanguage(localeToUse);

    if (searchSnapshotService.cloneSnapshot().locale != localeToUse) {
      this.translateSnapshot();
    }

    if(localeToUse != activeLocale) {
      this.changePath();
    }
  }

  private changePath() {
    const currentPath = window.location.pathname;
    const newLocale = this.usedLanguageToLocale();
    const newPath = `/${newLocale}/${currentPath.slice(4)}`;
    window.location.href = newPath;
  }

  private static toLanguage(locale: string): Language {
    if (locale === "en") {
      return Language.English;
    } else if (locale === "hu") {
      return Language.Hungarian;
    }

    return Language.English;
  }

  private usedLanguageToLocale() {
    if (this.usedLanguage === Language.English) {
      return "en"
    } else if (this.usedLanguage === Language.Hungarian) {
      return "hu";
    }

    return "en";
  }

  private translateSnapshot() {
    this.isSwitchingInProgress = true;
    this.spinnerService.show("languageSwitching");

    this.snapshotTranslator.translate(this.usedLanguageId, this.searchSnapshotService.cloneSnapshot());
  }

  private onSnapshotTranslated(snapshot: SearchSnapshot) {
    snapshot.locale = this.usedLanguageToLocale();

    const recipeOperation = this.recipesService.operation$;
    const whenSnapshotLoaded = new WhenSnapshotLoadedOps(snapshot, recipeOperation, this.userService);
    whenSnapshotLoaded.doWhatNecessary();

    this.searchSnapshotService.set(snapshot);

    this.translateSnapshotFinished();
  }

  private translateSnapshotFinished() {
    this.isSwitchingInProgress = false;
    this.spinnerService.hide("languageSwitching");
  }
}
