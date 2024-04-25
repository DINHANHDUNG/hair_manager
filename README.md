# Yarn

# Yarn start

# Add eslint https://duthanhduoc.com/blog/tao-du-an-react-vite-typescript-eslint

    * npm i prettier eslint-config-prettier eslint-plugin-prettier -D

        - prettier: code formatter chính

        - eslint-config-prettier: Bộ config ESLint để vô hiệu hóa các rule của ESLint mà xung đột với Prettier.

        - eslint-plugin-prettier: Dùng thêm 1 số rule Prettier cho ESLint
    --------------------------------------------------------------------------------------------------------------------

    * Tạo .eslintrc.cjs
    --------------------------------------------------------------------------------------------------------------------
        // eslint-disable-next-line no-undef
        module.exports = {
            env: {
            browser: true,
            es2021: true,
            es6: true
            },
            extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'eslint-config-prettier', 'prettier'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
            ecmaVersion: 12,
            sourceType: 'module',
            },
            plugins: ['@typescript-eslint', 'prettier'],
            rules: {
                'prettier/prettier': [
                    'warn',
                    {
                    arrowParens: 'always',
                    semi: false,
                    trailingComma: 'none',
                    tabWidth: 2,
                    endOfLine: 'auto',
                    useTabs: false,
                    singleQuote: true,
                    printWidth: 120,
                    jsxSingleQuote: true
                }
            ]
            },
        };

---

    * Tạo file .prettierrc
        {
            "arrowParens": "always",
            "semi": false,
            "trailingComma": "none",
            "tabWidth": 2,
            "endOfLine": "auto",
            "useTabs": false,
            "singleQuote": true,
            "printWidth": 120,
            "jsxSingleQuote": true
        }
    --------------------------------------------------------------------------------------------------------------------
    * Tiếp theo Tạo file .prettierignore ở thư mục root
        node_modules/
        dist/
        reportWebVitals.ts
    --------------------------------------------------------------------------------------------------------------------
    * Tạo file .editorconfig ở thư mục root
        [*]
        indent_size = 2
        indent_style = space
    --------------------------------------------------------------------------------------------------------------------
    * Mở file package.json lên, thêm đoạn script dưới vào
        "scripts": {
            //...
            "lint:fix": "eslint --fix src --ext ts,tsx",
            "prettier": "prettier --check \"src/**/(_.tsx|_.ts|_.css|_.scss)\"",
            "prettier:fix": "prettier --write \"src/**/(_.tsx|_.ts|_.css|_.scss)\""
        }

