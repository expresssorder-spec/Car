
export interface SearchResult {
  carName: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  source: 'Avito.ma' | 'Moteur.ma' | 'Wandaloo.com' | 'Voiture.ma';
  imageUrl: string;
}
