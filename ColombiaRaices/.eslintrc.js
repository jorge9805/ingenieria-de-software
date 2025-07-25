module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // Reglas basadas en los problemas identificados en static_code_analysis_report.md
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "warn",
    "react/prop-types": "warn",
    "react/react-in-jsx-scope": "off", // No necesario en React 17+
    "no-undef": "error",
    "no-duplicate-case": "error",
    "no-unreachable": "error",
  },
  // Configuraciones específicas para directorios
  overrides: [
    {
      files: ["main/**/*.js"],
      env: {
        node: true,
        browser: false,
      },
      rules: {
        // Reglas específicas para el proceso principal de Electron
        "no-console": "off", // Permitir console en main process
      },
    },
    {
      files: ["renderer/**/*.js", "renderer/**/*.jsx"],
      env: {
        browser: true,
        node: false,
      },
      rules: {
        // Reglas específicas para React
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
    {
      files: ["tests/**/*.js"],
      env: {
        jest: true,
        node: true,
      },
      rules: {
        // Reglas relajadas para tests
        "no-console": "off",
        "no-unused-vars": "off",
      },
    },
  ],
};
