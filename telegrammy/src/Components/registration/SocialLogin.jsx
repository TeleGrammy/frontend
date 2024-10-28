import React, { useEffect, useState } from 'react';
import googleIcon from '../../assets/google.png';
import facebookIcon from '../../assets/facebook.png';
import githubIcon from '../../assets/github.png';
import ImagedButton from '../Shared/ImagedButton';

const images = [
  {
    icon: googleIcon,
    alt: 'Google',
    onClick: async (setData) => {
      const GOOGLE_URL = 'http://localhost:8080/api/v1/auth/google';
      const popup = window.open(GOOGLE_URL, '_blank', 'width=500,height=600');
      window.addEventListener('message', (event) => {
        if (event.origin === 'http://localhost:8080') {
          const { data } = event;
          if (data && data.status === 'Logged in successfully with Google') {
            console.log(data);
            setData(data);
          }
        }
      });
    },
  },
  { icon: facebookIcon, alt: 'Facebook', onClick: () => {} },
  { icon: githubIcon, alt: 'Github', onClick: () => {} },
];

const SocialLogin = () => {
  const [data, setData] = useState(null);
  return (
    <>
      {/* Social Login */}
      <div className="mt-6 flex items-center justify-center">
        <hr className="w-full border-gray-300" />
        <span className="mx-4 text-gray-500">OR</span>
        <hr className="w-full border-gray-300" />
      </div>
      <div className="mt-4 flex justify-between space-x-4">
        {images.map((el, idx) => (
          <ImagedButton
            icon={el.icon}
            alt={el.alt}
            key={idx}
            onClick={() => el.onClick(setData)}
          />
        ))}
      </div>
    </>
  );
};

export default SocialLogin;
