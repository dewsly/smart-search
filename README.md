# smart-search

## NPM Usage

1. If you want to run tests: `npm test` or `npm run testonly` or `npm run test-watch`. You need to write tests in `__tests__` folder. You need at least Node 4 on your machine to run tests.
2. If you want to run linting: `npm test` or `npm run lint`. Fix bugs: `npm run lint-fix`. You can adjust your `.eslintrc` config file.
3. If you want to run transpilation to ES5 in `dist` folder: `npm run prepublish` (standard npm hook).

## Component

```
<SmartSearch
  query={String}
  search={Function}
  results={Array}
  renderItem={Function}
  renderSelectedItem={Function}
  onSelect={Function}
  onRemove={Function}
  minCharacters={Number}
  cache={Boolean}
  showGroupHeading={Boolean}
/>
```

## Parameters
`query`
The search query string (default: '')

`search`
Function called when query changes and is >= minCharacters

`results`
Array of grouped results, used for rendering the listing of result items

`renderItem`
Function returning JSX. Used to render the selected item.

`renderSelectedItem`
Function returning JSX. Used to render the selected item.

`onSelect`
Callback notification when item has been selected.

`onRemove`
Callback notification when item removed.

`minCharacters`
The minimum characters the query should be before triggering the search (default: 3)

`cache`
Boolean value to specify whether to leverage caching (default: true)

`showGroupHeading`
Specify whether or not to render the group headings (default: true)
