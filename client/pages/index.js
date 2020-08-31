import Page from '../components/Page';
import DataTable from '../components/DataTable';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Layout from '../components/Layout';

export default function Index() {
  return (
    <Layout>
      <Page>
        <Navbar />
        <Search />
        <DataTable />
      </Page>
    </Layout>
  );
}
