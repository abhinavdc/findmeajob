import { debounce } from 'lodash';
import { useContext, useState } from 'react';
import { ScrapeContext } from './ScrapeContext';
import Subscribe from './Subscribe';
import Logo from './Logo';

export default function Search() {
  const { fetchWithQuery, subscriberCount } = useContext(ScrapeContext);
  const [query, setQuery] = useState('');
  const [modalState, setModal] = useState({ showModal: false });
  let debouncedFn;
  const search = (event) => {
    event.persist();
    if (!debouncedFn) {
      debouncedFn = debounce(() => {
        setQuery(event.target.value);
        fetchWithQuery(event.target.value);
      }, 700);
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
        subscriberCount={subscriberCount}
      />
      <section class="hero is-danger is-medium is-bold">
        <div class="hero-body">
          <div class="container has-text-centered">
            <Logo></Logo>
            <h2 class="subtitle is-size-6">
              Hottest and latest jobs from Kerala's leading tech-parks
            </h2>
            <div class="columns is-centered">
              <div class="column is-4">
                <div class="control has-icons-right" id="search-bar">
                  <input
                    class="input is-medium has-margin-right-7"
                    type="text"
                    placeholder="Search"
                    onChange={search}
                  />
                  <span class="icon is-medium is-right">
                    <i class="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
            <div style={{ 'min-height': '24px' }}>
              {query !== '' ? (
                <p onClick={setAlert} class="is-clickable noselect centered">
                  Set an Alert
                  <span class="icon">
                    <i class="fa fa-paper-plane"></i>
                  </span>
                </p>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
