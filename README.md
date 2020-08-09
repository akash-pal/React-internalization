## React Internalization 

The ability to use a system across different locals based on the region.

According to [W3C](https://www.w3.org/International/questions/qa-i18n):

>**Internalization** is the design and development of a product, application or document content that enables easy **localization** for target audiences that vary in culture, region or language. 

>Internationalization is often written in English as **i18n**, where 18 is the number of letters between i and n in the English word.

>Localization is sometimes written in English as **l10n**, where 10 is the number of letters in the English word between l and n

```
    const now = new Date();
    <span>{now}</span>

    //Internalization
    <span>{formatDate(now)}</span>

    //Localization
    const dateFormats = {
        cs: 'YYYY-MM-DD',
        en: 'YYYY-DD-MM'
    }
    <span>{formatDate(now, dateFormats['cs']}</span>
```

### Translation using React-intl

Translations work with plain text only not code.
So the translations with variables needs to be formatted and split into String template and runtime data.

`<span>Hello {name}</span>`

The String template goes to translator and runtime data remains in code. This is achieved by the Standard ICU (International Components For Unicode) Message Format.


## Types of formatting

1. Variables:

    Hello {name}<br/>
    Hello John

2. Date/Number formatting:

   Today is {now, date}<br/>
   Today is 9th August 2020

3. Formatting Options:

    Interest rate is {rate, number, percent}<br/>
    Interest rate is 5%

4. Pluralization:
    
    {count, plural, one {# book} other {# books}}<br/>
    1 book, 2 books

## Steps in translation

1. Message Declaration
2. Message Extraction
3. Make Catalog
4. Compiling Messages
5. Message Distribution 


## Message Declaration

**There are three ways to declare messages:**

1. Using imperative API `intl.formatMessage`

    ```
    // Method must be exactly `intl.formatMessage`
    intl.formatMessage(
    {
        description: 'A message', // Description should be a string literal
        defaultMessage: 'My name is {name}', // Message should be a string literal
    },
    {
        name: userName,
    } // Values should be an object literal, but not necessarily every value inside
    );
    ```

2. Using React API `<FormattedMessage/>`

    ```
    import {FormattedMessage} from 'react-intl';
    <FormattedMessage
        description="A message" // Description should be a string literal
        defaultMessage="My name is {name}" // Message should be a string literal
        values={
            {
            name: userName,
            } // Values should be an object literal, but not necessarily every value inside
        }
    />;
    ```

3. Pre-declaring using `defineMessage` for later consumption (less recommended)

    ```
    import {defineMessage} from 'react-intl';
    const message = defineMessage({
        description: 'A message', // Description should be a string literal
        defaultMessage: 'My name is {name}', // Message should be a string literal
    });

    intl.formatMessage(message, {name: 'John'}); // My name is John

    <FormattedMessage
        {...message}
        values={{
            name: 'John',
        }}
    />; // My name is John
    ```


## Message Extraction

**It is the process of extracting all messages that have een declared into a single json file.**

For the purpose of extracting the messages there are two options:

1. [Formatjs ](https://formatjs.io/docs/getting-started/message-extraction).

    **Installation**

    `npm install formatjs`

    **Usage**

    Add the below script to `package.json`

    ```
    {
        "scripts": {
            "extract-messages": "formatjs extract \"src/**/*.js*\" --out-file src/lang/en.json --id-interpolation-pattern '[sha512:contenthash:base64:6]'",
        }
    }
    ```

    `--out-file [path]`<br/>
    The target file path where the plugin will output an aggregated .json file of all the translations from the files supplied. This flag will ignore --messages-dir

    It extracts the messages to `lang` folder inside the `src` folder.

    `--id-interpolation-pattern [pattern]`<br/>
    If certain message descriptors don't have id, this pattern will be used to automatically generate IDs for them. Default to [contenthash:5]. 


    **Example output:**

    ```
    {
        "userName": {
            "defaultMessage": "My name is {name}",
            "description": "User name"
        }
    }
    ```

2. [babel-plugin-react-intl](https://formatjs.io/docs/tooling/babel-plugin)

    **Installation**

    `npm install babel-plugin-react-intl`

    **Usage**

    Create a `.babelrc` file with the below content:

    ```
    {
        "presets": ["react-app"],
        "plugins": [
            [ "react-intl", {
                "messagesDir": "./build/messages",
                "extractSourceLocation": true
            }]
        ]
    }
    ```

    Add the below script to `package.json`

    ```
    "scripts": {
        "babel-extract-messages": "NODE_ENV=production babel ./src  --out-file /dev/null"    (Mac/Linux)
        "babel-extract-messages": "set NODE_ENV=production&& babel ./src >NUL"               (Windows)
    }
    ```

    **Example output:**

    ```
    [
        {
            "id": "userName",
            "description": "User name",
            "defaultMessage": "My name is {name}",
            "file": "src\\App.js",
            "start": {
                "line": 7,
                "column": 8
            },
            "end": {
                "line": 12,
                "column": 10
            }
        }
    ]
    ```



## Make Catalog

The extracted message from the previous step is sent to a TMS (Translation Management System) to generate different translated locals.

This can be achieved with any of the Translation Vendors.

**Example of `fr.json`**

```
{
  "userName": {
    "defaultMessage": "Mon nom est {name}",
    "description": "User name"
  }
}
```

## Compiling Messages

The translated messages are then process to react intl format.

**Installation**

`npm install formatjs`

**Usage**

Add the below script to `package.json`

```
{
    "scripts": {
        "compile-messages": "gulp compile-messages"
    }
}
```

The below command compiles a single file:
```
npm run compile -- lang/fr.json --ast --out-file compiled-lang/fr.json
```

The `gulpfile.js` compiles all the files from `lang` folder to `compiled-lang` folder.

```
gulp.task('compile-messages', async function () {
    const directoryPath = path.join(__dirname, sourcePath);
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            return gulp.src(path.join(sourcePath, file))
            .pipe(run(`formatjs compile ${sourcePath}/${file} --ast --out-file ${destPath}/${file}`))
        });
    });
});
```

**Compiled `fr.json`**
```
{
  "userName": [
    {
      "type": 0,
      "value": "Mon nom est "
    },
    {
      "type": 1,
      "value": "name"
    }
  ]
}
```

# Message Distribution 

Below is the projected structure followed:

```
projectRoot
|-- src
|   |-- App.js
|   |-- lang
|   |   |-- en-US.json
|   |   |-- fr.json
|   |-- compiled-lang
|   |   |-- en-US.json
|   |   |-- fr.json
|-- package.json
|-- .eslintrc.js
```

The current local is decided based on the browser locale:

```
const language = navigator.language.split(/[-_]/)[0];
// en
```

Dynamic import is used to load the specific compiled-lang file based on the language:

```
function loadLocaleData(locale) {
  switch (locale) {
    case 'fr':
      return import('./compiled-lang/fr.json');
    default:
      return import('./compiled-lang/en.json');
  }
}
```

