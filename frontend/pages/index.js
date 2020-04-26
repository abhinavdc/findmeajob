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
    <section>
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="https://bulma.io">
            <img
              src="https://bulma.io/images/bulma-logo.png"
              alt="Bulma: Free, open source, and modern CSS framework based on Flexbox"
              width="112"
              height="28"
            />
          </a>

          <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      </nav>
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
      <section class="section">
        <div class="columns is-multiline">
          <div class="column is-2">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-6">Carestack</p>
                  </div>
                </div>
                <p class="subtitle">Junior Software Engineer</p>
              </div>
              <footer class="card-footer">
                <div class="card-footer-item columns">
                  <div class="column">
                    <span class="is-size-7 has-text-grey-light has-text-left">
                      Trivandrum
                    </span>
                  </div>
                  <div class="column">
                    <span class="is-size-7 is-pulled-right has-text-info">
                      2 days ago
                    </span>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </section>

    // <Page>
    //   <Head>
    //     <title>Hello</title>
    //     <link
    //       rel="stylesheet"
    //       href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    //     />
    //     <link
    //       rel="stylesheet"
    //       href="https://fonts.googleapis.com/icon?family=Material+Icons"
    //     />
    //   </Head>
    //   <CssBaseline></CssBaseline>
    //   <div className={classes.main}>
    //     {/* <div className={classes.leftContainer}>
    //       <Subscribe />
    //     </div> */}
    //     <div className={classes.rightContainer}>
    //       <Search />
    //       <DataTable />
    //     </div>
    //   </div>
    // </Page>
  );
}
