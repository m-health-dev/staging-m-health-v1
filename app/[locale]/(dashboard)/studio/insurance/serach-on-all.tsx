"use client";

import { useEffect, useState, useCallback } from "react";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

const debounce = (func: Function, delay: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const SearchOnAll = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ⏳ Debounce handler
  const handleDebounce = useCallback(
    debounce((val: string) => setDebouncedQuery(val), 500),
    []
  );

  // Ketika user mengetik
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    handleDebounce(e.target.value);
  };

  // 🔍 Fetch API ketika debouncedQuery berubah
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `${apiBaseUrl}/api/v1/wellness?search=${encodeURIComponent(
            debouncedQuery
          )}`
        );
        const data = await res.json();

        setResults(data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  return (
    <div className="w-full max-w-xl mx-auto py-10">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search wellness..."
        className="w-full border p-3 rounded-lg"
      />

      {/* Loading */}
      {loading && <p className="mt-3 text-sm text-gray-500">Searching...</p>}

      {/* Results */}
      <div className="mt-5 space-y-3">
        {results.length === 0 && debouncedQuery && !loading && (
          <p className="text-sm text-gray-500">No results found.</p>
        )}

        {results.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white border rounded-lg shadow-sm"
          >
            <h3 className="font-semibold">{item.id_title}</h3>
            <p className="text-sm text-gray-600">{item.en_title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchOnAll;
