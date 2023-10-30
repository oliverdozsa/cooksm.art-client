import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {SourcePage} from "../data/source-page";
import {environment} from "../../environments/environment";
import {ApiPaths} from "../api-paths";
import {Page} from "../data/page";
import {delay, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SourcePagesService {
  allSourcePages: Map<string, SourcePage[]> = new Map<string, SourcePage[]>();
  isLoading: boolean = true;
  isError: boolean = false;

  allSourcePageAvailable$: Subject<void> = new Subject<void>();

  private readonly allSourcePagesUrl = environment.apiUrl + '/' + ApiPaths.SOURCE_PAGES;

  constructor(httpClient: HttpClient) {
    this.isLoading = true;
    httpClient.get<Page<SourcePage>>(this.allSourcePagesUrl)
      .subscribe({
        next: s => this.onAllSourcePagesGot(s),
        error: () => this.onError()
      });
  }

  private onAllSourcePagesGot(allSourcePages: Page<SourcePage>) {
    this.isLoading = false;
    allSourcePages.items.forEach(s => this.addSourcePage(s));
    this.allSourcePageAvailable$.next();
  }

  private onError() {
    this.isLoading = false;
    this.isError = true;
  }

  private addSourcePage(sourcePage: SourcePage) {
    if (!this.allSourcePages.has(sourcePage.language)) {
      this.allSourcePages.set(sourcePage.language, []);
    }

    const newSourcePagesByLanguage = this.allSourcePages
      .get(sourcePage.language)!
      .concat(sourcePage);
    this.allSourcePages.set(sourcePage.language, newSourcePagesByLanguage);
  }
}
