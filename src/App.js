import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './components/Main'
import Login from './components/Login'
import firebase from './config/firebase'
import Register from './components/Register'


export default class App extends React.Component {
  state = {
    authenticated: false,
    loading: true,
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({loading: false, authenticated: true})
      } else {
        this.setState({loading: false, authenticated: false})
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.authenticated && <Login />}
        {this.state.authenticated && <Main />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
