const core = require('@actions/core');

const Output = class Output {
  static info(text, isReturn = false) {
    if (isReturn) {
      return text;
    }
    core.info(text);
  }

  static success(text, isReturn = false) {
    const result = `\u001b[32m${text}`;
    if (isReturn) {
      return result;
    }
    core.info(result);
  }

  static warn(text, isReturn = false) {
    const result = `\u001b[33m${text}`;
    if (isReturn) {
      return result;
    }
    core.info(result);
  }

  static error(text, isReturn = false) {
    const result = `\u001b[31m${text}`;
    if (isReturn) {
      return result;
    }
    core.info(result);
  }
}

module.exports = Output;
