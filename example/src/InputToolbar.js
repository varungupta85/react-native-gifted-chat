import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Composer from './Composer';
import Send from './Send';

export default class InputToolbar extends React.Component {
  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return <Send {...this.props}/>;
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }

    return (
      <Composer
        {...this.props}
      />
    );
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={[styles.container, this.props.inputToolbarContainerStyle]}>
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderComposer()}
          {this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: '#FFFFFF',
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
});

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderSend: null,
  renderComposer: null,
  inputToolbarContainerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
};

InputToolbar.propTypes = {
  renderAccessory: React.PropTypes.func,
  renderSend: React.PropTypes.func,
  renderComposer: React.PropTypes.func,
  inputToolbarContainerStyle: View.propTypes.style,
  primaryStyle: View.propTypes.style,
  accessoryStyle: View.propTypes.style,
};
