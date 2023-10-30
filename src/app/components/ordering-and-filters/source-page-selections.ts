import {SourcePagesService} from "../../services/source-pages.service";
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from "ngx-bootstrap-multiselect";
import {SourcePage} from "../../data/source-page";

export class SourcePageSelections {
  selections: number[] = [];

  settings: IMultiSelectSettings = {
    buttonClasses: "btn btn-outline-primary w-100",
    dynamicTitleMaxItems: 1,
    containerClasses: "w-100"
  };

  texts: IMultiSelectTexts = {
    defaultTitle: "select"
  };

  options: IMultiSelectOption[] = [];

  private readonly supportedLanguages: any = {
    "hu": {name: "Hungarian", code: 10000},
    "en": {name: "English", code: 10001}
  };

  constructor(private sourcePagesService: SourcePagesService) {
    this.buildOptions();
  }

  onChange() {
    // TODO
    console.log(`selections = ${JSON.stringify(this.selections)}`);
  }

  select(sourcePages: SourcePage[] | undefined) {
    if (sourcePages === undefined || sourcePages.length === 0) {
      return;
    }

    // TODO
  }

  private buildOptions(): void {
    let options: IMultiSelectOption[] = [];

    for (let languageIso of this.sourcePagesService.allSourcePages.keys()) {
      const languageCode = this.supportedLanguages[languageIso].code;
      const languageName = this.supportedLanguages[languageIso].name;

      options = options.concat({
        id: languageCode,
        name: languageName
      });

      const sourcePagesOfLanguage = this.sourcePagesService.allSourcePages.get(languageIso)!;
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
}
