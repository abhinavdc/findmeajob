import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Page from '../components/Page';
import DataTable from '../components/DataTable';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Head from 'next/head';
import Subscribe from '../components/Subscribe';
import { Button } from 'react-bulma-components';

const useStyles = makeStyles({
  main: {
    display: 'flex',
    'flex-wrap': 'wrap',
    height: '100vh',
  },
  leftContainer: {
    width: '50vw',
    padding: 10,
  },
  rightContainer: {
    width: '100vw',
    padding: 30,
    background: 'linear-gradient(to right, #5691c8, #457fca)',
  },
});

export default function Index() {
  const classes = useStyles();
  return (
    <Page>
      <section>
        <section class="hero is-info is-bold">
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
                    />
                    <span class="icon is-medium is-right">
                      <i class="fa fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <DataTable />
    </Page>
  );
}
