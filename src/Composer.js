import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types'

export default class Composer extends React.Component {
  state = {
    textInputHeight: 40
  }

  componentDidMount() {
    if(this.props.initialChatText && this.props.initialChatText !== '') {
      this.props.onTextChanged(this.props.initialChatText)
    }
  }

  onContentSizeChange = (e) => {
      this.setState({
        textInputHeight: e.nativeEvent.contentSize.height
      })
  }

  onChangeText = (text) => {
    this.props.onTextChanged(text);
  }

  render() {
    const osSpecificStyles = Platform.select({
      android: {
        height: this.state.textInputHeight + (Platform.Version === 21 ? 10 : 0)
      }
    })

    return (
      <TextInput
        ref={component => this.textInput = component}
        placeholder={this.props.placeholder}
        placeholderTextColor={this.props.placeholderTextColor}
        multiline={this.props.multiline}
        onChangeText={this.onChangeText}
        onContentSizeChange={this.onContentSizeChange}
        style={[styles.textInput, this.props.textInputStyle, osSpecificStyles]}
        value={this.props.text}
        accessibilityLabel={this.props.text || this.props.placeholder}
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
        {...this.props.textInputProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    marginTop: Platform.select({
      ios: 6,
      android: 0,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
    maxHeight: 100
  }
});

Composer.defaultProps = {
  onChange: () => {
  },
  composerHeight: Platform.select({
    ios: 33,
    android: 41,
  }), // TODO SHARE with GiftedChat.js and tests
  text: '',
  placeholder: 'Type a message...',
  placeholderTextColor: '#b2b2b2',
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
  onTextChanged: () => {
  },
  onInputSizeChanged: () => {
  },
};

Composer.propTypes = {
  onChange: PropTypes.func,
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
  initialChatText: PropTypes.string
};
