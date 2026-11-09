// https://docs.expo.dev/guides/using-eslint/
const fs = require('node:fs');
const path = require('node:path');
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

const modulesDir = path.join(__dirname, 'src/modules');
const modules = fs
  .readdirSync(modulesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
  .map((entry) => entry.name);

const moduleIsolationRules = modules.map((moduleName) => ({
  files: [`src/modules/${moduleName}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: modules
          .filter((other) => other !== moduleName)
          .map((other) => ({
            group: [`@/modules/${other}`, `@/modules/${other}/*`],
            message:
              'Un module ne doit pas importer un autre module. Utilise le code partagé (src/lib, src/types, src/components, src/hooks, src/constants).',
          })),
      },
    ],
  },
}));

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/modules/*/screens/*',
                '@/modules/*/components/*',
                '@/modules/*/hooks/*',
                '@/modules/*/services/*',
              ],
              message:
                "Les routes importent uniquement l'API publique du module : @/modules/<domaine>.",
            },
          ],
        },
      ],
    },
  },
  {
    // Le code partagé ne dépend jamais d'un module métier.
    files: [
      'src/lib/**/*.{ts,tsx}',
      'src/types/**/*.{ts,tsx}',
      'src/hooks/**/*.{ts,tsx}',
      'src/components/**/*.{ts,tsx}',
      'src/constants/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/modules', '@/modules/*'],
              message:
                'Le code partagé (src/lib, src/types, src/hooks, src/components, src/constants) ne doit pas importer un module.',
            },
          ],
        },
      ],
    },
  },
  ...moduleIsolationRules,
]);
