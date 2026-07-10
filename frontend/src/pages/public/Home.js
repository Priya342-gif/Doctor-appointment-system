import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import DoctorCard from '../../components/doctors/DoctorCard';
import { getDoctorsAPI, getSpecializationsAPI } from '../../services/doctorService';
import Spinner from '../../components/common/Spinner';
import { FiSearch, FiShield, FiClock, FiAward, FiUsers } from 'react-icons/fi';
import { FaHeartbeat, FaStethoscope, FaBrain, FaBone, FaAllergies, FaChild } from 'react-icons/fa';

const specialtyIcons = { Cardiologist: FaHeartbeat, Neurologist: FaBrain, Dermatologist: FaAllergies, Orthopedic: FaBone, Pediatrician: FaChild, Psychiatrist: FaStethoscope };

const stats = [
  { label: 'Expert Doctors', value: '500+', icon: FiUsers },
  { label: 'Happy Patients', value: '50K+', icon: FaHeartbeat },
  { label: 'Specializations', value: '30+', icon: FaStethoscope },
  { label: 'Years Experience', value: '15+', icon: FiAward },
];

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([getDoctorsAPI({ limit: 6 }), getSpecializationsAPI()])
      .then(([dRes, sRes]) => {
        setDoctors(dRes.data.data);
        setSpecializations(sRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bg-blue-500 bg-opacity-30 text-blue-100 text-sm px-3 py-1 rounded-full inline-block mb-4">
              #1 Doctor Appointment Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Book Doctor Appointments <span className="text-blue-200">Instantly</span>
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Connect with top-rated specialists. Schedule appointments online and get the care you deserve, whenever you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors, specializations..."
                className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Link
                to={`/doctors?search=${search}`}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center"
              >
                <FiSearch /> Search
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Cardiology', 'Neurology', 'Dermatology'].map((s) => (
                <Link key={s} to={`/doctors?specialization=${s}`} className="bg-blue-500 bg-opacity-30 hover:bg-opacity-50 text-white text-sm px-3 py-1 rounded-full transition-colors">
                  {s}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-blue-500 bg-opacity-30 rounded-full flex items-center justify-center">
                <div className="w-60 h-60 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                  <FaHeartbeat className="text-white text-8xl opacity-80" />
                </div>
              </div>
              {[
                { icon: FiShield, label: 'Verified Doctors', top: '10%', left: '-5%' },
                { icon: FiClock, label: '24/7 Available', top: '10%', right: '-5%' },
                { icon: FiAward, label: 'Expert Care', bottom: '10%', left: '10%' },
              ].map(({ icon: Icon, label, ...pos }) => (
                <div key={label} style={pos} className="absolute bg-white rounded-xl shadow-lg p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="text-blue-600" size={16} />
                  </div>
                  <span className="text-gray-700 font-medium text-xs whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-blue-600 text-xl" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{value}</div>
                <div className="text-gray-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Our Specializations</h2>
            <p className="text-gray-500">Find doctors across all major medical specialties</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {specializations.slice(0, 6).map((spec) => {
              const Icon = specialtyIcons[spec] || FaStethoscope;
              return (
                <Link key={spec} to={`/doctors?specialization=${spec}`}
                  className="bg-white rounded-xl p-5 text-center hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                    <Icon className="text-blue-600 text-xl" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{spec}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Doctors</h2>
              <p className="text-gray-500">Meet our highly experienced specialists</p>
            </div>
            <Link to="/doctors" className="btn-primary text-sm hidden sm:block">View All</Link>
          </div>
          {loading ? <Spinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => <DoctorCard key={doc._id} doctor={doc} />)}
            </div>
          )}
          <div className="text-center mt-8 sm:hidden">
            <Link to="/doctors" className="btn-primary">View All Doctors</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Appointment?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of patients who trust DocBook for their healthcare needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">Get Started Free</Link>
            <Link to="/doctors" className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">Browse Doctors</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
