import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const DogFactDetail = ({ facts }) => {
  const { factId } = useParams();
  const fact = facts[factId];

  return (
    <div className="dog-fact-detail">
      <h2>Dog Fact Detail</h2>
      <p>{fact}</p>
      <Link to="/">Back to the list</Link>
    </div>
  );
};

export default DogFactDetail;
