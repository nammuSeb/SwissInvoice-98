import React from 'react';

interface RemarksFieldProps {
    remarks: string;
    setRemarks: (remarks: string) => void;
}

const RemarksField: React.FC<RemarksFieldProps> = ({ remarks, setRemarks }) => {
    return (
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarques pour le client
            </label>
            <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full h-32 p-2 border rounded-md focus:ring-primary focus:border-primary"
                placeholder="Ajoutez vos remarques ici..."
            />
        </div>
    );
};

export default RemarksField;
