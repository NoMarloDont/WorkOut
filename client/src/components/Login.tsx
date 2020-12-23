import React, {useState} from 'react';
import Axios from 'axios';
import {GoogleLoginResponse, GoogleLoginResponseOffline, useGoogleLogin} from 'react-google-login';
import {Styles} from '../types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core';

const CLIENT_ID = '812267761968-lvohpt9e9uiudh8s0r9s8n6gciqjqrr5.apps.googleusercontent.com';
const API_URL = 'http://localhost:8000';

library.add(fab);

export default function Login(): React.ReactElement {
  const [sub, setSub] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (!('code' in response)) {
      const {accessToken, tokenId} = response;
      Axios.post<string>(API_URL + '/auth', {accessToken, idToken: tokenId}).then(() =>
        setAccessToken(accessToken),
      );
    }
  };

  const {signIn} = useGoogleLogin({
    onSuccess,
    accessType: 'Offline',
    clientId: CLIENT_ID,
  });

  function sayHello() {
    Axios.get<string>(API_URL + '/sub', {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((response) => setSub(response.data))
      .catch((err) => console.error('Failed to say hello', err));
  }

  return accessToken == null ? (
    <div style={styles.loginContainer}>
      <h1>Welcome to WorkOut</h1>
      <h3>Sign In With Google</h3>
      <button onClick={signIn}>
        <FontAwesomeIcon icon={['fab', 'google']} />
        <span className="buttonText"> Sign in with Google</span>
      </button>
    </div>
  ) : (
    <div>
      <button onClick={sayHello}>Say Hello</button>
      {sub && <div>{`Server Says: "Hello Gooogle User, ${sub}"`}</div>}
    </div>
  );
}

const styles: Styles = {
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loginHeader: {},
  loginText: {},
};
