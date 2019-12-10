import React from 'react'
import { Platform, StyleSheet, View, Dimensions } from 'react-native'

import moment from 'moment'
import uuid from 'uuid'
import PropTypes from 'prop-types'

import * as utils from './utils'
import Avatar from './Avatar'
import Bubble from './Bubble'
import MessageImage from './MessageImage'
import MessageText from './MessageText'
import Composer from './Composer'
import Day from './Day'
import InputToolbar from './InputToolbar'
import LoadEarlier from './LoadEarlier'
import Message from './Message'
import MessageContainer from './MessageContainer'
import Send from './Send'
import Time from './Time'
import GiftedAvatar from './GiftedAvatar'
import KeyboardSpacer from 'react-native-keyboard-spacer'

const isIphoneX = () => {
  let dimen = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      (dimen.height === 896 || dimen.width === 896))
  )
}

class GiftedChat extends React.Component {
  constructor(props) {
    super(props)

    // default values
    this._isMounted = false
    this._keyboardHeight = 0
    this._bottomOffset = 0
    this._maxHeight = null
    this._isFirstLayout = true
    this._locale = 'en'
    this._messages = []

    this.state = {
      text: ''
    }

    this.onSend = this.onSend.bind(this)
    this.getLocale = this.getLocale.bind(this)
    this.onInputTextChanged = this.onInputTextChanged.bind(this)

    this.invertibleScrollViewProps = {
      inverted: true,
      keyboardShouldPersistTaps: this.props.keyboardShouldPersistTaps
    }
  }

  static append(currentMessages = [], messages) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    return messages.concat(currentMessages)
  }

  static prepend(currentMessages = [], messages) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    return currentMessages.concat(messages)
  }

  getChildContext() {
    return {
      getLocale: this.getLocale
    }
  }

  componentWillMount() {
    this.setIsMounted(true)
    this.initLocale()
    this.initMessages(this.props.messages)
  }

  componentWillUnmount() {
    this.setIsMounted(false)
  }

  componentWillReceiveProps(nextProps = {}) {
    this.initMessages(nextProps.messages)
  }

  initLocale() {
    if (
      this.props.locale === null ||
      moment.locales().indexOf(this.props.locale) === -1
    ) {
      this.setLocale('en')
    } else {
      this.setLocale(this.props.locale)
    }
  }

  initMessages(messages = []) {
    this.setMessages(messages)
  }

  setLocale(locale) {
    this._locale = locale
  }

  getLocale() {
    return this._locale
  }

  setMessages(messages) {
    this._messages = messages
  }

  getMessages() {
    return this._messages
  }

  setIsMounted(value) {
    this._isMounted = value
  }

  getIsMounted() {
    return this._isMounted
  }

  scrollToBottom(animated = true) {
    if (this._messageContainerRef === null) {
      return
    }
    this._messageContainerRef.scrollTo({
      offset: 0,
      animated
    })
  }

  renderMessages() {
    return (
      <View style={{ flex: 1 }}>
        <MessageContainer
          {...this.props}
          invertibleScrollViewProps={this.invertibleScrollViewProps}
          messages={this.getMessages()}
          ref={component => (this._messageContainerRef = component)}
        />
        {this.renderChatFooter()}
      </View>
    )
  }

  onSend(messages = [], shouldResetInputToolbar = false) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }

    messages = messages.map(message => {
      return {
        ...message,
        user: this.props.user,
        createdAt: new Date(),
        _id: this.props.messageIdGenerator()
      }
    })

    if (shouldResetInputToolbar === true) {
      this.resetInputToolbar()
    }

    this.props.onSend(messages)
    this.scrollToBottom()
  }

  resetInputToolbar() {
    if (this.textInput) {
      this.textInput.clear()
    }
    this.setState({
      text: ''
    })
  }

  onInputTextChanged(text) {
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged(text)
    }
    this.setState({ text })
  }

  renderInputToolbar() {
    const inputToolbarProps = {
      ...this.props,
      text: this.state.text,
      onSend: this.onSend,
      onTextChanged: this.onInputTextChanged,
      textInputProps: {
        ...this.props.textInputProps,
        ref: textInput => (this.textInput = textInput),
        maxLength: this.props.maxInputLength,
        initialChatText: this.props.initialChatText
      }
    }
    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar(inputToolbarProps)
    }
    return <InputToolbar {...inputToolbarProps} />
  }

  renderChatFooter() {
    if (this.props.renderChatFooter) {
      const footerProps = {
        ...this.props
      }
      return this.props.renderChatFooter(footerProps)
    }
    return null
  }

  render() {
    return (
      <View behavior="padding" style={styles.container}>
        {this.renderMessages()}
        {this.renderInputToolbar()}
        {Platform.OS === 'ios' && (
          <KeyboardSpacer topSpacing={isIphoneX() ? -34 : 0} />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

GiftedChat.childContextTypes = {
  getLocale: PropTypes.func
}

GiftedChat.defaultProps = {
  messages: [],
  onSend: () => {},
  loadEarlier: false,
  onLoadEarlier: () => {},
  locale: null,
  keyboardShouldPersistTaps: Platform.select({
    ios: 'never',
    android: 'always'
  }),
  renderAvatar: null,
  renderBubble: null,
  renderFooter: null,
  renderChatFooter: null,
  renderMessageText: null,
  renderMessageImage: null,
  renderComposer: null,
  renderCustomView: null,
  renderDay: null,
  renderInputToolbar: null,
  renderLoadEarlier: null,
  renderLoading: null,
  renderMessage: null,
  renderSend: null,
  renderTime: null,
  user: {},
  bottomOffset: 0,
  isLoadingEarlier: false,
  messageIdGenerator: () => uuid.v4(),
  maxInputLength: null
}

GiftedChat.propTypes = {
  messages: PropTypes.array,
  onSend: PropTypes.func,
  onInputTextChanged: PropTypes.func,
  loadEarlier: PropTypes.bool,
  onLoadEarlier: PropTypes.func,
  locale: PropTypes.string,
  initialChatText: PropTypes.string,
  renderAvatar: PropTypes.func,
  renderBubble: PropTypes.func,
  renderFooter: PropTypes.func,
  renderChatFooter: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderComposer: PropTypes.func,
  renderCustomView: PropTypes.func,
  renderDay: PropTypes.func,
  renderInputToolbar: PropTypes.func,
  renderLoadEarlier: PropTypes.func,
  renderLoading: PropTypes.func,
  renderMessage: PropTypes.func,
  renderSend: PropTypes.func,
  renderTime: PropTypes.func,
  user: PropTypes.object,
  textInputProps: PropTypes.object,
  bottomOffset: PropTypes.number,
  maxInputLength: PropTypes.number,
  isLoadingEarlier: PropTypes.bool,
  messageIdGenerator: PropTypes.func,
  keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled'])
}

export {
  GiftedChat,
  Avatar,
  Bubble,
  MessageImage,
  MessageText,
  Composer,
  Day,
  InputToolbar,
  LoadEarlier,
  Message,
  MessageContainer,
  Send,
  Time,
  GiftedAvatar,
  utils
}
