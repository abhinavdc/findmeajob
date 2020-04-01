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
  table: {
    minWidth: 650
  },
  box: {
    padding: 20
  },
  container: {
    maxHeight: '80vh'
  },
  row: {
    cursor: 'pointer'
  }
});

export default function Data() {
  const scrapeData = useContext(ScrapeContext);
  console.log(scrapeData);
  const classes = useStyles();
  const rowClick = ({ jobUrl }) => {
    window.open('https://technopark.org/' + jobUrl, '_blank');
  };
  return (
    <div>
      <div className={classes.box}>
        <TableContainer component={Paper} className={classes.container}>
          <Table
            stickyHeader
            className={classes.table}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>JobID</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Posted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scrapeData.scrapes.map(row => (
                <TableRow
                  hover
                  key={row.jobId}
                  onClick={() => rowClick(row)}
                  className={classes.row}
                >
                  <TableCell component="th" scope="row">
                    {row.jobId}
                  </TableCell>
                  <TableCell>{row.jobTitle}</TableCell>
                  <TableCell>{row.companyName}</TableCell>
                  <TableCell>
                    {formatDistance(
                      new Date(
                        `${row.jobDescription.postingDate.split('/')[1]}/
                          ${row.jobDescription.postingDate.split('/')[0]}/
                          ${row.jobDescription.postingDate.split('/')[2]}`
                      ),
                      new Date()
                    )}{' '}
                    ago
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
