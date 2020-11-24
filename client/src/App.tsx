import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import GoogleLogin from 'react-google-login';
import { useGoogleLogin } from 'react-google-login'

export default function App(): React.ReactElement {
  const [text, setText] = useState<string>();
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    Axios.get<string>('http://localhost:8000')
      .then((response) => setText(response.data))
      .catch((error) => {
        setText(JSON.stringify(error));
        console.error(error);
      });
  });

  const responseGoogle = (response) => {
    console.log(response);
    if(response.accessToken) {
        setAccessToken(response.accessToken);
    }
    console.log(accessToken);
  }

  return <div>
      {text == null ? 'Loading' : text}
      <GoogleLogin
    clientId=""
    buttonText="Login"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
  />
      </div>;
}
