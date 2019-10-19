import {API} from '../config';


export const createCategory = (userId, token, category) => {
  //console.log(name, email, password);
  return fetch(`${API}/category/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(category),
  })
    .then(res => {
      return res.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const signin = user => {
  //console.log(name, email, password);
  return fetch(`${API}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then(res => {
      return res.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const authenticate = (data, next) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(data));
    next();
  }
};

export const signout = (next) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
    next();
    return fetch(`${API}/signout`, {
      method: 'GET'
    })
    .then(res => {
      console.log('signout', res);
    })
    .catch(err => {
      console.log(err);
    })
  }
};


export const isAuthenticated = () => {
  if(typeof window == 'undefined') {
    return false;
  }
  if (localStorage.getItem('jwt')) {
    return JSON.parse(localStorage.getItem('jwt'));
  } else {
    return false;
  }
};
