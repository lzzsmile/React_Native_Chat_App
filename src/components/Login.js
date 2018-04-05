import React, {Component} from 'react'
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native'
import ChatStatusBar from './ChatStatusBar'
import {purple} from '../utils/constants'
import Main from './Main'
import firebase from '../config/firebase'
import Register from './Register'
import TextField from './TextField'
import Button from './Button'


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
      errorMessage: null,
      ready: false,
      signup: false
    };
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          loading: false,
          ready: true
        });
      }
    });
  }



  getRef() {
    return firebase.database().ref()
  }

  onSubmit() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({loading: false})
      })
      .catch(error => {
        this.setState({
          errorMessage: error.message,
          loading: false
        });
      })
  }

  onSignup() {
    this.setState({signup: true})
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.signup && <Register />}
        {!this.state.signup && (
          <View style={styles.container}>
            {this.state.ready && <Main />}
            {!this.state.ready && (
              <View style={styles.container}>
                <ChatStatusBar backgroundColor={purple} barStyle="light-content" />
                <View behavior="padding" style={styles.container}>
                  <KeyboardAvoidingView style={styles.keyboard}>
                    <TextField placeholder="Email"
                      value={this.state.email}
                      onChangeText={email => this.setState({ email }) } />
                    <TextField placeholder="Password" secureTextEntry
                      value={this.state.password}
                      onChangeText={password => this.setState({ password }) } />
                    <Button primary onPress={this.onSubmit.bind(this)}>Login</Button>
                  </KeyboardAvoidingView>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#ddeeff'
  },
  keyboard: {
    margin: 20,
    padding: 20,
    alignSelf: "stretch"
  },
  buttonContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 15,
    margin: 15
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700"
  },
})
