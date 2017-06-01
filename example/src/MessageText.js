import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ParsedText from 'react-native-parsed-text';
import GiftedAvatar from './GiftedAvatar'
import {isSameUser, isSameDay} from "./utils";

export default class MessageText extends React.Component {
  
  renderUsername() {
    if (this.props.renderUsername) {
      const {renderUsername, ...usernameProps} = this.props;
      return this.props.renderUsername(usernameProps);
    }
    return (
      <Text style={[styles[this.props.position].usernameStyle,
        {color: GiftedAvatar.getColor(this.props.currentMessage.user.name)},
        this.props.usernameStyle]}>
        {this.props.currentMessage.user.name}
      </Text>
    );
  }

  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.messageTextContainerStyle[this.props.position]]}>
        {(!isSameUser(this.props.currentMessage, this.props.previousMessage) || !isSameDay(this.props.currentMessage, this.props.previousMessage))
          && (this.props.renderUsername !== null) && this.props.position === 'left' ? 
          this.renderUsername() : null
        }
        <ParsedText
          style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}
          {...this.props.textMessageProps}
        >
          {this.props.currentMessage.text}
        </ParsedText>
      </View>
    );
  }
}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {
    },
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
    usernameStyle: {
      marginLeft: 5,
      marginRight: 5,
      marginTop: 5,
      backgroundColor: 'transparent',
      lineHeight: 12, 
      fontSize: 10, 
      fontWeight: '700'
    }
  }),
  right: StyleSheet.create({
    container: {
    },
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

MessageText.defaultProps = {
  position: 'left',
  currentMessage: {
    text: '',
  },
  messageTextContainerStyle: {},
  textStyle: {},
  linkStyle: {},
  usernameStyle: {},
  textMessageProps: {}
};

MessageText.propTypes = {
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  messageTextContainerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
  textStyle: React.PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  linkStyle: React.PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
};
