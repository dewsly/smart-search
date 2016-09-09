import React from 'react';

class SmartSearch extends React.Component {

  constructor(props) {
    super(props);
    /**
     * @type {object}
     * @property {array} selected array of selected items
     * @property {string} query search string
     * @property {bool} focused boolean indicating whether input is focused
     * @property {int} highlightIndex int indicate which result should be highlighted
     * @property {object} cache object map of query -> results
     * @property {array} cachedResults array of resuilts to use when caching enabled
     */
    this.state = {
      selected: [],
      query: this.props.query,
      focused: false,
      highlightIndex: 0,
      cache: {},
      cachedResults: null
    };
    this._selectItem = this._selectItem.bind(this);
    this._removeItem = this._removeItem.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this._onQueryChange(nextProps.query);
    }
  }

  _getComponentClass() {
    let className = 'Select smart-search';
    if (this.state.focused) {
      className += ' is-focused is-open';
    }
    if (!this.state.query) {
      className += ' is-empty';
    }
    if (this.state.selected.length) {
      className += ' has-value';
    }
    return className;
  }

  _getItemClass(index) {
    let className = "Select-option ss-item";
    if (this.state.highlightIndex == index) {
      className += " active";
    }
    return className;
  }

  _getResults() {
    return this.state.cachedResults && this.state.cachedResults.length ? this.state.cachedResults : this.props.results;
  }

  _getResultCount() {
    return this._getResults().reduce((previous, current) => {
      return previous + current.items.length;
    }, 0);
  }

  _handleChange(event) {
    this._onQueryChange(event.target.value);
  }

  _highlightNextResult() {
    let index = this.state.highlightIndex;
    if (this._getResultCount() <= (index + 1)) {
      index = -1;
    }
    this.setState({
      highlightIndex: index + 1
    });
  }

  _highlightPreviousResult() {
    let index = this.state.highlightIndex;
    if ((index-1) < 0) {
      index = this._getResultCount();
    }
    this.setState({
      highlightIndex: index - 1
    });
  }

  _onBlur() {
    this.setState({
      focused: false
    });
  }

  _onFocus() {
    this.setState({
      focused: true
    });
  }

  _onKeyDown(e) {
    let stop = false;

    switch(e.which) {
      case 8:
        if (!this.state.query && this.state.selected.length) {
          this._removeItem(this.state.selected[this.state.selected.length-1]);
        }
        break;
      case 38:
        // up
        stop = true;
        this._highlightPreviousResult();
        break;
      case 40:
        // down
        stop = true;
        this._highlightNextResult();
        break;
      case 13:
      case 176:
        // enter / numpad enter
        stop = true;
        this._selectHighlighted();
        break;
    }
    if (stop) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  _onQueryChange(query) {
    this.setState({
      query: query
    });

    // determine if query value length is >= props.minCharacters
    if (!query || query.length < this.props.minCharacters) {
      return;
    }

    if (this.props.cache && this.state.cache[query]) {
      // set cached results to value of cache
      this.setState({
        cachedResults: this.state.cache[query]
      });
      return;
    }
    // execute search action with search value:
    if (this.props.search) {
      var self = this;
      this.props.search(query, function (err, results) {
        var cache = self.state.cache;
        if (self.props.cache) {
          cache[query] = results;
        }
        self.setState({
          cachedResults: results,
          cache: cache
        });
      });
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

  _selectHighlighted() {
    let results = this._getResults();
    if (!results || !results.length) {
      return;
    }

    let highlightedItem = results[0]
      , offset = 0;

    for (let i=0, len=results.length; i<len; i++) {
      if (offset + results[i].items.length <= this.state.highlightIndex ) {
        offset += results[i].items.length;
        continue;
      }
      highlightedItem = results[i].items[this.state.highlightIndex - offset];
      break;
    }

    this._selectItem(highlightedItem);
  }

  _selectItem(item) {
    let selected = this.state.selected;
    let removedItem = null;

    if (this.props.multi) {
      let alreadyExists = this.state.selected.reduce((previous, current) => {
        return previous || current.id == item.id;
      }, false);
      if (!alreadyExists) {
        selected = this.state.selected.concat([item]);
      }
    } else {
      if (this.state.selected.length) {
        removedItem = this.state.selected[0];
      }
      selected = [item];
    }

    this.setState({
      selected: selected,
      query: '',
      cachedResults: []
    });
    if (removedItem && this.props.onRemove) {
      this.props.onRemove(removedItem, selected);
    }
    if (this.props.onSelect) { this.props.onSelect(item, selected); }
  }

  render() {
    let _results = this._getResults();
    return (
      <div className={this._getComponentClass()}>
        <label className="ss-label">{this._renderLabel()}</label>
        <div className="Select-control">
          {this.state.selected.map((item, i) =>
            <div
              className="ss-selected-item"
              key={i}
              onClick={() => {this._removeItem(item)}}>
              {this._renderSelectedItem(item)}
            </div>
          )}
          <div className="Select-input">
            <input
              autoComplete="off"
              type="text"
              name="search"
              value={this.state.query}
              onChange={(e) => { this._handleChange(e); }}
              onFocus={() => { this._onFocus(); }}
              onBlur={() => { this._onBlur(); }}
              onKeyDown={(e) => { this._onKeyDown(e); }} />
          </div>
        </div>
        <div className="Select-menu-outer ss-results">
          {_results && _results.map((results, i) =>
            <div
              className="ss-group"
              key={i}>
              {this.props.showGroupHeading ?
                <h3 className="ss-group-heading">{results.label}</h3> : '' }
              {results.items && results.items.map((result, j) =>
                <div
                  className={this._getItemClass(j)}
                  key={j}
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
  label: React.PropTypes.string,
  query: React.PropTypes.string,
  search: React.PropTypes.func.isRequired,
  renderItem: React.PropTypes.func.isRequired,
  renderSelectedItem: React.PropTypes.func.isRequired,
  onSelect: React.PropTypes.func,
  onRemove: React.PropTypes.func,
  results: React.PropTypes.array,
  minCharacters: React.PropTypes.number,
  showGroupHeading: React.PropTypes.bool,
  cache: React.PropTypes.bool
};
SmartSearch.defaultProps = {
  query: '',
  minCharacters: 3,
  showGroupHeading: true,
  cache: false,
  results: []
};
export default SmartSearch;
