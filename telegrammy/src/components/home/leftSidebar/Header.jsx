
function Header({ className, children }) {
  return (
    <header className={` h-[4rem] w-full flex flex-row px-4 items-center ${className} `}>
      {children}
      </header>
  );
}

export default Header;