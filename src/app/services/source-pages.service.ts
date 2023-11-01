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
  allSourcePages: SourcePage[] = [];
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

  findByLanguageIso(language: string) {
    return this.allSourcePages.filter(s => s.language === language);
  }

  findWhereIdsIn(ids: number[]): SourcePage[] | undefined {
    return this.allSourcePages.filter(s => ids.includes(s.id));
  }

  private onAllSourcePagesGot(allSourcePagesPage: Page<SourcePage>) {
    this.isLoading = false;
    this.allSourcePages = allSourcePagesPage.items;
    this.allSourcePageAvailable$.next();
  }

  private onError() {
    this.isLoading = false;
    this.isError = true;
  }
}
