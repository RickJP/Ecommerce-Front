import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {getCart} from './cartHelpers';
import Card from './Card';
import {Link} from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, [items]);

  const showItems = items => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr />
        {items.map((prod, idx) => (
          <Card
            key={idx}
            product={prod}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
          />
        ))}
      </div>
    );
  };

  const noItemsMessage = () => (
    <h2>
      Your cart is empty! <br /> <Link to="/shop">Continue Shopping</Link>{' '}
    </h2>
  );

  return (
    <Layout
      title="Shopping Cart"
      description="Manage your Cart Items - Add, Remove, Checkout or continue shopping."
      className="container-fluid"
    >
      <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>

        <div className="col-6">
          <p>show checkout options/shipping address/total/update quantity</p>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
