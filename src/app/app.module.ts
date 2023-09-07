import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {AboutComponent} from './pages/about/about.component';
import {HomeComponent} from './pages/home/home.component';
import {NgOptimizedImage} from "@angular/common";
import {SearchParamsComponent} from './components/search-params/search-params.component';
import {IngredientSearcherComponent} from './components/ingredient-searcher/ingredient-searcher.component';
import {ChipComponent} from './components/chip/chip.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { SearchModeComponent } from './components/search-mode/search-mode.component';
import { RecipePagingComponent } from './components/recipe-paging/recipe-paging.component';
import { RecipeCardComponent } from './components/recipe-card/recipe-card.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AboutComponent,
    HomeComponent,
    SearchParamsComponent,
    IngredientSearcherComponent,
    ChipComponent,
    SearchModeComponent,
    RecipePagingComponent,
    RecipeCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgOptimizedImage,
    FormsModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
