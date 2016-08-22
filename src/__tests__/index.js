import React from 'react';

import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';

import SmartSearch from '../index';

// Demo tests

// Shallow Rendering
// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
describe('Shallow Rendering', () => {
  let results = [];

  before(function (done) {
    results = [
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
    ];

    done();
  });

  it('to have 0 .ss-group elements when no results', () => {
    const wrapper = shallow(<SmartSearch />);
    expect(wrapper.find('.ss-group')).to.have.length(0);
  });

  it('to have 2 .ss-group elements', () => {
    const wrapper = shallow(
      <SmartSearch results={results} />
    );

    expect(wrapper.find('.ss-group')).to.have.length(2);
  });

  it('to have 4 .ss-item elements', () => {
    const wrapper = shallow(
      <SmartSearch results={results} />
    );

    expect(wrapper.find('.ss-item')).to.have.length(4);
  });

  it('triggers onSelect when item has been clicked', () => {
    const onSelect = sinon.spy();

    const wrapper = shallow(
      <SmartSearch
        onSelect={onSelect}
        results={results} />
    );
    wrapper.find('.ss-item').first().simulate('click');
    expect(onSelect.calledOnce).to.equal(true);
  });

  it('has one .ss-selected-item after clicking on a result', () => {
    const wrapper = shallow(
      <SmartSearch
        results={results} />
    );
    wrapper.find('.ss-item').first().simulate('click');
    expect(wrapper.find('.ss-selected-item')).to.have.length(1);
  });

  it('triggers onRemove when selected item has been removed', () => {
    const onRemove = sinon.spy();

    const wrapper = shallow(
      <SmartSearch
        onRemove={onRemove}
        results={results} />
    );
    wrapper.find('.ss-item').first().simulate('click');
    wrapper.find('.ss-selected-item').first().simulate('click');
    expect(onRemove.calledOnce).to.equal(true);
  });

});

// Full DOM Rendering
// https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
describe('Full DOM Rendering', () => {

    it('should not trigger props.search when props.query.lengths < props.minCharacters', () => {
      const search = sinon.spy();
      let results = [];
      const wrapper = mount(<SmartSearch search={search} query='' results={results} />);
      expect(wrapper.props().query).to.equal('');
      wrapper.setProps({ query: 'se' });
      expect(wrapper.props().query).to.equal('se');
      expect(search.called).to.equal(false);
    });

    it('should trigger props.search when props.query.length >= props.minCharacters', () => {
      const search = sinon.spy();
      let results = [];
      const wrapper = mount(<SmartSearch search={search} query='' results={results} />);
      expect(wrapper.props().query).to.equal('');
      wrapper.setProps({ query: 'search' });
      expect(wrapper.props().query).to.equal('search');
      expect(search.calledOnce).to.equal(true);
    });

    it('should not trigger props.search when searching for a cached query', () => {
      const search = sinon.spy();
      let noresults = [];
      let results = [
        {
          'key': 'Best Results',
          'label': 'Best Results',
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
          'key': 'Worst Results',
          'label': 'Worst Results',
          'items': [
            {
              'name': 'Dumb',
              'id': '3'
            },
            {
              'name': 'Stupid',
              'id': '5'
            }
          ]

        }
      ];
      const wrapper = mount(<SmartSearch search={search} query='' results={noresults} />);
      expect(wrapper.props().query).to.equal('');

      wrapper.setProps({ query: 'search', results:results });
      expect(wrapper.props().query).to.equal('search');
/*
      wrapper.setProps({ query: 'se', results: noresults });
      expect(wrapper.props().query).to.equal('se');
      wrapper.setProps({ query: 'search', results: results });
      expect(wrapper.props().query).to.equal('search');
*/
      expect(search.callCount).to.equal(1);
    });

});
