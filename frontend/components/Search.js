import { debounce } from 'lodash';
import { useContext } from 'react';
import { ScrapeContext } from './ScrapeContext';

export default function Search() {
  const { fetchWithQuery } = useContext(ScrapeContext);
  let debouncedFn;
  const search = (event) => {
    event.persist();
    if (!debouncedFn) {
      debouncedFn = debounce(() => {
        fetchWithQuery(event.target.value);
      }, 300);
    }
    debouncedFn();
  };

  return (
    <section>
      <section class="hero is-medium is-info is-bold">
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
            {/* <h1>Set an Alert</h1> */}
          </div>
        </div>
      </section>
    </section>
  );
}
