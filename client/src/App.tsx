import React, {useEffect, useState} from 'react';
import Axios from 'axios';

export default function App(): React.ReactElement {
  const [text, setText] = useState<string>();

  useEffect(() => {
    Axios.get<string>('http://localhost:8000')
      .then((response) => setText(response.data))
      .catch((error) => {
        setText(JSON.stringify(error));
        console.error(error);
      });
  });

  return <div>{text == null ? 'Loading' : text}</div>;
}
