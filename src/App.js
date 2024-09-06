import React, { useState } from 'react';

const ImgBBUpload = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) return;
  
    const formData = new FormData();
    formData.append('image', image);
  
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Client-ID 417c44719e7cb67ac57504818c6d106e`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setImageUrl(data.data.url);
      } else {
        setError(data.data.error);
      }
    } catch (err) {
      setError('Error uploading image');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ padding: '20px' }}>
      <h1>ImgBB Image Upload</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '500px', maxHeight: '500px' }} />
        </div>
      )}
    </div>
  );
};

export default ImgBBUpload;
