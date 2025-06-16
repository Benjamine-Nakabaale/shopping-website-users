import Header from './Header';

export default function Layout({ children }) {
  console.log('Layout.jsx: Rendering with children');
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-4">{children}</main>
    </div>
  );
}