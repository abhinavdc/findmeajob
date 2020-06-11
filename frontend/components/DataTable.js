import { useContext } from 'react';
import { ScrapeContext } from './ScrapeContext';
import { formatDistance } from 'date-fns';

export default function DataTable() {
  const { scrapes, fetchMore } = useContext(ScrapeContext);
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
      <div class="columns is-multiline container">
        {scrapes.map((row) => (
          <div class="column is-3" key={row.jobId}>
            <div class="card is-clickable" onClick={() => rowClick(row)}>
              <div class="card-image">
                <figure class="image is-4by3">
                  <img
                    class="has-padding-5"
                    src={row.companyLogoUrl}
                    alt="Placeholder image"
                  />
                </figure>
              </div>
              <div class="card-content">
                <div class="media">
                  {/* <div class="media-left">
                    <figure class="image is-48x48">
                      <img
                        src={
                          row.companyLogoUrl ||
                          'https://bulma.io/images/placeholders/96x96.png'
                        }
                        alt="Placeholder image"
                      />
                    </figure>
                  </div> */}
                  <div class="media-content">
                    <p class="subtitle is-7">{row.companyName}</p>
                  </div>
                </div>
                <p class="is-text-centered">{row.jobTitle}</p>
              </div>
              <footer class="card-footer">
                <div class="card-footer-item columns">
                  <div class="column">
                    <span class="is-size-7 has-text-grey-light has-text-left">
                      {row.location}
                    </span>
                  </div>
                  <div class="column">
                    <span class="is-size-7 is-pulled-right has-text-info">
                      {row.jobDescription && row.jobDescription.postingDate
                        ? formatDistance(
                            new Date(row.jobDescription.postingDate),
                            new Date()
                          )
                        : 'Few days'}{' '}
                      ago
                    </span>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        ))}
      </div>
      <div class="container has-text-centered">
        <button class="button is-primary" onClick={() => fetchMore()}>
          Load More
        </button>
      </div>
    </section>
  );
}
