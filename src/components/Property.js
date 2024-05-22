import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore, auth } from '../firebase';

const Property = ({ property }) => {
  const [isLiked, setIsLiked] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setIsLiked(property.likes.includes(user.uid));
    }
  }, [property.likes, user]);

  const handleLike = async () => {
    const propertyRef = doc(firestore, 'properties', property.id);
    if (isLiked) {
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
      <h3>{property.title}</h3>
      <p>{property.description}</p>
      <p>Likes: {property.likes.length}</p>
      <button onClick={handleLike}>
        {isLiked ? 'Unlike' : 'Like'}
      </button>
    </div>
  );
};

export default Property;
