const SemanticVersion = class SemanticVersion {
    constructor() {
        this.major = 0;
        this.minor = 0;
        this.patch = 0;
        this.prerelease = "";
        this.meta = "";
    }

    parse(versionString) {
        if (toString.call(versionString) != "[object String]") {
            throw new Error(`Argument 'versionString' must be [object String], but ${toString.call(versionString)} specified.`);
        }

        if ((versionString.match(/\./g) || []).length != 2) {
            throw new Error(`Wrong tag as semantic versioning. ${versionString}`);
        }

        const v = versionString.split('.');
        for (let i = 0; i <= 2; ++i) {
            let element = v[i];

            if (i == 2) {
                let hasPrerelease = (element.indexOf('-') != -1);
                const hasMeta = (element.indexOf('+') != -1);

                if (hasPrerelease && hasMeta) {
                    hasPrerelease = !element.match(/\+.*-/);
                }

                if (hasPrerelease && hasMeta) {
                    const m = element.split('+');
                    element = m[0];
                    this.meta = m[1];

                    const p = element.split('-');
                    element = p[0];
                    this.prerelease = p[1];
                } else if (hasMeta) {
                    const m = element.split('+');
                    element = m[0];
                    this.meta = m[1];
                } else if (hasPrerelease) {
                    const p = element.split('-');
                    element = p[0];
                    this.prerelease = p[1];
                }
            }

            const n = Number(element);
            if (Number.isNaN(n)) {
                throw new Error(`${element} is not interpreted as an integer value. ${versionString}`);
            }

            if (i == 0) {
                this.major = n;
            } else if (i == 1) {
                this.minor = n;
            } else if (i == 2) {
                this.patch = n;
            }
        }

        return this;
    }

    isGreater(semanticVersion) {
        if (toString.call(semanticVersion) != "[object Object]") {
            throw new Error(`Argument 'version' must be [object Object].SemanticVersion, but ${toString.call(semanticVersion)} specified.`);
        }

        try {
            if (this.major > semanticVersion.major) {
                return true;
            } else if (this.major < semanticVersion.major) {
                return false;
            }

            if (this.minor > semanticVersion.minor) {
                return true;
            } else if (this.minor < semanticVersion.minor) {
                return false;
            }

            if (this.patch > semanticVersion.patch) {
                return true;
            } else if (this.patch < semanticVersion.patch) {
                return false;
            }

            if ([this.prerelease, semanticVersion.prerelease].sort().indexOf(this.prerelease) == 1) {
                return true;
            }

        } catch (error) {
            throw new Error(`Argument 'semanticVersion' must be [object Object].SemanticVersion, but [object Object].${semanticVersion.constructor.name} specified.`);
        }
        return false;
    }
}

module.exports = SemanticVersion;
