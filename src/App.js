import React from 'react';
import { FormattedMessage, injectIntl, defineMessage } from 'react-intl';

function App({ intl, ...props }) {

  const message = defineMessage({
    id: 'user.location',
    description: 'Location',
    defaultMessage: 'My location is {place}',
  });

  return (
    <>
      <ol>
        <div>Types of Message declaration</div>
        <li>
          <h2>Using React API <code>{`<FormattedMessage/>`}</code></h2>
          <FormattedMessage
            id="user.userName"
            description="User name"
            defaultMessage="My name is {name}"
            values={{ name: 'Akash' }}
          />
        </li>
        <li>
        <h2>Using imperative API <code>intl.formatMessage</code></h2>
          {
            intl.formatMessage(
              {
                id: "user.designation",
                description: 'Designation',
                defaultMessage: 'My designation is {designation}',
              },
              {
                designation: 'Software Developer',
              }
            )
          }
        </li>
        <li>
          <h2>Pre-declaring using defineMessage for later consumption (less recommended)</h2>
          <FormattedMessage
            {...message}
            values={{
              place: 'India',
            }}
          />
        </li>
      </ol>
    </>
  );
}

export default injectIntl(App);
