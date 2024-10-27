import React from 'react';
import googleIcon from '../../assets/google.png';
import facebookIcon from '../../assets/facebook.png';
import githubIcon from '../../assets/github.png';
import ImagedButton from '../Shared/ImagedButton';

const images = [
  {
    icon: googleIcon,
    alt: 'Google',
    onClick: async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/v1/auth/google',
          {
            credentials: 'include',
          },
        );
      } catch (error) {
        console.error('Error:', error);
      }
      // fetch('http://localhost:8080/api/v1/auth/google').then((res) => {
      //   console.log('Google login response:', res);
      // });
    },
  },
  { icon: facebookIcon, alt: 'Facebook', onClick: () => {} },
  { icon: githubIcon, alt: 'Github', onClick: () => {} },
];

const SocialLogin = () => {
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
            onClick={el.onClick}
          />
        ))}
      </div>
    </>
  );
};

export default SocialLogin;
