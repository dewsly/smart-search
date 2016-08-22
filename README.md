# smart-search

## NPM Usage

1. If you want to run tests: `npm test` or `npm run testonly` or `npm run test-watch`. You need to write tests in `__tests__` folder. You need at least Node 4 on your machine to run tests.
2. If you want to run linting: `npm test` or `npm run lint`. Fix bugs: `npm run lint-fix`. You can adjust your `.eslintrc` config file.
3. If you want to run transpilation to ES5 in `dist` folder: `npm run prepublish` (standard npm hook).

## Component

```
<SmartSearch
  search
  results
  renderItem
  renderSelectedItem
  onSelect
  onRemove
  minCharacters
  cache
/>
```

### Parameters
