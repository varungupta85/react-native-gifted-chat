import React from 'react'

import { View, FlatList } from 'react-native'

import shallowequal from 'shallowequal'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
import md5 from 'md5'
import LoadEarlier from './LoadEarlier'
import Message from './Message'
import PropTypes from 'prop-types'

export default class MessageContainer extends React.Component {
  prepareMessages = messages =>
    messages.map((m, i) => {
      const previousMessage = messages[i + 1] || {}
      const nextMessage = messages[i - 1] || {}
      // add next and previous messages to hash to ensure updates
      const toHash = JSON.stringify(m) + previousMessage._id + nextMessage._id
      return {
        ...m,
        previousMessage,
        nextMessage,
        hash: md5(toHash)
      }
    })

  state = {
    messagesData: this.prepareMessages(this.props.messages)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true
    }
    if (!shallowequal(this.state, nextState)) {
      return true
    }
    return false
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) {
      return
    }
    const messagesData = this.prepareMessages(nextProps.messages)
    this.setState({ messagesData })
  }

  renderFooter = () => {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props
      }
      return this.props.renderFooter(footerProps)
    }
    return null
  }

  renderLoadEarlier = () => {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props
      }
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps)
      }
      return <LoadEarlier {...loadEarlierProps} />
    }
    return null
  }

  scrollTo = options => {
    this.flatListRef.scrollToOffset(options)
  }

  renderRow = ({ item: message, index }) => {
    console.log('Received item ' + JSON.stringify(message))
    if (!message._id && message._id !== 0) {
      console.warn(
        'GiftedChat: `_id` is missing for message',
        JSON.stringify(message)
      )
    }
    if (!message.user) {
      console.warn(
        'GiftedChat: `user` is missing for message',
        JSON.stringify(message)
      )
      message.user = {}
    }

    const messageProps = {
      ...this.props,
      key: message._id,
      currentMessage: message,
      previousMessage: message.previousMessage,
      nextMessage: message.nextMessage,
      position: message.user._id === this.props.user._id ? 'right' : 'left'
    }

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps)
    }
    return <Message {...messageProps} />
  }

  keyExtractor = item => `${item._id}`

  render() {
    return (
      <FlatList
        ref={ref => (this.flatListRef = ref)}
        keyExtractor={this.keyExtractor}
        enableEmptySections
        automaticallyAdjustContentInsets={false}
        initialListSize={20}
        pageSize={20}
        {...this.props.listViewProps}
        data={this.state.messagesData}
        renderItem={this.renderRow}
        ListHeaderComponent={this.renderFooter}
        ListFooterComponent={this.renderLoadEarlier}
        inverted
      />
    )
  }
}

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  listViewProps: {},
  onLoadEarlier: () => {}
}

MessageContainer.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.object,
  renderFooter: PropTypes.func,
  renderMessage: PropTypes.func,
  onLoadEarlier: PropTypes.func,
  listViewProps: PropTypes.object
}
