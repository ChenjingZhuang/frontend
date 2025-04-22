import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DogFacts = () => {
  const [dogFacts, setDogFacts] = useState([]);

  useEffect(() => {
    const fetchDogFacts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/dog-facts');
        setDogFacts(response.data.facts);
      } catch (error) {
        console.error('Error fetching dog facts:', error);
      }
    };

    fetchDogFacts();
  }, []);

  return (
    <div className="dog-facts-container">
      <ul>
        {dogFacts.map((fact, index) => (
          <li key={index}>
            <Link to={`/dog-fact/${index}`}>{fact}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DogFacts;
