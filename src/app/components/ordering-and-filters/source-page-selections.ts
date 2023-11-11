import {SourcePagesService} from "../../services/source-pages.service";
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from "ngx-bootstrap-multiselect";
import {SourcePage} from "../../data/source-page";
import {OrderingAndFiltersComponent} from "./ordering-and-filters.component";

export class SourcePageSelections {
  selections: number[] = [];

  settings: IMultiSelectSettings = {
    buttonClasses: "btn btn-outline-primary w-100",
    dynamicTitleMaxItems: 1,
    containerClasses: "w-100"
  };

  texts: IMultiSelectTexts = {
    defaultTitle: $localize `:@@source-select-title:select`
  };

  options: IMultiSelectOption[] = [];

  private readonly supportedLanguages: any = {
    "hu": {name: $localize `:@@supported-language-hun:Hungarian`, code: 10000},
    // "en": {name: "English", code: 10001}
  };

  private sourcePagesService: SourcePagesService;

  constructor(private component: OrderingAndFiltersComponent) {
    this.sourcePagesService = component.sourcePagesService;
    this.buildOptions();
    this.select(this.component.params.sourcePages);
  }

  onChange() {
    const selectedSourcePages = this.sourcePagesService.findWhereIdsIn(this.selections);

    if (selectedSourcePages) {
      this.component.params.sourcePages = selectedSourcePages;
    } else {
      this.component.params.sourcePages = undefined;
    }

    this.component.paramsEvent();
  }

  select(sourcePages: SourcePage[] | undefined) {
    if (sourcePages === undefined || sourcePages.length === 0) {
      return;
    }

    this.selections = sourcePages.map(s => s.id);
    Object.keys(this.supportedLanguages).forEach(l => {
      if(this.isAllSourcePageSelectedForLanguage(l)) {
        this.selections = this.selections.concat(this.supportedLanguages[l].code);
      }
    });
  }

  private buildOptions(): void {
    let options: IMultiSelectOption[] = [];

    for (const languageIso of Object.keys(this.supportedLanguages)) {
      const languageCode = this.supportedLanguages[languageIso].code;
      const languageName = this.supportedLanguages[languageIso].name;

      options = options.concat({
        id: languageCode,
        name: languageName
      });

      const sourcePagesOfLanguage = this.sourcePagesService.findByLanguageIso(languageIso);
      const sourcePageOptions = this.createOptionsForPages(sourcePagesOfLanguage, languageCode);
      options = options.concat(sourcePageOptions);
    }

    this.options = options;
  }

  private createOptionsForPages(sourcePages: SourcePage[], parent: number): IMultiSelectOption[] {
    return sourcePages.map(s => {
      return {
        id: s.id,
        name: s.name,
        parentId: parent
      }
    })
  }

  private isAllSourcePageSelectedForLanguage(languageIso: string): boolean {
    const sourcePagesOfLanguage = this.sourcePagesService.findByLanguageIso(languageIso);
    return sourcePagesOfLanguage.every(s => this.selections.includes(s.id));
  }
}
