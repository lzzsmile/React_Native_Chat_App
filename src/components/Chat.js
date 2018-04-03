import React, {Component} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {GiftedChat} from 'react-native-gifted-chat'
import firebase from '../config/firebase'
import {Colors} from '../utils/Shared'
import TextField from './TextField'
import Button from './Button'

export default class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      city: ''
    };

    this.user = firebase.auth().currentUser

    const { params } = this.props.navigation.state;
    uid = params.uid;
    name = params.name;
    email = params.email;

    this.chatRef = this.getRef().child("chat/" + this.generateChatId());
    this.chatRefData = this.chatRef.orderByChild("order");
    this.onSend = this.onSend.bind(this);
  }

  generateChatId() {

    if (this.user.uid > uid) return `${this.user.uid}-${uid}`;
    else return `${uid}-${this.user.uid}`;
  }

  getRef() {
    return firebase.database().ref();
  }

  listenForItems(chatRef) {
    chatRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        items.push({
          _id: child.val().createdAt,
          text: child.val().text,
          createdAt: new Date(child.val().createdAt),
          user: {
            _id: child.val().uid
          }
        });
      });

      this.setState({
        loading: false,
        messages: items
      });
    });
  }

  componentDidMount() {
    this.listenForItems(this.chatRefData);

    fetch('https://freegeoip.net/json/')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          city: responseJson.city
        })
      })
      .catch((error) => {
        console.error(error)
      })

  }

  componentWillUnmount() {
    this.chatRefData.off()
  }

  onSend(messages = []) {
    messages.forEach(message => {
        const now = new Date().getTime()
        this.chatRef.push({
            _id: now,
            text: `${message.text} -${this.state.city}`,
            createdAt: now,
            uid: this.user.uid,
            order: -1 * now
        })
    })
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}
        user={{
          _id: this.user.uid,
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
