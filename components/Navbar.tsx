import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex items-center border h-12">
      <Link href="/planets">
        <a className="mx-6 p-2">Planets</a>
      </Link>
      <Link href="/people">
        <a>People</a>
      </Link>
    </nav>
  );
};

export default Navbar;
