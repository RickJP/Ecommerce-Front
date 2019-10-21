import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {getProducts} from './apiCore';
import Card from './Card';
import { isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';


const Checkout = ({products}) => {
  const getTotal = () => {
    return products.reduce((currentVal, nextVal) => {
      return currentVal + nextVal.count * nextVal.price;
    }, 0);
  }

  const showCheckout = () => {
    return isAuthenticated() ? (
      <button className="btn btn-success">Checkout</button>
      )
      : (
        <Link to="/signin"><button className="btn btn-primary">Sign in to checkout</button></Link>
      )
    
  }

  return (
    <div>
      <h2>Total: ${getTotal().toFixed(2)}</h2>

      {showCheckout()}
    </div>
  )
}

export default Checkout;