
function Header({ children }) {
  return (
    <header className={`h-[4.6rem] w-full flex flex-row px-4 items-center `}>
      {children}
      </header>
  );
}

export default Header;