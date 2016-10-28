import React from 'react';
import classNames from 'classnames';

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
     * @property {array} cachedResults array of results to use when caching enabled
     */
    this.state = {
      selected: [],
      query: this.props.query,
      focused: false,
      open: false,
      loading: false,
      highlightIndex: -1,
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
    if (nextProps.selected && nextProps.selected.length) {
      for(var i=0, len=nextProps.selected.length; i<len; i++) {
        if (!this._isSelected(nextProps.selected[i])) {
          this._selectItem(nextProps.selected[i]);
        }
      }
    }
  }

  componentDidMount() {
    if (this.props.autoload && this.props.search) {
      this._onQueryChange('');
    }

    if (this.props.focusOnMount && this._input) {
      this._input.focus();
    }

    if (this.props.selected) {
      for(var i=0, len=this.props.selected.length; i<len; i++) {
        if (!this._isSelected(this.props.selected[i])) {
          this._selectItem(this.props.selected[i]);
        }
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this._queryTimeout);
    clearTimeout(this._focusTimeout);
    clearTimeout(this._highlightTimeout);
  }

  _focus() {
    if (this._input) {
      this._input.focus();
      this._onFocus();
    }
  }

  _blur() {
    if (this._input) {
      this._input.blur();
      this._onBlur();
    }
  }

  _toggleOpen() {
    if (this.props.searchable) { return; }
    this.setState({
      open: !this.state.open
    });
  }

  _getComponentClass() {
    let className = classNames('smart-search', {
      'is-focused': this.state.focused,
      'is-open': this.state.open,
      'is-empty': !this.state.query,
      'is-loading': this.state.loading,
      'has-value': this.state.selected.length,
      'multi': this.props.multi,
      'single': !this.props.multi,
      'searchable': this.props.searchable,
      'not-searchable': !this.props.searchable,
      'has-results': this._getResultCount()
    });

    return className;
  }

  _getItemClass(index) {
    let className = "ss-item";
    if (this.state.highlightIndex == index) {
      className += " active";
    }
    return className;
  }

  _getResults() {
    let self = this;
    if (!this.props.search || !this.props.filterSelected) {
      return this.props.results;
    }
    let results = this.state.cachedResults && this.state.cachedResults.length ? this.state.cachedResults : this.props.results;

    // remove any selected results from the set:
    let filteredResults = results.map((group) => {
      if (!group || !group.items) {
        return group;
      }

      let filteredItems = group.items.filter((result) => {
        return !self._isSelected(result);
      });
      let updated = Object.assign({}, group);
      updated.items = filteredItems;

      return updated;
    });

    return filteredResults;
  }

  _getResultCount() {
    return this._getResults().reduce((previous, current) => {
      return previous + (current && current.items ? current.items.length : 0);
    }, 0);
  }

  _handleChange(event) {
    if (!this.props.searchable) {
      return;
    }

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

    var self = this;
    clearTimeout(this._highlightTimeout);
    this._highlightTimeout = setTimeout(function () {
      if (self._highlightedItem) {
        if (self._highlightedItem.scrollIntoViewIfNeeded) {
          self._highlightedItem.scrollIntoViewIfNeeded();
        } else {
          self._highlightedItem.scrollIntoView();
        }
      }
    }, 0);
  }

  _highlightPreviousResult() {
    let index = this.state.highlightIndex;
    if ((index-1) < 0) {
      index = this._getResultCount();
    }
    this.setState({
      highlightIndex: index - 1
    });

    var self = this;
    clearTimeout(this._highlightTimeout);
    this._highlightTimeout = setTimeout(function () {
      if (self._highlightedItem) {
        if (self._highlightedItem.scrollIntoViewIfNeeded) {
          self._highlightedItem.scrollIntoViewIfNeeded();
        } else {
          self._highlightedItem.scrollIntoView();
        }
      }
    }, 0);
  }

  _isSelected(item) {
    let found = this.state.selected.filter((result) => {
      return result.id === item.id;
    });
    return found.length;
  }

  _onBlur() {
    let self = this;
    clearTimeout(this._focusTimeout);
    this._focusTimeout = setTimeout(function () {
      self.setState({
        focused: false,
        open: false
      });

      if (self.props.onBlur) { self.props.onBlur(); }
    }, 200);
  }

  _onFocus() {
    let self = this;
    clearTimeout(this._focusTimeout);
    this._focusTimeout = setTimeout(function () {
      self.setState({
        focused: true,
        open: true
      });
      if (self._results) {
        self._results.scrollTop = 0;
      }

      if (self.props.onFocus) { self.props.onFocus(); }
    }, 100);
  }

  _onKeyDown(e) {
    let stop = false;

    switch(e.which) {
      case 8:
        // delete
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
    if (!this.props.autoload && query.length < this.props.minCharacters) {
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

      clearTimeout(self._queryTimeout);

      self._queryTimeout = setTimeout(function () {
        self.setState({
          loading: true
        });
        self.props.search(query, function (err, results) {
          var cache = self.state.cache;
          if (self.props.cache) {
            cache[query] = results;
          }
          self.setState({
            cachedResults: results,
            cache: cache,
            loading: false
          });
        });
      }, self.props.delay);
    }
  }

  _removeItem(item) {
    const selected = this.state.selected.filter((val) => {
      return val.id !== item.id;
    });
    this.setState({
      selected: selected
    });
    if (this.props.onRemove) { this.props.onRemove(item, selected); }

    if (this.props.focusAfterRemove) {
      this._focus();
    }
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
    if (!results || !results.length || this.state.highlightIndex < 0) {
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
    let updatedState = {
      selected: selected,
      query: '',
      highlightIndex: -1
    };
    if (this.props.multi) {
      updatedState.cachedResults = [];
    }
    this.setState(updatedState);

    if (removedItem && this.props.onRemove) {
      this.props.onRemove(removedItem, selected);
    }
    if (this.props.onSelect) {
      this.props.onSelect(item, selected);
    }
    if (this.props.focusAfterSelect) {
      this._focus();
    }
  }

  render() {
    let _results = this._getResults();
    return (
      <div className={this._getComponentClass()}>
        <label
          className="ss-label"
          title={this._renderLabel()}>{this._renderLabel()}</label>
        <div className="ss-control">
          {this.state.selected.map((item, i) =>
            <div
              className="ss-selected-item"
              key={i}
              onClick={() => {this._removeItem(item)}}>
              {this._renderSelectedItem(item)}
            </div>
          )}
          <div className="ss-input">
            <input
              autoComplete="off"
              type="text"
              name="search"
              ref={(e) => { this._input = e; }}
              title={this._renderLabel()}
              value={this.state.query}
              onClick={(e) => { this._toggleOpen(); }}
              onChange={(e) => { this._handleChange(e); }}
              onFocus={() => { this._onFocus(); }}
              onBlur={() => { this._onBlur(); }}
              onKeyDown={(e) => { this._onKeyDown(e); }} />
          </div>
        </div>
        <div className="ss-results"
             ref={(e) => { this._results = e; }}>
          {_results && _results.map((results, i) =>
            <div
              className="ss-group"
              key={i}>
              {this.props.showGroupHeading ?
                <h3 className="ss-group-heading">{results.label}</h3> : '' }
              {results.items && results.items.map((result, j) =>
                <div
                  className={this._getItemClass(j)}
                  ref={(e) => { if(this.state.highlightIndex === j) { this._highlightedItem = e; }}}
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
  search: React.PropTypes.func,
  renderItem: React.PropTypes.func.isRequired,
  renderSelectedItem: React.PropTypes.func.isRequired,
  onSelect: React.PropTypes.func,
  onRemove: React.PropTypes.func,
  results: React.PropTypes.array,
  minCharacters: React.PropTypes.number,
  showGroupHeading: React.PropTypes.bool,
  cache: React.PropTypes.bool,
  delay: React.PropTypes.number,
  selected: React.PropTypes.array,
  focusAfterSelect: React.PropTypes.bool,
  focusAfterRemove: React.PropTypes.bool,
  searchable: React.PropTypes.bool,
  autoload: React.PropTypes.bool,
  focusOnMount: React.PropTypes.bool,
  filterSelected: React.PropTypes.bool,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func
};
SmartSearch.defaultProps = {
  query: '',
  minCharacters: 3,
  showGroupHeading: true,
  cache: false,
  results: [],
  delay: 500,
  selected: [],
  focusAfterSelect: true,
  focusAfterRemove: true,
  searchable: true,
  autoload: false,
  focusOnMount: false,
  filterSelected: true
};
export default SmartSearch;
