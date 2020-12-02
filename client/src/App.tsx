import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';

export default function App(): React.ReactElement {
  const [text, setText] = useState<string>();
  const [response, setResponse] = useState<GoogleLoginResponse>();

  useEffect(() => {
    Axios.get<string>('http://localhost:8000')
      .then((response) => setText(response.data))
      .catch((error) => {
        setText(JSON.stringify(error));
        console.error(error);
      });
  });

  const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log(response);
    if (!('code' in response)) {
      setResponse(response);
    }
  };

  return (
    <div>
      {text == null ? 'Loading' : text}
      <GoogleLogin
        clientId=""
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />

      {response ? `Logged In: ${response.getBasicProfile().getGivenName()}` : 'Not Logged In'}
    </div>
  );
}
