import React from 'react';
import {FormattedMessage} from 'react-intl';

function App() {
  return (
      <div>
        <FormattedMessage
          id="userName"
          description="User name"
          defaultMessage="My name is {name}"
          values={{name: 'Akash'}}
        />
      </div>
  );
}

export default App;
