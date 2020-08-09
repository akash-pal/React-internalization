import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { IntlProvider } from "react-intl";

function loadLocaleData(locale) {
  switch (locale) {
    case 'fr':
      return import('./compiled-lang/fr.json');
    default:
      return import('./compiled-lang/en.json');
  }
}

//https://www.positronx.io/how-to-internationalize-i18n-react-app-with-react-intl-package/

function MainApp(props) {
  return (
    <IntlProvider
      locale={props.locale}
      defaultLocale="en"
      messages={props.messages}
    >
      <App />
    </IntlProvider>
  );
}

async function bootstrapApplication(locale, mainDiv) {
  const messages = await loadLocaleData(locale); 
  ReactDOM.render(
    <React.StrictMode>
      <MainApp locale={locale} messages={messages.default} />
    </React.StrictMode>,
    mainDiv);
}

const language = navigator.language.split(/[-_]/)[0];
bootstrapApplication(language , document.getElementById('root'))

serviceWorker.unregister();
