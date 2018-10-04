import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class Cell extends PureComponent {
  static propTypes = {
    value: PropTypes.any,
    isImage: PropTypes.bool.isRequired
  };

  render() {
    const { value, isImage } = this.props;

    if (isImage) {
      return (
        <td>
          <img src={value} />
        </td>
      );
    } else {
      return <td>{value}</td>;
    }
  }
}
