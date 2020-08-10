import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { IntlProvider } from "react-intl";

const supportedLanguages = [{ locale: 'en', name: 'English' }, { locale: 'fr', name: 'French' }];

function loadLocaleData(locale) {
  switch (locale) {
    case 'fr':
      return import('./compiled-lang/fr.json');
    default:
      return import('./compiled-lang/en.json');
  }
}

function setLanguage(value) { bootstrapApplication(value) }

function MainApp(props) {
  return (
    <>
      <div className="heading">
        <h1>Select language</h1>
        <select value={props.locale} onChange={e => setLanguage(e.target.value)}>
          {
            supportedLanguages.map(item => <option key={item.locale} value={item.locale}>{item.name}</option>)
          }
        </select>
      </div>
      <IntlProvider
        locale={props.locale}
        defaultLocale="en"
        messages={props.messages}
      >
        <App supportedLanguages={supportedLanguages} />
      </IntlProvider>
    </>
  );
}

async function bootstrapApplication(locale, mainDiv) {
  const messages = await loadLocaleData(locale);
  ReactDOM.render(
    <React.StrictMode>
      <MainApp locale={locale} messages={messages.default} />
    </React.StrictMode>,
     document.getElementById('root'));
}

const language = navigator.language.split(/[-_]/)[0];
bootstrapApplication(language)

serviceWorker.unregister();
