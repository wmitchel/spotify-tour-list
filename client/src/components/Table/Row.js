import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Cell from "./Cell";

export default class Row extends PureComponent {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    row: PropTypes.object.isRequired
  };

  renderCell = column => {
    return <Cell isImage={column.isImage} value={this.props.row[column.key]} />;
  };

  render() {
    return <tr>{this.props.columns.map(this.renderCell)}</tr>;
  }
}
