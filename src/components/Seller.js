import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, getDocs, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import {  query, where } from 'firebase/firestore';
function SellerPage() {
  const [properties, setProperties] = useState([]);
  const [editableProperty, setEditableProperty] = useState(null);

  useEffect(() => {
    const q = query(collection(firestore, 'properties'), where('sellerEmail', '===', auth.currentUser.   email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const propertiesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProperties(propertiesList);
    });
  
    return () => unsubscribe();
  }, []);

  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      await deleteDoc(doc(firestore, 'properties', propertyId));
      console.log('Property deleted successfully!');
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleSave = async () => {
    try {
      const propertyRef = doc(firestore, 'properties', editableProperty.id);
      await updateDoc(propertyRef, editableProperty);
      console.log('Property updated successfully!');
      setEditableProperty(null);
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleEdit = (property) => {
    setEditableProperty(property);
  };

  const handleInputChange = (e, field) => {
    setEditableProperty({
      ...editableProperty,
      [field]: e.target.value
    });
  };

  return (
    <div>
      <h2>Your Properties</h2>
      <Link to="/PostProperty">Post New Property</Link>
      <div>
        {properties.map(property => (
          <div key={property.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            {editableProperty && editableProperty.id === property.id ? (
              <div>
                <div>
                  <label>Title: </label>
                  <input type="text" value={editableProperty.title} onChange={(e) => handleInputChange(e, 'title')} />
                </div>
                <div>
                  <label>Location: </label>
                  <input type="text" value={editableProperty.location} onChange={(e) => handleInputChange(e, 'location')} />
                </div>
                <div>
                  <label>Area (sq. ft.): </label>
                  <input type="number" value={editableProperty.area} onChange={(e) => handleInputChange(e, 'area')} />
                </div>
                <div>
                  <label>Bedrooms: </label>
                  <input type="number" value={editableProperty.bedrooms} onChange={(e) => handleInputChange(e, 'bedrooms')} />
                </div>
                <div>
                  <label>Bathrooms: </label>
                  <input type="number" value={editableProperty.bathrooms} onChange={(e) => handleInputChange(e, 'bathrooms')} />
                </div>
                <div>
                  <label>Nearby: </label>
                  <textarea value={editableProperty.nearby} onChange={(e) => handleInputChange(e, 'nearby')}></textarea>
                </div>
                <button onClick={handleSave}>Save</button>
              </div>
            ) : (
              <div>
                <h3>{property.title}</h3>
                <p>Location: {property.location}</p>
                <p>Area: {property.area} sq. ft.</p>
                <p>Bedrooms: {property.bedrooms}</p>
                <p>Bathrooms: {property.bathrooms}</p>
                <p>Nearby: {property.nearby}</p>
                <button onClick={() => handleEdit(property)}>Edit</button>
                <button onClick={() => handleDelete(property.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerPage;
