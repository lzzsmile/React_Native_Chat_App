import React, {Component} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ListView } from 'react-native'
import Chat from './Chat'
import firebase from '../config/firebase'
import {Colors} from '../utils/Shared'

export default class Contacts extends Component {

  state = {
    name: '',
    uid: null,
    email: '',
    dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
    loading: true,
  }

  listenForItems() {
    const user = firebase.auth().currentUser
    const friendsRef = this.getRef().child("friends")
    friendsRef.on('value', (snap) => {
      const items = []
      snap.forEach((child) => {
        items.push({
          name: child.val().name,
          uid: child.val().uid,
          email: child.val().email
        })

      })
      const filterItems = items.filter(item => item.email != user.email)
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(filterItems),
        loading: false
      })
    })

  }

  getRef() {
    return firebase.database().ref();
  }

  componentDidMount() {
        this.listenForItems();
  }

  renderRow = rowData => {
    return (
      <View style={styles.profileContainer}>
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate(
              'Chat', {name: rowData.name, uid: rowData.uid, email: rowData.email}
            )}>
          <Text style={styles.profileName}>{rowData.name}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    marginRight: 10,
    marginLeft: 10
  },
  profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 6,
        marginBottom: 8,
        padding: 25,
        backgroundColor: Colors.grayColor
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 6
    },
    profileName: {
        marginLeft: 6,
        fontSize: 26
    }
});
