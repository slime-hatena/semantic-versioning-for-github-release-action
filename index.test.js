const Output = require('./module/Output');
const SemanticVersion = require('./module/SemanticVersion');

test('check module/Output', async () => {
  const toEqualData = [
    { value: Output.info('info message'), result: undefined },
    { value: Output.info('info message', true), result: "info message" },
    { value: Output.success('success message'), result: undefined },
    { value: Output.success('success message', true), result: "\u001b[32msuccess message" },
    { value: Output.warn('warn message'), result: undefined },
    { value: Output.warn('warn message', true), result: "\u001b[33mwarn message" },
    { value: Output.error('error message'), result: undefined },
    { value: Output.error('error message', true), result: "\u001b[31merror message" },
  ];

  toEqualData.forEach(element => {
    expect(element.value).toEqual(element.result);
  });
});

test('check module/SemanticVersion.parse', async () => {
  const toEqualData = [
    { value: "1.0.0", result: { major: 1, minor: 0, patch: 0, prerelease: "", meta: "" } },
    { value: "2.4.6", result: { major: 2, minor: 4, patch: 6, prerelease: "", meta: "" } },
    { value: "50000.70000000.9000000000", result: { major: 50000, minor: 70000000, patch: 9000000000, prerelease: "", meta: "" } },
    { value: "3.4.7-alpha", result: { major: 3, minor: 4, patch: 7, prerelease: "alpha", meta: "" } },
    { value: "2.0.4+develop", result: { major: 2, minor: 0, patch: 4, prerelease: "", meta: "develop" } },
    { value: "7.0.1-beta+main", result: { major: 7, minor: 0, patch: 1, prerelease: "beta", meta: "main" } },
    { value: "6.0.5+version-3", result: { major: 6, minor: 0, patch: 5, prerelease: "", meta: "version-3" } },
  ];

  const toThrowData = [
    { value: null, result: 'Argument \'versionString\' must be [object String], but [object Null] specified.' },
    { value: 3.5, result: 'Argument \'versionString\' must be [object String], but [object Number] specified.' },
    { value: "", result: 'Wrong tag as semantic versioning. ' },
    { value: "aaaaabbbbbccccc", result: 'Wrong tag as semantic versioning. aaaaabbbbbccccc' },
    { value: "1.2", result: 'Wrong tag as semantic versioning. 1.2' },
    { value: "1.2.3.456", result: 'Wrong tag as semantic versioning. 1.2.3.456' },
    { value: "a.b.c", result: 'a is not interpreted as an integer value. a.b.c' },
    { value: "1.b.c", result: 'b is not interpreted as an integer value. 1.b.c' },
    { value: "1.2.c", result: 'c is not interpreted as an integer value. 1.2.c' },
    { value: "One.2.3", result: 'One is not interpreted as an integer value. One.2.3' },
  ];

  toEqualData.forEach(element => {
    expect((new SemanticVersion).parse(element.value)).toEqual(element.result);
  });

  toThrowData.forEach(element => {
    expect(() => (new SemanticVersion).parse(element.value)).toThrow(element.result);
  });
});

test('check module/SemanticVersion.isGreater', async () => {
  const toEqualData = [
    {
      left: (new SemanticVersion).parse("1.0.0-beta"),
      right: (new SemanticVersion).parse("1.0.0-beta"),
      result: false,
    },
    {
      left: (new SemanticVersion).parse("1.0.0-beta"),
      right: (new SemanticVersion).parse("2.0.0-beta"),
      result: false,
    },
    {
      left: (new SemanticVersion).parse("1.0.0-beta"),
      right: (new SemanticVersion).parse("1.1.0-beta"),
      result: false,
    },
    {
      left: (new SemanticVersion).parse("1.0.0-beta"),
      right: (new SemanticVersion).parse("1.0.1-beta"),
      result: false,
    },
    {
      left: (new SemanticVersion).parse("1.0.0-beta"),
      right: (new SemanticVersion).parse("1.0.0-beta2"),
      result: false,
    },
    {
      left: (new SemanticVersion).parse("3.0.0-beta"),
      right: (new SemanticVersion).parse("2.0.0-beta"),
      result: true,
    },
    {
      left: (new SemanticVersion).parse("1.2.0-beta"),
      right: (new SemanticVersion).parse("1.1.0-beta"),
      result: true,
    },
    {
      left: (new SemanticVersion).parse("1.0.2-beta"),
      right: (new SemanticVersion).parse("1.0.1-beta"),
      result: true,
    },
    {
      left: (new SemanticVersion).parse("1.0.0-rc"),
      right: (new SemanticVersion).parse("1.0.0-beta2"),
      result: true,
    },
  ]

  const toThrowData = [
    {
      left: (new SemanticVersion).parse("1.2.3"),
      right: "1.2.4",
      result: "Argument 'version' must be [object Object].SemanticVersion, but [object String] specified.",
    }
  ];

  toEqualData.forEach(element => {
    expect(element.left.isGreater(element.right)).toEqual(element.result);
  });

  toThrowData.forEach(element => {
    expect(() => (element.left.isGreater(element.right))).toThrow(element.result);
  });
});
