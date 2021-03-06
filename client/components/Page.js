import { useEffect, useCallback, useState } from 'react';

import { ScrapeProvider } from './ScrapeContext';

// Custom Hook!
function useScrapes() {
  const [loading, setLoading] = useState(false);
  const [scrapes, setScrapes] = useState(null);

  const [subscriberCount, setSubscriberCount] = useState(null);

  const [pagination, setPagination] = useState({
    index: 0,
    query: '',
  });

  let url =
    process.env.NODE_ENV === 'development' ? 'http://localhost:2000/' : '';

  // fetch function
  async function fetchScrapes(query = '', index = 0) {
    setLoading(true);
    const res = await fetch(
      query
        ? `${url}search-jobs?index=${index}&query=${query}`
        : `${url}all-jobs?index=${index}`
    );
    const data = await res.json();

    setLoading(false);
    if (index !== 0) {
      setScrapes([...scrapes, ...data]);
    } else {
      setScrapes(data);
    }
  }

  async function subscribe(email, query) {
    const res = await fetch(`${url}subscribe?query=${query}&email=${email}`);
  }

  async function getSubscriberCount() {
    const res = await fetch(`${url}get-subscriber-count`);
    const data = await res.json();
    setSubscriberCount(data.count);
  }

  const setEmailAlert = useCallback(({ query, email }) => {
    subscribe(email, query);
  }, []);

  const fetchWithQuery = useCallback(
    (query) => {
      setScrapes(null);
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
    getSubscriberCount();
  }, []);

  return {
    scrapes,
    subscriberCount,
    fetchScrapes,
    fetchWithQuery,
    setEmailAlert,
    fetchMore,
    loading,
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
