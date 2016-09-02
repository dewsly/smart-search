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

  _handleChange(event) {
    this.setState({query: event.target.value});
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
    if (this.props.onRemove) { this.props.onRemove(item, this.state.selected); }
  }

  _renderItem(item) {
    return this.props.renderItem ? this.props.renderItem(item) : JSON.stringify(item);
  }

  _renderLabel() {
    return this.props.label || 'Search';
  }

  _renderSelectedItem(item) {
    return this.props.renderSelectedItem
      ? this.props.renderSelectedItem(item)
      : JSON.stringify(item);
  }

  _selectItem(item) {
    let selected = this.state.selected;
    let removedItem = null;

    if (this.props.multi) {
      selected = this.state.selected.concat([item]);
    } else {
      if (this.state.selected.length) {
        removedItem = this.state.selected[0];
      }
      selected = [item];
    }

    this.setState({
      query: '',
      selected: selected
    });
    if (removedItem && this.props.onRemove) {
      this.props.onRemove(removedItem, this.state.selected);
    }
    if (this.props.onSelect) { this.props.onSelect(item, this.state.selected); }
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
        <label className="ss-label">{this._renderLabel()}</label>
        {this.state.selected.map(item =>
          <div
            className="ss-selected-item"
            key={item.id}
            onClick={() => {this._removeItem(item)}}
            onChange={this._handleChange}>
            {this._renderSelectedItem(item)}
          </div>
        )}
        <input
          type="text"
          name="search"
          value={this.state.query} />
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
  query: React.PropTypes.string,
  search: React.PropTypes.func.isRequired,
  renderItem: React.PropTypes.func.isRequired,
  renderSelectedItem: React.PropTypes.func.isRequired,
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
