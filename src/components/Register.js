import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native'
import firebase from '../config/firebase'
import ChatStatusBar from './ChatStatusBar'
import {purple} from '../utils/constants'
import Main from './Main'

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
      errorMessage: null,
      loading: false,
      register: false
    };
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.getRef()
          .child("friends")
          .push({
            email: user.email,
            uid: user.uid,
            name: this.state.name
          });
        this.setState({
          loading: false,
          register: true
        })
      }
    });
  }

  getRef() {
    return firebase.database().ref()
  }

  onRegister() {
    this.setState({ errorMessage: null, loading: true });
    const { email, password, name } = this.state;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ errorMessage: error.message, loading: false });
      });
  }

  render() {
    return(
      <View style={styles.containerl}>
        {this.state.register && <Main />}
        {!this.state.register && (
          <View behavior="padding" style={styles.container}>
            <ChatStatusBar barStyle="light-content" backgroundColor={purple} />
            <KeyboardAvoidingView>
              <Text>Name</Text>
              <TextInput
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => this.emailInput.focus()}
              />
              <Text>Email</Text>
              <TextInput
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                style={styles.input}
                returnKeyType="next"
                ref={input => (this.emailInput = input)}
                onSubmitEditing={() => this.passwordCInput.focus()}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text>Password</Text>
              <TextInput
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                style={styles.input}
                secureTextEntry={true}
                ref={input => (this.passwordCInput = input)}
                onSubmitEditing={() => this.passwordInput.focus()}
                returnKeyType="next"
                secureTextEntry
              />
              <Text>Password Confirmation</Text>
              <TextInput
                value={this.state.password}
                onChangeText={password_confirmation =>
                  this.setState({ password_confirmation })}
                style={styles.input}
                secureTextEntry={true}
                returnKeyType="go"
                secureTextEntry
                ref={input => (this.passwordInput = input)}
              />
            </KeyboardAvoidingView>
            <TouchableHighlight
              onPress={this.onRegister.bind(this)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  containerl: {
    flex: 1,
    backgroundColor: "#16a085",
  },
  container: {
    flex: 1.2,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#16a085",
    padding: 20,
    paddingTop: 100
  },
  input: {
    height: 40,
    width: 350,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    paddingHorizontal: 10
  },
  button: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "stretch",
    marginTop: 10,
    justifyContent: "center",
    paddingVertical: 15,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 18,
    alignSelf: "center",
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700"
  },
})
