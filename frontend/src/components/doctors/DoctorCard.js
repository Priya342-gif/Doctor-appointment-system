import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';

const DoctorCard = ({ doctor }) => {
  const { user, specialization, experience, consultationFee, hospitalName, availableDays, rating } = doctor;

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Dr')}&background=3b82f6&color=fff&size=80`}
          alt={user?.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-50"
        />
        <div className="min-w-0">
          <h3 className="font-bold text-gray-800 truncate">{user?.name}</h3>
          <p className="text-blue-600 text-sm font-medium">{specialization}</p>
          <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
            <FiStar className="fill-current" />
            <span className="font-medium">{rating?.toFixed(1) || '4.8'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 flex-1">
        <div className="flex items-center gap-2">
          <FiClock className="text-blue-500 shrink-0" />
          <span>{experience} years experience</span>
        </div>
        <div className="flex items-center gap-2">
          <FiDollarSign className="text-green-500 shrink-0" />
          <span>Consultation fee: ${consultationFee}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin className="text-red-400 shrink-0" />
          <span className="truncate">{hospitalName}</span>
        </div>
      </div>

      {availableDays?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {availableDays.slice(0, 3).map((day) => (
            <span key={day} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{day.slice(0, 3)}</span>
          ))}
          {availableDays.length > 3 && <span className="text-xs text-gray-400">+{availableDays.length - 3}</span>}
        </div>
      )}

      <Link
        to={`/doctors/${doctor._id}`}
        className="mt-4 btn-primary text-center text-sm block"
      >
        View Profile
      </Link>
    </div>
  );
};

export default DoctorCard;
