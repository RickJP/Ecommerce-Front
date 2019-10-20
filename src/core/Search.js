import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {getCategories} from './apiCore.js';
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

  const searchSubmit = () => {

  };

  const handleChange = (type) => {

  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <select
              className="btn mr-2"
              onChange={() => handleChange('category')}
            >
              <option value="All">Pick Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>  {/*  input-group-prepend */}
          <input
            type="search"
            className="form-control"
            onChange={() => handleChange('search')}
            placeholder="Search by name"
          />
        </div>  {/* input-group-lg */}
        <div className="btn input-group-append" style={{border: 'none'}}>
          <button className="input-group-text">Search</button>
        </div>
      </span> 
      {/* input-group-text  */}
    </form>
  );

  return (
    <div className="row">
      <div className="container">{searchForm()}</div>
    </div>
  );
};

export default Search;
