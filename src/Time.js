import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes
} from 'react-native';

import moment from 'moment';
import PropTypes from 'prop-types'

export default class Time extends React.Component {
  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.timeContainerStyle[this.props.position]]}>
        <Text style={[styles[this.props.position].text, this.props.timeTextStyle[this.props.position]]}>
          {moment(this.props.currentMessage.createdAt).locale(this.context.getLocale()).format('LT')}
        </Text>
      </View>
    );
  }
}

const containerStyle = {
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 5,
};

const textStyle = {
  fontSize: 10,
  backgroundColor: 'transparent',
  textAlign: 'right',
};

const styles = {
  left: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: '#aaa',
      ...textStyle,
    },
  }),
  right: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: '#fff',
      ...textStyle,
    },
  }),
};

Time.contextTypes = {
  getLocale: PropTypes.func,
};

Time.defaultProps = {
  position: 'left',
  currentMessage: {
    createdAt: null,
  },
  timeContainerStyle: {},
  timeTextStyle: {},
};

Time.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  timeContainerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  timeTextStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
};
