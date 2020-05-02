import { useContext } from 'react';
import { ScrapeContext } from './ScrapeContext';
import { formatDistance } from 'date-fns';

export default function DataTable() {
  const scrapeData = useContext(ScrapeContext);
  const rowClick = ({ jobUrl }) => {
    window.open('https://technopark.org/' + jobUrl, '_blank');
  };
  return (
    <section class="section">
      <div class="columns is-multiline container">
        {scrapeData.scrapes.map((row) => (
          <div class="column is-2" key={row.jobId}>
            <div class="card is-clickable" onClick={() => rowClick(row)}>
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="subtitle is-7">{row.companyName}</p>
                  </div>
                </div>
                <p class="subtitle">{row.jobTitle}</p>
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
    </section>
  );
}
