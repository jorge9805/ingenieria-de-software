export default [
  // Ignorar archivos y directorios
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**", 
      "coverage/**",
      "*.min.js",
      "renderer/dist/**",
      "main/dist/**",
      "*.bundle.js",
      "webpack.config.js",
      "babel.config.js",
      "jest.config.js",
      "tailwind.config.js",
      "postcss.config.js",
      "scripts/**",
      "config/**",
      "data/**",
      "assets/**"
    ]
  },

  // Configuración global
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Node.js globals
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        global: "readonly",
        Buffer: "readonly",
          // Browser globals
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        alert: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        URL: "readonly",
        
        // Jest globals
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly"
      }
    },    rules: {
      // Reglas básicas basadas en problemas identificados
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "no-undef": "error",
      "no-duplicate-case": "error",
      "no-unreachable": "error",
      "no-redeclare": "error",
      "no-dupe-keys": "error"
    }
  },

  // Configuración específica para tests
  {
    files: ["tests/**/*.js"],
    rules: {
      "no-console": "off",
      "no-unused-vars": "off"
    }
  }
];
