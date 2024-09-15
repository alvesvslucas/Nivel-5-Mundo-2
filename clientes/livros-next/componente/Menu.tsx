import Link from 'next/link';

export const Menu: React.FC = () => {
  return (
    <nav className="navbar nav bg-dark justify-content-start">
      <Link className="nav-link link-light" href="/">Home</Link>
      <Link className="nav-link link-light" href="LivroLista">Catálogo</Link>
      <Link className="nav-link link-light" href="LivroDados">Novo</Link>
    </nav>
  );
};
