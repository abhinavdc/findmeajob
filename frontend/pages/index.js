import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Page from '../components/Page';
import DataTable from '../components/DataTable';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Head from 'next/head';
import Subscribe from '../components/Subscribe';

const useStyles = makeStyles({
  main: {
    display: 'flex',
    'flex-wrap': 'wrap',
    height: '100vh'
  },
  leftContainer: {
    width: '50vw',
    padding: 10
  },
  rightContainer: {
    width: '50vw',
    padding: 30,
    background: 'linear-gradient(to right, #5691c8, #457fca)'
  }
});

export default function Index() {
  const classes = useStyles();

  return (
    <Page>
      <Head>
        <title>Hello</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <CssBaseline></CssBaseline>
      <div className={classes.main}>
        <div className={classes.leftContainer}>
          <Subscribe />
        </div>
        <div className={classes.rightContainer}>
          <Search />
          <DataTable />
        </div>
      </div>
    </Page>
  );
}
