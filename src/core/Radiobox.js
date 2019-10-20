import React, {useState, useEffect, Fragment} from 'react';

const Radiobox = ({prices}) => {
  const [value, setValue] = useState(0);

  const handleChange = () => {};

  return prices.map((p, idx) => (
    <div key={idx}>
      <input
        onChange={handleChange()}
        value={`${p._id}`}
        type="radio"
        className="mr-2 ml-4"
      />
      <label className="form-check-label">{p.name}</label>
    </div>
  ));
};

export default Radiobox;
