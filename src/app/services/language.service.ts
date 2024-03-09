import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {SearchSnapshotService} from "./search-snapshot.service";
import {TranslateSnapshot} from "./translate-snapshot";
import {SearchSnapshot} from "../data/search-snapshot";
import {RecipesService} from "./recipes.service";
import {WhenSnapshotLoadedOps} from "./recipe-service-operations/when-snapshot-loaded-ops";
import {UserService} from "./user.service";
import {IngredientSearchService} from "./ingredient-search.service";

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
    if (this.usedLanguage == Language.Hungarian) {
      return 1;
    } else if (this.usedLanguage == Language.English) {
      return 2;
    }

    return 1;
  }

  private _usedLanguage;

  constructor(@Inject(LOCALE_ID) public activeLocale: string, private searchSnapshotService: SearchSnapshotService,
              private recipesService: RecipesService, private userService: UserService, private ingredientSearchService: IngredientSearchService) {
    const activeLanguage = LanguageService.toLanguage(activeLocale);
    this._usedLanguage = activeLanguage;

    console.log(`active locale: ${activeLocale}, snapshot's locale: ${searchSnapshotService.snapshot.locale}`);

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
      .subscribe({
        next: s => this.onSnapshotTranslated(s),
        error: () => this.translateSnapshotFinished()
      })
  }

  private onSnapshotTranslated(snapshot: SearchSnapshot) {
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
