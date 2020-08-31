import React from 'react';
import { hotjar } from 'react-hotjar';

export default class Layout extends React.Component {
  componentDidMount() {
    console.log(process.env);
    if (process.env.NODE_ENV === 'production') {
      hotjar.initialize(process.env.HOTJAR_ID, 6);
    }
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}
