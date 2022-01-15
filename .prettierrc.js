const { mergePrettierConfig, PrettierBaseConfig } = require("@techkit/linter-config");

module.exports = mergePrettierConfig(PrettierBaseConfig, {
    tabWidth: 4
});
