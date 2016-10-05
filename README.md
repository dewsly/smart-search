# smart-search

## NPM Usage

1. If you want to run tests: `npm test` or `npm run testonly` or `npm run test-watch`. You need to write tests in `__tests__` folder. You need at least Node 4 on your machine to run tests.
2. If you want to run linting: `npm test` or `npm run lint`. Fix bugs: `npm run lint-fix`. You can adjust your `.eslintrc` config file.
3. If you want to run transpilation to ES5 in `dist` folder: `npm run prepublish` (standard npm hook).

## Component

```
<SmartSearch
  search={Function}
  renderItem={Function}
  renderSelectedItem={Function}
  label={String}
  query={String}
  results={Array}
  selected={Array}
  onSelect={Function}
  onRemove={Function}
  minCharacters={Number}
  delay={Number}
  showGroupHeading={Boolean}
  multi={Boolean}
  cache={Boolean}
  focusAfterSelect={Boolean}
  focusAfterRemove={Boolean}
  searchable={Boolean}
  autoload={Boolean}
/>
```

## Properties
### `search` *(required)*
**Type:** Callback `function (query, callback) { ... }`

**Description:** Callback function called when requesting search results for a given query. Should accept two parameters, the query and a callback to return search results based on the query.

### `renderItem` *(required)*
**Type:** Callback `function (item) { ... }`

**Description:** Callback function that should return JSX. Used to customize the rendering of a result item. The function will be passed the item object which can be used for rendering.

### `renderSelectedItem` *(required)*
**Type:** Callback `function (item) { ... }`

**Description:** Callback function that should return JSX. Used to customize the rendering of a selected result item. The function will be passed the selected item object which can be used for rendering.

### `label`
**Type:** String

**Description:** The label of the search field input (default: 'Search')

### `query`
**Type:** String

**Description:** The search query string (default: '')

### `results`
**Type:** Array (See the [Results Array](#results-array) section)

**Description:** Array of grouped results, used for rendering the listing of result items.

### `selected`
**Type:** Array

**Description:** Array of results that should be pre-selected.

### `onSelect`
**Type:** Callback `function (selectedItem, selectedItems) { ... }`

**Description:** If provided, this callback will be triggered when an item has been selected. The callback will be passed the selected item object as well as all currently selected items.

### `onRemove`
**Type:** Callback `function (removedItem, selectedItems) { ... }`

**Description:** If provided, this callback will be triggered when an item has been removed. The callback will be passed the removed item object as well as all currently selected items.

### `minCharacters`
**Type:** Number

**Description:** The minimum characters the query should be before triggering the search (default: 3)

### `delay`
**Type:** Number

**Description:** The number of milliseconds to delay before triggering the search (default: 500)

### `showGroupHeading`
**Type:** Boolean

**Description:** Specify whether or not to render the group headings (default: true)

### `multi`
**Type:** Boolean

**Description:** Specify whether or not to allow multiple selected items (default: true)

### `cache`		
**Type:** Boolean		

**Description:** Boolean value to specify whether to leverage caching (default: false)

### `focusAfterSelect`
**Type:** Boolean

**Description:** Specify whether or not the input field should be re-focused after selecting an item (default: true)

### `focusAfterRemove`
**Type:** Boolean

**Description:** Specify whether or not the input field should be re-focused after removing an item (default: true)

### `searchable`
**Type:** Boolean

**Description:** Specify whether or not the smart-search field should execute a search on change (default: true)

### `autoload`
**Type:** Boolean

**Description:** Specify whether or not to trigger the search on initial mount (default: false)

## Results Array
The results are expected to be an array of 0+ groups. Each group should have a `label` that will be used as the group heading in the render (unless `showGroupHeading` is falsy) and an array of `items`, which represent the selectable items within a group.

Example `results` array:
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
