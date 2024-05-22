// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import {  query, where } from 'firebase/firestore';
import { auth, firestore, functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useLogout from './Logout';

function Home() {
  const [properties, setProperties] = useState([]);
  const user = auth.currentUser;
  const navigate = useNavigate(); // Use useNavigate hook
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    // Additional logic after logout if needed
  };
  useEffect(() => {
    const q = query(collection(firestore, 'properties'), where('sellerEmail', '!=', auth.currentUser.   email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const propertiesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProperties(propertiesList);
    });
  
    return () => unsubscribe();
  }, []);
  
  const handleInterested = async (property) => {
    if (!user) return; // Only allow logged-in users to show interest

    const sendInterestEmail = httpsCallable(functions, 'sendInterestEmail');
    try {
      await sendInterestEmail({
        sellerEmail: property.sellerEmail,
        buyerEmail: user.email,
        propertyTitle: property.title,
        propertyLocation: property.location,
      });
      alert('Interest email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
    }
  };

  const handleLike = async (propertyId) => {
    if (!user) return; // Only allow logged-in users to like properties

    const propertyRef = doc(firestore, 'properties', propertyId);
    const property = properties.find((p) => p.id === propertyId);

    if (!property) {
      console.error('Property not found');
      return;
    }

    const likes = property.likes || []; // Ensure likes array exists

    if (likes.includes(user.uid)) {
      await updateDoc(propertyRef, {
        likes: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(propertyRef, {
        likes: arrayUnion(user.uid),
      });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Rental Properties</h2>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => navigate('/SellerPage')}>Sell?</button>
      </div>
      <div>
        {properties.length === 0 ? (
          <p>No properties available</p>
        ) : (
          properties
            .filter((property) => property.userId !== user?.uid) // Exclude properties posted by the current user
            .map((property) => (
              <div key={property.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                <h3>{property.title}</h3>
                <p>Location: {property.location}</p>
                <p>Area: {property.area} sq. ft.</p>
                <p>Bedrooms: {property.bedrooms}</p>
                <p>Bathrooms: {property.bathrooms}</p>
                <p>Nearby: {property.nearby}</p>
                <p>Likes: {property.likes?.length || 0}</p>
                <button onClick={() => handleLike(property.id)}>
                  {property.likes?.includes(user.uid) ? 'Unlike' : 'Like'}
                </button>
                <button onClick={() => handleInterested(property)}>I'm Interested</button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Home;
