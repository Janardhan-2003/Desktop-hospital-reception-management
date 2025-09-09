import { Plus } from 'lucide-react';

const Navbar = ({ onAddPatient }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H+</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Patient Management System
          </h1>
        </div>
        
        <button
          onClick={onAddPatient}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={18} />
          <span>Add New Patient</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;