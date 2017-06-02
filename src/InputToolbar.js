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

  render() {
    return (
      <View style={[styles.container, this.props.inputToolbarContainerStyle]}>
        {this.renderComposer()}
        {this.renderSend()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: '#FFFF00',
    flexDirection: 'row',
    alignItems: 'flex-end',
  }
});

InputToolbar.defaultProps = {
  renderSend: null,
  renderComposer: null,
  inputToolbarContainerStyle: {},
};

InputToolbar.propTypes = {
  renderSend: React.PropTypes.func,
  renderComposer: React.PropTypes.func,
  inputToolbarContainerStyle: View.propTypes.style,
};
