
# winston-wrapper

This is a "copy-and-use" sample to make you using `winston` easier.

## How to use?

- Add related packages to your package.json:
  
  Just copy this and append to your `dependencied` of `package.json`.
  
  ```text
        "@types/node": "^14.0.14",
        "@types/winston": "^2.4.4",
        "typescript": "^3.9.5",
        "winston": "^3.3.3",
        "winston-daily-rotate-file": "^4.5.0"
  ```

- If you are using TypeScript

  Great! just copy `log.ts` and `config.ts` to your project's directory.
  Here is the sample code:
  
  ```typescript
  import {getLogger} from './log';
  
  const log = getLogger('test');
  log.warn("this is a warning.");
  log.error(new Error("Here is a error."));
  log.info("Time to go.", "It's now", 12, "a.m.");
  ```

- If you are using JavaScript

  Compiled js files can be found in `./build`, you can copy these to .js files.
  But things may go wrong, I didn't test if it works using `require`.


