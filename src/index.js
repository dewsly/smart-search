import React from 'react';

class SmartSearch extends React.Component {

  constructor(props) {
    super(props);
    /**
     * @type {object}
     * @property {array} selected array of selected items
     * @property {string} query search string
     * @property {bool} focused boolean indicating whether input is focused
     */
    this.state = {
      selected: [],
      query: this.props.query,
      focused: false
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
    return className;
  }

  _getResults() {
    return this.props.results;
  }

  _handleChange(event) {
    this._onQueryChange(event.target.value);
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

  _onQueryChange(query) {
    this.setState({
      query: query
    });

    // determine if query value length is >= props.minCharacters
    if (!query || query.length < this.props.minCharacters) {
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
      selected: selected,
      query: ''
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
        <div className="Select-control">
          <label className="ss-label">{this._renderLabel()}</label>
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
              type="text"
              name="search"
              value={this.state.query}
              onChange={(e) => { this._handleChange(e); }}
              onFocus={() => { this._onFocus(); }}
              onBlur={() => { this._onBlur(); }} />
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
                  className="ss-item"
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
  showGroupHeading: React.PropTypes.bool
};
SmartSearch.defaultProps = {
  query: '',
  minCharacters: 3,
  showGroupHeading: true
};
export default SmartSearch;
