import { Popover } from 'antd';
import React from 'react';
import { TwitterPicker } from 'react-color';

import { COLOR_PICK_LIST } from '#assets/config/explore';

import './index.less';

interface IProps {
  children?: any;
  handleChangeColorComplete?: (color: string) => void;
  handleChange?: (color: string) => void;
}

interface IState {
  visible: boolean;
}

class ColorPicker extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleChange = color => {
    if (this.props.handleChange) {
      this.props.handleChange(color);
    }
  };

  handleChangeComplete = (color, _event) => {
    if (this.props.handleChangeColorComplete) {
      this.props.handleChangeColorComplete(color);
    }
  };

  render() {
    return (
      <Popover
        placement="bottom"
        overlayClassName="popover-color"
        content={
          <TwitterPicker
            width="240px"
            className="custom-picker"
            onChange={this.handleChange}
            onChangeComplete={this.handleChangeComplete}
            colors={COLOR_PICK_LIST}
            triangle="hide"
          />
        }
        trigger="click"
      >
        {this.props.children}
      </Popover>
    );
  }
}

export default ColorPicker;
