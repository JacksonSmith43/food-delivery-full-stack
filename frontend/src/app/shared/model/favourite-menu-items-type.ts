export interface FavouriteMenuItemsType {
  favouriteId: number;

  menuItem: {
    id: number;
    menuItemName: string;
    menuItemImage: string;
    price: number;
  };

  restaurantName: string;
  
  // Add to cart button.
  // toggleFavourite
}
