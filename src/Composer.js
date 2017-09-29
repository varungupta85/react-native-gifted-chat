import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';

export default class Composer extends React.Component {
  state = {
    textInputHeight: this.props.initialChatText && this.props.initialChatText !== '' ? 100 : 40
  }

  componentDidMount() {
    if(this.props.initialChatText && this.props.initialChatText !== '') {
      this.props.onTextChanged(this.props.initialChatText)
    }
  }

  onChange(e) {
    this.setState({
      textInputHeight: e.nativeEvent.contentSize.height
    })
  }

  onContentSizeChange(e) {
    if(this.state.textInputHeight === undefined && this.props.initialChatText) {
      this.setState({
        textInputHeight: e.nativeEvent.contentSize.height
      })
    }
  }

  onChangeText(text) {
    this.props.onTextChanged(text);
  }

  // onContentSizeChange is called just once for Android, so we need to use onChange also
  // onChange is not called on initial render, so we need to use onContentSizeChange to 
  // set the height of the input correctly in case there was some unsent chat message
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
        onChangeText={text => this.onChangeText(text)}
        onChange={e => this.onChange(e)}
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
  onChange: React.PropTypes.func,
  composerHeight: React.PropTypes.number,
  text: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  placeholderTextColor: React.PropTypes.string,
  textInputProps: React.PropTypes.object,
  onTextChanged: React.PropTypes.func,
  onInputSizeChanged: React.PropTypes.func,
  multiline: React.PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
};
