import React, {Component} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import firebase from '../config/firebase'
import Login from './Login'
import {Colors} from '../utils/Shared'
import TextField from './TextField'

export default class Profile extends Component {

  state = {
    logout: false,
    name: '',
    email: '',
    newpassword: '',
    newname: '',
  }

  onLogout() {
    firebase.auth().signOut()
      .then(() => {
        this.props.navigation.navigate("Login")
      })
  }

  onResetPassword() {
    const user = firebase.auth().currentUser
    if (this.state.newpassword) {
      user.updatePassword(this.state.newpassword).then(() => {
        this.setState({newpassword: ''})
        this.onLogout()
      })
    }
  }

  onResetName() {
    if (this.state.newname) {
      this.setState({
        name: this.state.newname
      })
      const newName = this.state.newname
      const items = []
      const user = firebase.auth().currentUser
      const friendsRef = this.getRef().child("friends")
      friendsRef.once('value', (snap) => {
        snap.forEach((child) => {
          items.push({
            name: child.val().name,
            uid: child.val().uid,
            email: child.val().email
          })
        })
      })
      items.forEach(child => {
        if (child.email === user.email) {
          child.name = newName
        }
      })
      friendsRef.remove().then(() => console.log("Remove all the friends"))
      items.forEach(child => {
        friendsRef.push({
          name: child.name,
          uid: child.uid,
          email: child.email
        })
      })
    }
    this.setState({
      newname: ''
    })
  }

  loginInfo() {
    const user = firebase.auth().currentUser
    const friendsRef = this.getRef().child("friends")
    friendsRef.once('value', (snap) => {
      snap.forEach((child) => {
        if (child.val().email === user.email) {
          this.setState({
            name: child.val().name,
            email: user.email
          })
        }
      })
    })
  }

  getRef() {
    return firebase.database().ref();
  }

  componentDidMount() {
    this.loginInfo()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>Email: </Text>
          <Text style={styles.profileText}>{this.state.email}</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>Name: </Text>
          <Text style={styles.profileText}>{this.state.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onLogout.bind(this)}
        >
          <Text style={styles.buttonText}>LOGOUT</Text>
        </TouchableOpacity>
        <TextField placeholder="Enter Your New Name"
          value={this.state.newname}
          onChangeText={newname => this.setState({ newname }) } />
        <TouchableOpacity
          style={styles.buttonReset}
          onPress={this.onResetName.bind(this)}
        >
          <Text style={styles.buttonText}>RESET NAME</Text>
        </TouchableOpacity>
        <TextField placeholder="Enter New Password"
          value={this.state.newpassword}
          onChangeText={newpassword => this.setState({ newpassword }) } />
        <TouchableOpacity
          style={styles.buttonReset}
          onPress={this.onResetPassword.bind(this)}
        >
          <Text style={styles.buttonText}>RESET PASSWORD</Text>
        </TouchableOpacity>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 15
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700"
  },
  button: {
    backgroundColor: "#27ae60",
    paddingVertical: 15,
    marginTop: 20,
    marginLeft: 100,
    marginRight: 100,
    marginBottom: 40,
  },
  buttonReset: {
    backgroundColor: "#27ae60",
    padding: 15,
    marginTop: 20,
    marginLeft: 180,
    marginRight: 6,
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 6,
    marginRight: 6,
    marginBottom: 8,
    padding: 25,
    backgroundColor: Colors.grayColor
  },
  profileText: {
    marginLeft: 6,
    fontSize: 20
  }
});
