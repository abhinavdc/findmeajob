import { useEffect, useCallback, useState } from 'react';

import { ScrapeProvider } from './ScrapeContext';

// Custom Hook!
function useScrapes() {
  // Intial State inside our hook
  const [scrapes, setScrapes] = useState([]);

  const [pagination, setPagination] = useState({
    index: 0,
    query: '',
  });

  // fetch function
  async function fetchScrapes(query = '', index = 0) {
    const res = await fetch(
      query
        ? `search-jobs?index=${index}&query=${query}`
        : `all-jobs?index=${index}`
    );
    const data = await res.json();

    if (index !== 0) {
      setScrapes([...scrapes, ...data]);
    } else {
      setScrapes(data);
    }
  }

  async function subscribe(email, query) {
    const res = await fetch(`subscribe?query=${query}&email=${email}`);
  }

  const setEmailAlert = useCallback(({ query, email }) => {
    subscribe(email, query);
  }, []);

  const fetchWithQuery = useCallback(
    (query) => {
      setPagination({ index: 0, query });
      fetchScrapes(query, 0);
    },
    [scrapes, pagination]
  );

  const fetchMore = useCallback(() => {
    setPagination({ ...pagination, index: pagination.index + 50 });
    fetchScrapes(pagination.query, pagination.index + 50);
  }, [scrapes, pagination]);

  // didMount/Did Update
  useEffect(() => {
    fetchScrapes();
  }, []);

  return {
    scrapes,
    fetchScrapes,
    fetchWithQuery,
    setEmailAlert,
    fetchMore,
  };
}

export default function Page({ children }) {
  const hookInfo = useScrapes();
  return (
    <ScrapeProvider value={hookInfo}>
      <div className="page">{children}</div>
    </ScrapeProvider>
  );
}
