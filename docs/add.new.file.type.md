# Adding support for a new file type

Repo supervisor scans only files with whitelisted file extensions in the configuration file. If a directory contains files with extensions that are not defined in a whitelist, it will not scan these files. Therefore it will not detect any secrets in this directory.

To add support for a new file extension you need to:

- Add a new file extension to the "config/main.json" file in the "pullRequests.allowedActions" path. It's an array.
- Define filters for this specific file in the "config/filters.json"
- Create a new tokenizer to help Repo supervisor understand how to parse a new file type

## Whitelist a new file extension

Config file: `config/main.json`

```json
  "pullRequests": {
    "allowedActions": ["opened", "reopened", "synchronize"],
    "allowedExtensions": [".js", ".json", ".exe"],
    "excludedPaths": ["^test"],
    "updateGithubStatus": true
  }
```

New file extension (.exe) was added to a whitelist.

## Define a new filter

Config file: `config/filters.json`

```json
  {
    "ext": [".exe"],
    "filters": ["entropy.meter/index.js"],
    "parser": {
      "module": "tokenizer/exe/index.js",
      "config": {}
    }
  }
```

_"config" section is used to pass a custom configuration to a tokenizer/linter. It's specific to the underlaying library._

It would enable entropy meter for this specific file extension as well as use a new tokenizer located in the `tokenizer/exe/` directory.

## Add a new tokenizer

Tokenization is a part of the [Lexical Analysis](https://en.wikipedia.org/wiki/Lexical_analysis) process. It allows a parser to understand how to scan a specific file, extract information from that file, and convert that into a sequence of tokens. As the next step extracted tokens are analyzed by the parser, in our case, it analyzes strings that were found in a file.

### Why do we need tokenization?

Tokenization allows extracting a piece of specific information we are looking for without introducing noise or false positives. Imagine extracting strings from a javascript file using regular expressions. There is a high probability that it would return not only strings but also additional data. Using tokenization, we can ensure that we receive only strings without other parts of the language syntax like variable names, functions, or objects. It understands the specific language syntax or file format and returns only the information we asked for.

### Tokenizer

To add a new tokenizer for ".exe" file extension, it would require to:

- Find a library that understands the syntax of a new file type you want to add. It might be a linter or tokenizer library.
- If the library requires a configuration, ensure it's set up correctly. Therefore, configuration changes should be extracted into a "config" section in the `config/filters.json` file.
- Tokenizer should export a single function that accepts two arguments. The first one is content or code, and it's the content of the whole file. The second parameter is a custom config object defined in the previously mentioned file.

Tokenizer pseudocode:

```js
const exeLib = require('library_to_parse_exe_file');

module.exports = (content, config) => {
  const exe = exeLib.parse(content);

  return exeLib.extractStrings(exe);
};

```

Examples of tokenizers:

- [JavaScript](/src/parser/tokenizer/js/index.js)
- [JSON](/src/parser/tokenizer/json/index.js)
