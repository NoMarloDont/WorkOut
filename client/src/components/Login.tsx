import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
} from 'react-google-login';
import {Styles} from '../types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core';

library.add(fab);

export default function Login(): React.ReactElement {
  const [text, setText] = useState<string>();
  const [response, setResponse] = useState<GoogleLoginResponse>();

  const onSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log(response);
    if (!('code' in response)) {
      setResponse(response);
    }
  };

  const {signIn} = useGoogleLogin({
    onSuccess,
    isSignedIn: true,
    accessType: 'Offline',
    clientId: '812267761968-lvohpt9e9uiudh8s0r9s8n6gciqjqrr5.apps.googleusercontent.com',
  });

  useEffect(() => {
    Axios.get<string>('http://localhost:8000')
      .then((response) => setText(response.data))
      .catch((error) => {
        setText(JSON.stringify(error));
        console.error(error);
      });
  });

  const styles: Styles = {
    loginContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    loginHeader: {},
    loginText: {},
  };

  return (
    <div style={styles.loginContainer}>
      <h1>Welcome to WorkOut</h1>
      <h3>Sign In With Google</h3>
      {/* <GoogleLogin
        clientId="812267761968-lvohpt9e9uiudh8s0r9s8n6gciqjqrr5.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      /> */}
      <button onClick={signIn}>
        <FontAwesomeIcon icon={['fab', 'google']} />
        <span className="buttonText"> Sign in with Google</span>
      </button>
    </div>
  );
}
