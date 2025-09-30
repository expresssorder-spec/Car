
import React, { useState, useCallback, useEffect } from 'react';
import { SearchResult } from './types';
import { fetchCarListings } from './services/geminiService';
import SearchBar from './components/SearchBar';
import SearchResultCard from './components/SearchResultCard';
import { CarIcon, SearchIcon, AlertTriangleIcon, KeyIcon } from './components/Icons';
import LoadingSkeleton from './components/LoadingSkeleton';
import ApiKeyInput from './components/ApiKeyInput';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
  };

  const handleSearch = useCallback(async () => {
    if (!apiKey.trim()) {
      setError('المرجو إدخال المفتاح السري ديال API.');
      return;
    }
    if (!query.trim()) {
      setError('المرجو إدخال معلومات البحث');
      return;
    }
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchResults([]);

    try {
      const results = await fetchCarListings(query, apiKey);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && /API[-_ ]?KEY/i.test(err.message)) {
        setError('المفتاح السري ديال API ماشي صحيح أو فيه شي مشكل. تأكد منو.');
      } else {
        setError('وقع شي مشكل فالسيرفر. عاود حاول من بعد.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, apiKey]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <LoadingSkeleton key={i} />)}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-lg font-bold text-red-700 dark:text-red-300">خطأ</p>
          <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
        </div>
      );
    }
    
    if (!apiKey.trim()) {
       return (
         <div className="text-center py-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <KeyIcon className="mx-auto h-12 w-12 text-yellow-500" />
          <p className="mt-4 text-lg font-bold text-yellow-700 dark:text-yellow-300">مفتاح API مطلوب</p>
          <p className="mt-2 text-yellow-600 dark:text-yellow-400">
            باش تبدا تقلب، خاصك تحط المفتاح السري ديال Gemini API فالبلاصة ديالو الفوق.
          </p>
        </div>
      );
    }
    
    if (hasSearched && searchResults.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 rounded-lg">
           <SearchIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <p className="mt-4 text-lg font-bold text-gray-700 dark:text-gray-300">لا توجد نتائج</p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">ما لقينا والو. جرب قلب بحاجة خرى.</p>
        </div>
      );
    }
    
    if (searchResults.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((result, index) => (
            <SearchResultCard key={index} result={result} />
          ))}
        </div>
      );
    }

    return (
       <div className="text-center py-12">
        <CarIcon className="mx-auto h-16 w-16 text-blue-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-200">مرحبا بك في محرك البحث</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">استعمل شريط البحث الفوق باش تلقى الطوموبيل لي كتقلب عليها.</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col items-center gap-4">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CarIcon className="w-8 h-8 text-blue-600 dark:text-blue-500" />
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Moteur<span className="text-blue-600 dark:text-blue-500">.ma</span>
              </h1>
            </div>
            <div className="w-full sm:max-w-sm">
                <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
            </div>
          </div>
          <div className="w-full sm:max-w-md lg:max-w-lg">
            <SearchBar 
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
              disabled={!apiKey.trim()}
            />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        { hasSearched && !isLoading && searchResults.length > 0 &&
            <h2 className="text-xl font-bold mb-6 text-gray-700 dark:text-gray-300">
                نتائج البحث لـ <span className="text-blue-600 dark:text-blue-500">"{query}"</span>
            </h2>
        }
        {renderContent()}
      </main>

       <footer className="text-center py-6 mt-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Moteur.ma. كل الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
};

export default App;
