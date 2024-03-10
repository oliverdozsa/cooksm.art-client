import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {SearchSnapshotService} from "./search-snapshot.service";
import {TranslateSnapshot} from "./translate-snapshot";
import {SearchSnapshot} from "../data/search-snapshot";
import {RecipesService} from "./recipes.service";
import {WhenSnapshotLoadedOps} from "./recipe-service-operations/when-snapshot-loaded-ops";
import {UserService} from "./user.service";
import {IngredientSearchService} from "./ingredient-search.service";
import {SearchSnapshotTransform} from "../data/search-snapshot-ops/search-snapshot-transform";

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
    this.changePath();
  }

  get usedLanguage(): Language {
    return this._usedLanguage;
  }

  get usedLanguageId(): number {
    return SearchSnapshotTransform.toLanguageId(this.searchSnapshotService.snapshot)
  }

  private _usedLanguage;

  constructor(@Inject(LOCALE_ID) public activeLocale: string, private searchSnapshotService: SearchSnapshotService,
              private recipesService: RecipesService, private userService: UserService, private ingredientSearchService: IngredientSearchService) {
    TranslateSnapshot.translatedSnapshot.subscribe({
      next: s => this.onSnapshotTranslated(s),
      error: () => this.translateSnapshotFinished()
    });

    const activeLanguage = LanguageService.toLanguage(activeLocale);
    this._usedLanguage = activeLanguage;

    if (searchSnapshotService.cloneSnapshot().locale != activeLocale) {
      this.translateSnapshot();
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
    const translateSnapshot =
      new TranslateSnapshot(this.usedLanguageId, this.searchSnapshotService.cloneSnapshot(), this.ingredientSearchService);
    translateSnapshot.translate()

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
  }
}
