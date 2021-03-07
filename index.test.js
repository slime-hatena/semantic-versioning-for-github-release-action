const parseSemanticVersion = require('./parseSemanticVersion');

test('check parseSemanticVersion', async () => {
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
    { value: null, result: 'Argument \'version\' must be [object String], but [object Null] specified.' },
    { value: 3.5, result: 'Argument \'version\' must be [object String], but [object Number] specified.' },
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
    expect(parseSemanticVersion(element.value)).toEqual(element.result);
  });

  toThrowData.forEach(element => {
    expect(() => parseSemanticVersion(element.value)).toThrow(element.result);
  });
});
