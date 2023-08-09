export class ApiPaths {
  static RECIPES = 'recipes';
  static SOURCE_PAGES = 'sourcepages';
  static FAVORITE_RECIPES = 'favoriterecipes';
  static ALL_GLOBAL_SEARCHES = 'globalsearches/all';
  static INGREDIENT_NAMES = 'ingredientnames';
  static INGREDIENT_CATEGORIES = 'ingredienttags';
  static RECIPE_SEARCHES = 'recipesearches';
  static SECURITY = 'security';
  static GOOGLE_LOGIN = ApiPaths.SECURITY + '/logingoogle';
  static FACEBOOK_LOGIN = ApiPaths.SECURITY + '/loginfacebook';
  static LOGIN_RENEW = ApiPaths.SECURITY + '/renew';
  static DELETE_PROFILE = ApiPaths.SECURITY + '/deregister';
  static USER_SEARCHES = 'usersearches';
  static RECIPE_BOOKS = 'recipebooks';
}
