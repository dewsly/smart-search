import React from 'react';

class SmartSearch extends React.Component {

  constructor(props) {
    super(props);
    /**
     * @type {object}
     * @property {string} query search query
     * @property {array} selected array of selected items
     * @property {object} cache object map of query -> results
     */
    this.state = {
      query: '',
      selected: [],
      cache: {},
      cachedResults: []
    };
    this._selectItem = this._selectItem.bind(this);
    this._removeItem = this._removeItem.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.cache) {
      this._updateCache();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.setState({
        query: nextProps.query
      });
      this._onQueryChange(nextProps.query);
    }
  }

  _getResults() {
    return this.state.cachedResults[this.state.query] || this.props.results;
  }

  _onQueryChange(query) {
    // determine if query value length is >= props.minCharacters
    if (!query || query.length < this.props.minCharacters) {
      return;
    }

    if (this.props.cache && this.state.cache[query]) {
      // set results to value of cache
      this.setState({
        cachedResults: this.state.cache[query]
      });
      return;
    }
    // execute search action with search value:
    if (this.props.search) {
      this.props.search(query);
    }
  }

  _removeItem(item) {
    this.setState({
      selected: this.state.selected.filter((val) => {
        return val.id !== item.id;
      })
    });
    if (this.props.onRemove) { this.props.onRemove(item); }
  }

  _renderItem(item) {
    return this.props.renderItem ? this.props.renderItem(item) : JSON.stringify(item);
  }

  _renderSelectedItem(item) {
    return this.props.renderSelectedItem ? this.props.renderSelectedItem(item) : JSON.stringify(item);
  }

  _selectItem(item) {
    this.setState({
      query: '',
      selected: this.state.selected.concat([item])
    });
    if (this.props.onSelect) { this.props.onSelect(item); }
  }

  _updateCache() {
    if (!this.state || this.state.cache[this.state.query]) {
      return;
    }
    let cache = this.state.cache;
    cache[this.state.query] = this.props.results;
    this.setState({
      cache: cache
    });
  }

  render() {
    let _results = this._getResults();
    return (
      <div className="smart-search">
        {this.state.selected.map(item =>
          <div
            className="ss-selected-item"
            key={item.id}
            onClick={() => {this._removeItem(item)}}>
            {this._renderSelectedItem(item)}
          </div>
        )}
        <span className="label">Search</span>
        <input
          type="text"
          name="search"
          value={this.props.query} />
        <div className="ss-results">
          {_results && _results.map(results =>
            <div
              className="ss-group"
              key={results.key}>
              <h3>{results.label}</h3>
              {results.items.map(result =>
                <div
                  className="ss-item"
                  key={result.id}
                  onClick={() => {this._selectItem(result)}}>
                  {this._renderItem(result)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

}

SmartSearch.propTypes = {
  /**
   * The value of the search query
   */
  query: React.PropTypes.string.isRequired,
  /**
   * Function called when query changes
   */
  search: React.PropTypes.func.isRequired,
  /**
   * Function returning JSX. Used to render each result
   */
  renderItem: React.PropTypes.func,
  /**
   * Function returning JSX. Used to render the selected item
   */
  renderSelectedItem: React.PropTypes.func,
  /**
   * Callback notification when item is selected.
   */
  onSelect: React.PropTypes.func,
  /**
   * Callback notification when item removed.
   */
  onRemove: React.PropTypes.func,
  /**
   * Array of grouped results, used for rendering the listing of result items
   */
  results: React.PropTypes.array,
  /**
   * Boolean value to specify whether to leverage caching
   */
  cache: React.PropTypes.bool,
  /**
   * The minimum characters the query should be before triggering the search
   */
  minCharacters: React.PropTypes.number
};
SmartSearch.defaultProps = {
  query: '',
  cache: true,
  minCharacters: 3
};
export default SmartSearch;
