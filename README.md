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
Array of grouped results, used for rendering the listing of result items. See Results Object section for details on expected formatting.

`renderItem`
Function returning JSX. Used to render the selected item.

`renderSelectedItem`
Function returning JSX. Used to render the selected item.

`onSelect`
If provided, this callback will be triggered when an item has been selected. The callback will be passed the selected item object.

`onRemove`
If provided, this callback will be triggered when an item has been removed. The callback will be passed the removed item object.

`minCharacters`
The minimum characters the query should be before triggering the search (default: 3)

`cache`
Boolean value to specify whether to leverage caching (default: true)

`showGroupHeading`
Specify whether or not to render the group headings (default: true)

## Results Object
The results are expected to be an array of 0+ groups. Each group should have a `label` that will be used as the group heading in the render (unless `showGroupHeading` is falsy) and a set of `items` which represent the items within that group.

Example `results` object:
```
[
  {
    'key': 'people',
    'label': 'People',
    'items': [
      {
        'name': 'Alf',
        'id': '1'
      },
      {
        'name': 'Bananas',
        'id': '2'
      }
    ]
  },
  {
    'key': 'schools',
    'label': 'Schools',
    'items': [
      {
        'name': 'School #1',
        'id': '3'
      },
      {
        'name': 'School #2',
        'id': '5'
      }
    ]
  }
]
```
