// Learning.js
import React from 'react';
import './learning.css';
import Navbot from './Nav3';

const videos = [
  'https://www.youtube.com/embed/ab6JgYYBOVI?si=9jxTF35K3921KP6N',
  'https://www.youtube.com/embed/IKemEsPKwpA?si=yWW_xAcHSTJXYq8B',
  'https://www.youtube.com/embed/tgnOaBnxUKw?si=UBNcsyamyvhfWBMD',
  'https://www.youtube.com/embed/wgGfx_4W0L4?si=PtMEtMRV7hHz-G5t',
  'https://www.youtube.com/embed/o_F6AzZ5dcc?si=d7ElZpRkPw_fbQD5',
  'https://www.youtube.com/embed/e0hBueaqXN8?si=Om4GsHc-kmucBZVM',
];

function Learning() {
  return (
    <>
      <nav className='navbar navbar-expand-lg bg-dark '>
        <div className='navbar-brand'>
          <h4 className='text-white p-1'>Learning</h4>
        </div>
      </nav>
      <div className='container-fluid row m-0 p-0'>
        {videos.map((video, index) => (
          <div key={index} className='v1 col-12 col-md-6'>
            <a href={video}>
              <div className='v2'>
                <iframe
                  title={`YouTube video ${index + 1}`}
                  height='150'
                  width='100%'
                  src={video}
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                ></iframe>
              </div>
            </a>
          </div>
        ))}
      </div>
      <Navbot />
    </>
  );
}

export default Learning;
