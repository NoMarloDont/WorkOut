import React, {useEffect, useState} from 'react';
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';
import Login from './components/Login';

export default function App(): React.ReactElement {

  return (
    <div>
      <Login />
    </div>
  );
}
