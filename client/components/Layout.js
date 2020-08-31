import React from 'react';
import { hotjar } from 'react-hotjar';
import Head from 'next/head';
import favicon from '../assets/favicon.ico';

const HOTJAR_ID = 1968258;
export default class Layout extends React.Component {
  componentDidMount() {
    hotjar.initialize(HOTJAR_ID, 6);
  }
  render() {
    return (
      <div>
        <Head>
          <link rel="shortcut icon" href={favicon} />
        </Head>
        <div>{this.props.children}</div>
      </div>
    );
  }
}
