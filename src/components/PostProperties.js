import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function PostProperty() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [nearby, setNearby] = useState('');
  const navigate = useNavigate();

  const handlePostProperty = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to post a property');
      return;
    }

    try {
      await addDoc(collection(firestore, 'properties'), {
        title,
        location,
        area,
        bedrooms,
        bathrooms,
        nearby,
        sellerEmail: user.email,
        sellerId: user.uid
      });
      navigate('/home');
    } catch (error) {
      console.error('Error posting property:', error);
    }
  };

  return (
    <div>
      <h2>Post Property</h2>
      <form onSubmit={handlePostProperty}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
        <input
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Area (sq. ft.)"
          required
        />
        <input
          type="number"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          placeholder="Bedrooms"
          required
        />
        <input
          type="number"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          placeholder="Bathrooms"
          required
        />
        <textarea
          value={nearby}
          onChange={(e) => setNearby(e.target.value)}
          placeholder="Nearby (hospitals, colleges, etc.)"
          required
        ></textarea>
        <button type="submit">Post Property</button>
      </form>
    </div>
  );
}

export default PostProperty;
