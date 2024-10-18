import React from "react";
import googleIcon from "../../assets/google.png";
import facebookIcon from "../../assets/facebook.png";
import githubIcon from "../../assets/github.png";
import ImagedButton from "../Shared/ImagedButton";

const images = [
  { icon: googleIcon, alt: "Google" },
  { icon: facebookIcon, alt: "Facebook" },
  { icon: githubIcon, alt: "Github" },
];

const SocialLogin = () => {
  return (
    <>
      {/* Social Login */}
      <div className="mt-6 flex items-center justify-center">
        <hr className="w-full border-gray-300" />
        <span className="text-gray-500 mx-4">OR</span>
        <hr className="w-full border-gray-300" />
      </div>
      <div className="mt-4 flex justify-between space-x-4">
        {images.map((el, idx) => (
          <ImagedButton icon={el.icon} alt={el.alt} key={idx} />
        ))}
      </div>
    </>
  );
};

export default SocialLogin;
