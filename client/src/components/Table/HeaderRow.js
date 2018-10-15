import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class HeaderRow extends PureComponent {
  static propTypes = {
    columns: PropTypes.array.isRequired
  };

  renderHeaderCell = column => {
    return <th key={column.key}>{column.name}</th>;
  };

  render() {
    return <tr>{this.props.columns.map(this.renderHeaderCell)}</tr>;
  }
}
