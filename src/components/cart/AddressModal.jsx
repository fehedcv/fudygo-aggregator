import { X, Loader2, MapPin, Home, Briefcase, Plus, CheckCircle2 } from 'lucide-react';

const AddressModal = ({ isOpen, onClose, addresses, loading, selectedId, onSelect }) => {
  if (!isOpen) return null;

  const getIcon = (type) => {
    const t = type?.toLowerCase();
    if (t === 'home') return <Home className="w-5 h-5" />;
    if (t === 'work') return <Briefcase className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-lg text-gray-900">Select Address</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <MapPin className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p>No saved addresses found.</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => onSelect(addr)}
                className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between group transition-all ${selectedId === addr.id ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-gray-200 hover:border-red-300 hover:shadow-md bg-white'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedId === addr.id ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600'}`}>
                    {getIcon(addr.label)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm capitalize ${selectedId === addr.id ? 'text-red-900' : 'text-gray-800'}`}>
                      {addr.label}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {addr.formatted_address || addr.address}
                    </p>
                  </div>
                </div>
                {selectedId === addr.id && (
                  <div className="text-red-600 bg-white rounded-full p-1 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 fill-red-600 text-white" />
                  </div>
                )}
              </div>
            ))
          )}

          <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-semibold hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all group">
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Add New Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;