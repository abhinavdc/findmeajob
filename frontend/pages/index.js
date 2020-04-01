import Page from '../components/Page';
import Data from '../components/Data';
import Navbar from '../components/Navbar';
import Head from 'next/head';

const Index = () => (
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
    <Navbar></Navbar>
    <h1>Find Me A Job</h1>
    <Data />
  </Page>
);

export default Index;
