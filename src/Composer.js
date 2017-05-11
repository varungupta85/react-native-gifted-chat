import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';

export default class Composer extends React.Component {
  componentDidMount() {
    if(this.props.initialChatText && this.props.initialChatText !== '') {
      this.props.onTextChanged(this.props.initialChatText)
    }
  }

  onContentSizeChange(e) {
    const contentSize = {
      height: e.nativeEvent.contentSize.height,
      width: e.nativeEvent.contentSize.width
    }
    this.contentSize = contentSize;
    this.props.onInputSizeChanged(this.contentSize);
  }

  onChangeText(text) {
    this.props.onTextChanged(text);
  }

  render() {
    return (
      <TextInput
        placeholder={this.props.placeholder}
        placeholderTextColor={this.props.placeholderTextColor}
        multiline={this.props.multiline}
        onChangeText={text => this.onChangeText(text)}
        onContentSizeChange={e => this.onContentSizeChange(e)}
        style={[styles.textInput, this.props.textInputStyle, {height: this.props.composerHeight}]}

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
  },
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
