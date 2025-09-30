
import React from 'react';
import type { SearchResult } from '../types';
import { CalendarIcon, GaugeIcon, MapPinIcon, TagIcon } from './Icons';

interface SearchResultCardProps {
  result: SearchResult;
}

const sourceColors: Record<SearchResult['source'], { bg: string, text: string, border: string }> = {
  'Avito.ma': { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-800 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' },
  'Moteur.ma': { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-800 dark:text-red-300', border: 'border-red-300 dark:border-red-700' },
  'Wandaloo.com': { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-800 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
  'Voiture.ma': { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
};


const SearchResultCard: React.FC<SearchResultCardProps> = ({ result }) => {
  const { carName, price, year, mileage, location, source, imageUrl } = result;

  const formattedPrice = new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('MAD', 'درهم');

  const formattedMileage = new Intl.NumberFormat('fr-MA').format(mileage) + ' كلم';

  const sourceColor = sourceColors[source] || sourceColors['Voiture.ma'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-1 transition-all duration-300 ease-in-out border border-transparent hover:shadow-2xl hover:border-blue-500">
      <div className="relative">
        <img src={imageUrl} alt={carName} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full border ${sourceColor.bg} ${sourceColor.text} ${sourceColor.border}`}>
          {source}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{carName}</h3>
        
        <div className="flex-grow space-y-3 text-sm text-gray-600 dark:text-gray-300 mt-2">
            <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-blue-500"/>
                <span className="font-semibold text-base text-blue-600 dark:text-blue-400">{formattedPrice}</span>
            </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-500"/>
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-2">
            <GaugeIcon className="w-4 h-4 text-gray-500"/>
            <span>{formattedMileage}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-gray-500"/>
            <span>{location}</span>
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
            شوف العرض
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
