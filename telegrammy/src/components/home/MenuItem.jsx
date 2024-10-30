import { Link } from "react-router-dom";


function MenuItem({ onClick, link, children }) {
    return (
        <li className="hover:bg-bg-hover w-full mx-2 px-2 rounded-2xl">
          <Link onClick={onClick} to={link} className="text-text-primary hover:text-gray-300 flex flex-row items-center">
            {children}
          </Link>
        </li>
    )
}

export default MenuItem;
