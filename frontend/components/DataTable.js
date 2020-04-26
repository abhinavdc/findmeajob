import { useContext } from 'react';
import { ScrapeContext } from './ScrapeContext';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { formatDistance } from 'date-fns';

const useStyles = makeStyles({
  row: {
    cursor: 'pointer',
  },
  container: {
    maxHeight: '80vh',
  },
});

export default function DataTable() {
  const scrapeData = useContext(ScrapeContext);
  console.log(scrapeData);
  const classes = useStyles();
  const rowClick = ({ jobUrl }) => {
    window.open('https://technopark.org/' + jobUrl, '_blank');
  };
  return (
    <section class="section">
      <div class="columns is-multiline">
        {scrapeData.scrapes.map((row) => (
          <div class="column is-2">
            <div class="card is-clickable" onClick={() => rowClick(row)}>
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="subtitle is-6">{row.companyName}</p>
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
                      {formatDistance(
                        new Date(
                          `${row.jobDescription.postingDate.split('/')[1]}/
                          ${row.jobDescription.postingDate.split('/')[0]}/
                          ${row.jobDescription.postingDate.split('/')[2]}`
                        ),
                        new Date()
                      )}{' '}
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

    // {scrapeData.scrapes.map(row => (
    //   <TableRow
    //     hover
    //     key={row.jobId}
    //     onClick={() => rowClick(row)}
    //     className={classes.row}
    //   >
    //     <TableCell component="th" scope="row">
    //       {row.jobId}
    //     </TableCell>
    //     <TableCell>{row.jobTitle}</TableCell>
    //     <TableCell>{row.companyName}</TableCell>
    //     <TableCell>
    //       {formatDistance(
    //         new Date(
    //           `${row.jobDescription.postingDate.split('/')[1]}/
    //                 ${row.jobDescription.postingDate.split('/')[0]}/
    //                 ${row.jobDescription.postingDate.split('/')[2]}`
    //         ),
    //         new Date()
    //       )}{' '}
    //       ago
    //     </TableCell>
    //   </TableRow>
    // ))}
  );
}
