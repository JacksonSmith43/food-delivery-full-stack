export interface CategoryType {
  id: number;
  categorie: string;
  categorieImage: string;
}

export interface MenuItemsType {
  id: number;
  foodName: string;
  description: string;
  price: number;
  foodImage: string;
}

export interface RestaurantType {
  id: number;
  restaurantName: string;
  categories: CategoryType[];
  imageName: string;
  plz: string;
  menuItems: MenuItemsType[];
}
