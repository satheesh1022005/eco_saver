import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './eproducts.css'
import Navbot from './Nav3';
const products = [
    {
      id: 1,
      name: 'Refrigerator',
      powerRating: '200W',
      img: 'https://th.bing.com/th?id=OIP.UYdGVIcoHm1_h_vPHzGwlAHaIC&w=239&h=260&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2',
    },
    {
      id: 2,
      name: 'Washing Machine',
      powerRating: '1200W',
      img: 'https://th.bing.com/th/id/OIP.X_FAXSDLxoTApRSvTBrCkgHaHa?rs=1&pid=ImgDetMain', // Replace with your image path
    },
    {
      id: 3,
      name: 'Television',
      powerRating: '100W',
      img: 'https://th.bing.com/th?id=OIP.c41oURuONapufZfM7ep23AHaHa&w=250&h=250&c=8&rs=1&qlt=30&o=6&dpr=1.6&pid=3.1&rm=2', // Replace with your image path
    },
    {
      id: 4,
      name: 'Microwave',
      powerRating: '800W',
      img: 'https://th.bing.com/th?id=OIP.GxwvPsNaibCnVEhZQiPQOAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2', // Replace with your image path
    },
    {
      id: 5,
      name: 'Toaster',
      powerRating: '1200W',
      img: 'data:image/jpeg;base64,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', // Replace with your image path
    },
    {
      id: 6,
      name: 'Coffee Maker',
      powerRating: '1000W',
      img: 'https://th.bing.com/th?id=OIP.scdCknKy-X8qRIpKv5cRoAAAAA&w=256&h=243&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2', // Replace with your image path
    },
    {
      id: 7,
      name: 'Vacuum Cleaner',
      powerRating: '1500W',
      img: 'path/to/vacuumCleaner.jpg', // Replace with your image path
    },
    {
      id: 8,
      name: 'Hair Dryer',
      powerRating: '1800W',
      img: 'https://th.bing.com/th/id/OIP.ejTJpqv7rFAd-TCboXFWbQHaHp?rs=1&pid=ImgDetMain', // Replace with your image path
    },
    {
      id: 9,
      name: 'Electric Kettle',
      powerRating: '1500W',
      img: 'https://th.bing.com/th/id/OIP.MvIWPJOr8ZfSUycI9EQeiwHaIN?w=177&h=196&c=7&r=0&o=5&dpr=1.6&pid=1.7', // Replace with your image path
    },
    {
      id: 10,
      name: 'Iron',
      powerRating: '1200W',
      img: 'https://th.bing.com/th?id=OIP.fIA1UQ5pVh0t3kiaIeaVZQHaHa&w=250&h=250&c=8&rs=1&qlt=30&o=6&dpr=1.6&pid=3.1&rm=2', // Replace with your image path
    },
    {
      id: 11,
      name: 'Air Conditioner',
      powerRating: '1500W',
      img: 'https://th.bing.com/th/id/OIP.a6F8aKvyHl9IHe66s0auRwHaFj?rs=1&pid=ImgDetMain', // Replace with your image path
    },
    {
      id: 12,
      name: 'Ceiling Fan',
      powerRating: '60W',
      img: 'https://th.bing.com/th/id/OIP.2a_ncN-AGGHNI15YyFhs9QHaE6?rs=1&pid=ImgDetMain', // Replace with your image path
    },
    {
      id: 13,
      name: 'Dishwasher',
      powerRating: '1800W',
      img: 'https://www.bing.com/th?id=OIP.-tXE6HzF4qmCMl-e9f2FeAHaG-&w=150&h=141&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2', // Replace with your image path
    },
    {
      id: 14,
      name: 'Food Processor',
      powerRating: '750W',
      img: 'https://th.bing.com/th?id=OIP.6EiiwVtq5BA2KKA_Cgv8-QHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2', // Replace with your image path
    },
    {
      id: 15,
      name: 'Blender',
      powerRating: '500W',
      img: 'https://th.bing.com/th/id/OIP.agUO4vRQMrAJOGIWVpK5xAAAAA?rs=1&pid=ImgDetMain', // Replace with your image path
    },
    {
      id: 16,
      name: 'Stand Mixer',
      powerRating: '1000W',
      img: 'https://th.bing.com/th/id/OIP.6UquJvwRXTUkmu0HLJuXwQHaGk?rs=1&pid=ImgDetMain', // Replace with your image path
    },
    {
      id: 17,
      name: 'Electric Grill',
      powerRating: '2000W',
      img: 'https://th.bing.com/th?id=OIP.p3fhdZLKsLkaLO9Vy88t8gHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2', // Replace with your image path
    },
    {
      id: 18,
      name: 'Rice Cooker',
      powerRating: '700W',
      img: 'https://th.bing.com/th?id=OIP.XWRqaUhtBQFEvrTzoPRU0QHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2', // Replace with your image path
    },
    {
      id: 19,
      name: 'Toaster Oven',
      powerRating: '15',
      img:'https://th.bing.com/th?id=OIP.IQAE5zqYHqmOyWv1K1FCiQHaHt&w=244&h=255&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2',
    },
  // Add more products as needed
];

function Eproduct() {
  return (
    <div className="product-container">
      {products.map((product) => (
        <div key={product.id} className="product">
          <img src={product.img} alt='led light' width="100px" height="100px" className='p-1'/>
          <div className='product-info'>
            <div>{product.name}</div>
            <div>Power rating: {product.powerRating}</div>
            <div>Saving: {product.saving}</div>
          </div>
        </div>
      ))}
      <Navbot/>
    </div>
  );
}

export default Eproduct;
