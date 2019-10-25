import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {
  getProducts,
  getBraintreeClientToken,
  processPayment,
  createOrder,
} from './apiCore';
import Card from './Card';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import {emptyCart} from './cartHelpers';

const Checkout = ({products, setRun = f => f, run = undefined}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: '',
    instance: {},
    address: '',
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then(data => {
      if (data.error) {
        setData({...data, error: data.error});
      } else {
        setData({clientToken: data.clientToken});
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const handleAddress = e => {
    setData({...data, address: e.target.value});
  };

  const getTotal = () => {
    return products.reduce((currentVal, nextVal) => {
      return currentVal + nextVal.count * nextVal.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };

  let deliveryAddress = data.address


  const buy = () => {
    setData({loading: true});
    // send the nonce to the server
    // nonce = data.instance.requestPaymentOption
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then(data => {
        nonce = data.nonce;
        // once you have nonce (card type, card no) send nonce as
        // 'paymentMethodNonce' and also total to be charged

        // console.log(`Send nonce and total to process: ${nonce}, ${getTotal()}`)
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(),
        };
        processPayment(userId, token, paymentData).then(response => {
          //setData({...data, success: res.success});
   
          // create order
          const createOrderData = {
            products: products,
            transaction_id: response.transaction_id,
            amount: response.transaction.amount,
            address: deliveryAddress,
          };

          createOrder(userId, token, createOrderData)
            .then(response => {
              console.log('ORDER DATA: ' + response);
              // empty cart
              emptyCart(() => {
                setRun(!run); // update parent state
                setData({
                  loading: false,
                  success: true,
                });
              });

              //console.log(res);
            })
            .catch(err => {
              setData({loading: false});
              console.log(err);
            });
        }).catch(err => {
          console.log(err);
          setData({ loading: false });
        });
      })
      .catch(err => {
        console.log(`dropin error ${err}`);
        setData({...data, error: err.message});
      });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({...data, error: ''})}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="form-group mb-3">
            <label className="text-muted">Deliver Address:</label>
            <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your delivery address here..."
            ></textarea>
          </div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: 'vault',
              },
            }}
            onInstance={instance => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success btn-block">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showError = error => (
    <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
      {error}
    </div>
  );

  const showLoading = loading => loading && <h2>Loading...</h2>;

  const showSuccess = success => (
    <div className="alert alert-info" style={{display: success ? '' : 'none'}}>
      Thank You! Your payment was successful
    </div>
  );

  return (
    <div>
      <h2>Total: ${getTotal().toFixed(2)}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
