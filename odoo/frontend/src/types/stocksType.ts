export interface Stock {
  ID_Stock: number;
  Produit: string;
  quantite_disponible: number;
  lieu_stockage: string;
  type_matiere: string;
  Mise_à_Jour: string; // or Date if you're converting it when consuming
}
