const parseSemanticVersion = function (version) {
    if ((version.match(/\./g) || []).length != 2) {
        throw new Error(`Wrong tag as semantic versioning. ${version}`);
    }
    const versionObject = { major: 0, minor: 0, patch: 0, prerelease: "", meta: "" };

    const v = version.split('.');
    for (let i = 0; i <= 2; ++i) {
        let element = v[i];

        if (i == 2) {
            let hasPrerelease = (element.indexOf('-') != -1);
            let hasMeta = (element.indexOf('+') != -1);

            if (hasPrerelease && hasMeta) {
                hasPrerelease = !element.match(/\+.*-/);
            }

            if (hasPrerelease && hasMeta) {
                const m = element.split('+');
                element = m[0];
                versionObject.meta = m[1];

                const p = element.split('-');
                element = p[0];
                versionObject.prerelease = p[1];
            } else if (hasMeta) {
                const m = element.split('+');
                element = m[0];
                versionObject.meta = m[1];
            } else if (hasPrerelease) {
                const p = element.split('-');
                element = p[0];
                versionObject.prerelease = p[1];
            }
        }

        const n = Number(element);
        if (Number.isNaN(n)) {
            throw new Error(`${element} is not interpreted as an integer value. ${version}`);
        }

        if (i == 0) {
            versionObject.major = n;
        } else if (i == 1) {
            versionObject.minor = n;
        } else if (i == 2) {
            versionObject.patch = n;
        }
    }

    return versionObject;
}

module.exports = parseSemanticVersion;
