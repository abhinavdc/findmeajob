import 'react-bulma-components/dist/react-bulma-components.min.css';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {
  faSearch,
  faPaperPlane,
  faEnvelope,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import '../style.css';
require('react-github-button/assets/style.css');

config.autoAddCss = false;
library.add(faSearch, faPaperPlane, faEnvelope, faMapMarkerAlt);

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
