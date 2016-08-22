import React from 'react';

class SmartSearch extends React.Component {

  constructor(props) {
    super(props);
    /**
     * @type {object}
     * @property {string} query search query
     * @property {array} selected array of selected items
     * @property {object} cache object map of query -> results
     * @property {object} cachedResults array of results to use when caching enabled
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
              {this.props.showGroupHeading ?
                <h3 className="ss-group-heading">{results.label}</h3> : '' }
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
  query: React.PropTypes.string.isRequired,
  search: React.PropTypes.func.isRequired,
  renderItem: React.PropTypes.func,
  renderSelectedItem: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  onRemove: React.PropTypes.func,
  results: React.PropTypes.array,
  cache: React.PropTypes.bool,
  minCharacters: React.PropTypes.number,
  showGroupHeading: React.PropTypes.bool
};
SmartSearch.defaultProps = {
  query: '',
  cache: true,
  minCharacters: 3,
  showGroupHeading: true
};
export default SmartSearch;
