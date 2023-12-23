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
import {SearchModeComponent} from './components/search-mode/search-mode.component';
import {RecipePagingComponent} from './components/recipe-paging/recipe-paging.component';
import {RecipeCardComponent} from './components/recipe-card/recipe-card.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {OrderingAndFiltersComponent} from './components/ordering-and-filters/ordering-and-filters.component';
import {
  ExtraIngredientsSearcherComponent
} from './components/extra-ingredients-searcher/extra-ingredients-searcher.component';
import {
  IngredientsConflictModalComponent
} from './components/ingredients-conflict-modal/ingredients-conflict-modal.component';
import {NgxBootstrapMultiselectModule} from "ngx-bootstrap-multiselect";
import {
  FacebookLoginProvider,
  GoogleLoginProvider, GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  SocialLoginModule
} from "@abacritt/angularx-social-login";

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
    RecipeCardComponent,
    OrderingAndFiltersComponent,
    ExtraIngredientsSearcherComponent,
    IngredientsConflictModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgOptimizedImage,
    FormsModule,
    NgxSpinnerModule,
    NgxBootstrapMultiselectModule,
    SocialLoginModule,
    GoogleSigninButtonModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('422896297667-5etbi68ruhet99rhffonv8agg4qhc8i5.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('326225733567921')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
