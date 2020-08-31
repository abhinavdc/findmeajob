import React from 'react';
import { hotjar } from 'react-hotjar';

const HOTJAR_ID = 1968258;
export default class Layout extends React.Component {
  componentDidMount() {
    hotjar.initialize(HOTJAR_ID, 6);
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}
