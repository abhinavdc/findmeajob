import { debounce } from 'lodash';
import { useContext, useState } from 'react';
import { ScrapeContext } from './ScrapeContext';
import Subscribe from './Subscribe';

export default function Search() {
  const { fetchWithQuery } = useContext(ScrapeContext);
  const [query, setQuery] = useState('');
  const [modalState, setModal] = useState({ showModal: false });
  let debouncedFn;
  const search = (event) => {
    event.persist();
    if (!debouncedFn) {
      debouncedFn = debounce(() => {
        setQuery(event.target.value);
        fetchWithQuery(event.target.value);
      }, 300);
    }
    debouncedFn();
  };

  const setAlert = () => {
    const newModalState = { showModal: true };
    setModal(newModalState);
  };

  return (
    <section>
      <Subscribe
        showModal={modalState.showModal}
        updateModalState={setModal}
        query={query}
      />
      <section class="hero is-primary is-bold">
        <div class="hero-body">
          <div class="container has-text-centered">
            <h1 class="title is-size-2">Geek Jobs</h1>
            <h2 class="subtitle is-size-6">
              Hotest and latest jobs from Kerala's leading tech-parks
            </h2>
            <div class="columns is-centered">
              <div class="column is-4">
                <div class="control has-icons-right">
                  <input
                    class="input is-medium has-margin-right-7"
                    type="text"
                    placeholder="Find latest jobs"
                    onChange={search}
                  />
                  <span class="icon is-medium is-right">
                    <i class="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
            {query !== '' ? (
              <p onClick={setAlert} class="is-clickable">
                Set an Alert
                <span class="icon">
                  <i class="fa fa-bell"></i>
                </span>
              </p>
            ) : (
              <div style={{ 'min-height': '24px' }}></div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
