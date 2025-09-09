import { X, User, Calendar, Phone, MapPin, UserCheck } from 'lucide-react';

const ViewPatientModal = ({ isOpen, onClose, patient }) => {
  if (!isOpen || !patient) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-3 py-2">
      <Icon className="text-blue-600 w-4 h-4" />
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700">{label}:</span>
        <span className="text-sm text-gray-900 ml-2">{value || '-'}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <User className="text-blue-600 w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-800">Patient Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
            <p className="text-sm text-gray-600">Patient ID: {patient.ipNo}</p>
          </div>

          <div className="space-y-1">
            <InfoRow 
              icon={Calendar}
              label="Date"
              value={formatDate(patient.date)}
            />
            
            <InfoRow 
              icon={User}
              label="Serial Number"
              value={patient.sNo}
            />
            
            <InfoRow 
              icon={User}
              label="Age"
              value={patient.age}
            />
            
            <InfoRow 
              icon={Phone}
              label="Phone"
              value={patient.phone}
            />
            
            <InfoRow 
              icon={MapPin}
              label="Place"
              value={patient.place}
            />
            
            <div className="border-t border-gray-200 pt-3 mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Referral Information</h4>
              
              <InfoRow 
                icon={UserCheck}
                label="Referral Name"
                value={patient.referralName}
              />
              
              <InfoRow 
                icon={Phone}
                label="Referral Phone"
                value={patient.referralPhone}
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatientModal;