import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RouteNames} from "./route-names";
import {HomeComponent} from "./pages/home/home.component";
import {AboutComponent} from "./pages/about/about.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {RecipeBooksComponent} from "./pages/recipe-books/recipe-books.component";

const routes: Routes = [
  {path: RouteNames.HOME, component: HomeComponent},
  {path: RouteNames.RECIPE_BOOKS, component: RecipeBooksComponent},
  {path: RouteNames.ABOUT, component: AboutComponent},
  {path: '', redirectTo: '/' + RouteNames.HOME, pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
