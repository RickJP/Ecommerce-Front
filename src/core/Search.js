import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {getCategories, list} from './apiCore.js';
import Card from './Card';

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    results: [],
    searched: false,
  });

  const {categories, category, search, results, searched} = data;

  const loadCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({...data, categories: data});
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const searchData = () => {
    //console.log(search, category);
    if (search) {
      list({search: search || undefined, category: category}).then(res => {
        if (res.error) {
          console.log(res.error);
        } else {
          setData({...data, results: res, searched: true});
        }
      });
    }
  };

  const searchSubmit = e => {
    e.preventDefault();
    searchData();
  };

  const handleChange = name => e => {
    setData({...data, [name]: e.target.value, searched: false});
  };


  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`
    }
    if (searched && results.length < 1) {
      return `No products found`
    }
  }

  const searchedProducts = (results = []) => {
    return (
      <div>
        <h2 className="mt-4 mb-4">
          {searchMessage(searched, results)}
        </h2>
        <div className="row">
          {results.map((prod, idx) => (
            <Card key={idx} product={prod} />
          ))}
        </div>
      </div>
    );
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <select className="btn mr-2" onChange={handleChange('category')}>
              <option value="All">All</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {/*  input-group-prepend */}
          <input
            type="search"
            className="form-control"
            onChange={handleChange('search')}
            placeholder="Search by name"
          />
        </div>{' '}
        {/* input-group-lg */}
        <div className="btn input-group-append" style={{border: 'none'}}>
          <button className="input-group-text">Search</button>
        </div>
      </span>
      {/* input-group-text  */}
    </form>
  );

  return (
    <div className="row">
      <div className="container mb-3">{searchForm()}</div>
      <div className="container fluid mb-3">{searchedProducts(results)}</div>
    </div>
  );
};

export default Search;
