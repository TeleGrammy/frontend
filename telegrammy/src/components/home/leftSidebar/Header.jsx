import react from 'react';

function Header({ className, children }) {
  return (
    <header
      className={`flex h-[4rem] w-full flex-row items-center px-4 ${className} `}
    >
      {children}
    </header>
  );
}

export default Header;
