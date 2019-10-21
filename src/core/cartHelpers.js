export const addItem = (item, next) => {
  let cart = [];
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
    }
    cart.push({
      ...item,
      count: 1
    })

    // Remove duplicates
    // Build an array from new Set & turn it back into array using Array.from
    // so that later we can re-map it
    // New set will only allow unique values in it
    // so pass the ids of each object / product
    // If the loop tries to add the same value again, It'll get ignored
    // ...with the array of ids we got when first map() was used
    // Run map() on it again & return actual product from cart

    cart = Array.from(new Set(cart.map((p) => (p._id)))).map(id => {
      return cart.find(p => p._id === id);
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    next();
  }
}


// JSON.parse() -> to convert JSON to Object
// JSON.stringify() -> to convert Object to JSON string

