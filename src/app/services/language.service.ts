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
import {InitialSourcePagesService} from "./initial-source-pages.service";
import {SourcePagesService} from "./source-pages.service";
import {Subscription} from "rxjs";

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
  private sourcePagesSubscription: Subscription | undefined;

  constructor(@Inject(LOCALE_ID) public activeLocale: string, private searchSnapshotService: SearchSnapshotService,
              private recipesService: RecipesService, private userService: UserService, ingredientSearchService: IngredientSearchService,
              private spinnerService: NgxSpinnerService, private initialSourcePagesService: InitialSourcePagesService,
              private sourcePagesService: SourcePagesService) {

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

    this.initialSourcePagesService.request.subscribe({
      next: () => this.onRequestInitialSourcePages()
    });
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

    if(!snapshot.hasUserModifiedAnySourcePage) {
      snapshot.search.query.sourcePages = this.sourcePagesService.findByLanguageIso(this.usedLanguageToLocale());
    }

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

  private onRequestInitialSourcePages() {
    if(this.sourcePagesSubscription) {
      this.sourcePagesSubscription.unsubscribe();
    }

    if(this.sourcePagesService.allSourcePages.length > 0) {
      const snapshot = this.recipesService.currentSearchSnapshot;
      snapshot.search.query.sourcePages =
        this.sourcePagesService.findByLanguageIso(this.usedLanguageToLocale());
      snapshot.shouldChangeSourcePagesInInitialQuery = false;
      this.recipesService.queryInitialSnapshot();
      this.searchSnapshotService.set(snapshot);
    } else {
      this.sourcePagesSubscription = this.sourcePagesService.allSourcePageAvailable$
        .subscribe({next: () => this.onRequestInitialSourcePages()});
    }
  }
}
