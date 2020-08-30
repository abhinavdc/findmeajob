import Page from '../components/Page';
import DataTable from '../components/DataTable';
import Navbar from '../components/Navbar';
import Search from '../components/Search';

export default function Index() {
  return (
    <Page>
      <Navbar />
      <Search />
      <DataTable />
    </Page>
  );
}
