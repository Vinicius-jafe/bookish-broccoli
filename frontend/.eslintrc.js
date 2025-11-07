module.exports = {
  extends: [],
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // Desativa todas as regras do Prettier
    'prettier/prettier': 'off',
    // Desativa a regra de quebras de linha CRLF
    'linebreak-style': 'off',
    // Desativa a regra de aspas simples/duplas
    'quotes': 'off',
    // Desativa a regra de ponto e vírgula
    'semi': 'off',
    // Desativa a regra de trailing commas
    'comma-dangle': 'off',
    // Desativa a regra de espaços em branco
    'no-trailing-spaces': 'off',
    // Desativa a regra de parênteses em arrow functions com um parâmetro
    'arrow-parens': 'off',
    // Desativa a regra de quebra de linha no final do arquivo
    'eol-last': 'off',
    // Desativa a regra de espaços antes de parênteses
    'space-before-function-paren': 'off',
    // Desativa a regra de espaços dentro de chaves
    'object-curly-spacing': 'off',
    // Desativa a regra de espaços dentro de colchetes
    'array-bracket-spacing': 'off',
    // Desativa a regra de espaços em operadores
    'space-infix-ops': 'off',
    // Desativa a regra de múltiplas linhas vazias
    'no-multiple-empty-lines': 'off',
    // Desativa a regra de indentação
    'indent': 'off',
    // Desativa a regra de espaço antes de blocos
    'space-before-blocks': 'off',
    // Desativa a regra de espaço após function keyword
    'keyword-spacing': 'off',
    // Desativa a regra de espaço após comentários
    'spaced-comment': 'off',
    // Desativa a regra de espaço após vírgulas
    'comma-spacing': 'off',
    // Desativa a regra de espaço após dois pontos
    'key-spacing': 'off',
    // Desativa a regra de espaço após abre chaves
    'block-spacing': 'off',
    // Desativa a regra de espaço dentro de parênteses
    'space-in-parens': 'off',
    // Desativa avisos de console
    'no-console': 'off',
    // Permite variáveis não utilizadas que começam com _
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    // Desativa erros de JSX
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // Permite variáveis globais
    'no-undef': 'off'
  }
};
