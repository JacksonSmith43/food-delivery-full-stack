export interface CategoryType {
  id: number;
  categorie: string;
  categorieImage: string;
}

export interface RestaurantType {
  id: number;
  restaurantName: string;
  categories: CategoryType[];
  imageName: string;
  plz: string;
}
