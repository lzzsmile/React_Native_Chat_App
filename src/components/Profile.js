import React, {Component} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import firebase from '../config/firebase'
import Login from './Login'
import {Colors} from '../utils/Shared'

export default class Profile extends Component {

  state = {
    logout: false,
    name: '',
    email: ''
  }

  onLogout() {
    firebase.auth().signOut()
      .then(() => {
        this.props.navigation.navigate("Login")
      })
  }

  onReset() {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => {
        this.setState({ loading: false });
        this.onLogout()
      })
      .catch(error => {
        this.setState({
          errorMessage: error.message,
          loading: false
        });
      });
  }

  loginInfo() {
    const user = firebase.auth().currentUser
    this.setState({
      name: user.email.split("@")[0],
      email: user.email
    })
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
        <TouchableOpacity
          style={styles.button}
          onPress={this.onReset.bind(this)}
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
    margin: 60
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
  profileText: {
    marginLeft: 6,
    fontSize: 20
  }
});
