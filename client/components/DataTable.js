import { useContext } from 'react';
import { ScrapeContext } from './ScrapeContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DataTable() {
  const { scrapes, fetchMore, loading } = useContext(ScrapeContext);
  const rowClick = ({ jobUrl, location }) => {
    switch (location) {
      case 'Trivandrum':
        window.open('https://technopark.org/' + jobUrl, '_blank');
      case 'Kochi':
        window.open('http://infopark.in/' + jobUrl, '_blank');
      case 'Kozhikode':
        window.open(jobUrl, '_blank');
    }
  };
  return (
    <section class="section">
      <div class="container job-list">
        {scrapes && scrapes.length
          ? scrapes.map((row) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                class="box"
                key={row._id}
              >
                <div class="columns is-vcentered">
                  <div
                    class="column is-three-quarters is-clickable"
                    onClick={() => rowClick(row)}
                  >
                    <p class="is-size-7 has-margin-bottom-7">
                      {row.companyName}
                    </p>
                    <p class="is-size-5 is-capitalized job-title has-margin-bottom-7">
                      {row.jobTitle}
                    </p>
                    <span class="is-size-7">
                      <span class="icon is-small is-right">
                        <FontAwesomeIcon icon={['fas', 'map-marker-alt']} />
                      </span>
                      {row.location}
                    </span>
                  </div>
                  <div class="column centered">
                    <span class="is-size-6">
                      {row.jobDescription && row.jobDescription.postingDate
                        ? format(
                            new Date(row.jobDescription.postingDate),
                            'MMM dd'
                          )
                        : ''}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          : ''}
      </div>
      {scrapes === null ? (
        <div class="loader-container">
          <div class="lds-hourglass"></div>
        </div>
      ) : scrapes && scrapes.length === 0 ? (
        <div class="loader-container">We're sorry! No matching results 🙁</div>
      ) : (
        <div class="container has-text-centered has-margin-top-4">
          <button
            class={`button is-primary ${loading ? 'is-loading' : ''}`}
            onClick={() => fetchMore()}
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}
