import { useEffect, useCallback, useState } from 'react';

import { ScrapeProvider } from './ScrapeContext';

// Custom Hook!
function useScrapes() {
  // Intial State inside our hook
  const [scrapes, setScrapes] = useState([]);
  // fetch function
  async function fetchScrapes(query) {
    const res = await fetch(
      query
        ? `http://localhost:2093/search-jobs?query=${query}`
        : `http://localhost:2093/all-jobs`
    );
    const data = await res.json();
    setScrapes(data);
  }

  async function subscribe(email, query) {
    const res = await fetch(
      `http://localhost:2093/subscribe?query=${query}&email=${email}`
    );
  }

  const setEmailAlert = useCallback(({ query, email }) => {
    subscribe(email, query);
  }, []);

  const fetchWithQuery = useCallback((query) => {
    fetchScrapes(query);
  }, []);

  // didMount/Did Update
  useEffect(() => {
    fetchScrapes();
  }, []);
  return { scrapes, fetchScrapes, fetchWithQuery, setEmailAlert };
}

export default function Page({ children }) {
  const hookInfo = useScrapes();
  return (
    <ScrapeProvider value={hookInfo}>
      <div className="page">{children}</div>
    </ScrapeProvider>
  );
}
