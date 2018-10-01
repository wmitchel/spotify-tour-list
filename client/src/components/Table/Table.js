import React, { Component } from 'react'
import PropTypes from 'prop-types'

import HeaderRow from './HeaderRow';
import Row from './Row';

import './Table.css';

export class Table extends Component {
  static propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
  };

  renderRow = (row) => {
    return (
        <Row
            columns={this.props.columns}
            row={row}
        />
    )
  }

  render() {
    return (
        <table>
            <thead>
                <HeaderRow columns={this.props.columns} />
            </thead>
            <tbody>{this.props.rows.map(this.renderRow)}</tbody>
        </table>
    )
  }
}

export default Table
