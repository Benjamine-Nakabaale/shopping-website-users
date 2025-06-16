import {useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { Search} from 'lucide-react';


export default function Searching() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/Home?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
        <form onSubmit={handleSearch} className="flex items-center  justify-center sm:justify-end md:max-w-md lg:max-w-lg mx-auto md:mx-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="px-auto py-2 rounded-l-md border-none text-gray-900 focus:ring-0"
          />
          <button type="submit" className="bg-primary-light text-primary px-3 py-2 rounded-r-md">
            <Search size={16} />
          </button>
        </form>

  );
}