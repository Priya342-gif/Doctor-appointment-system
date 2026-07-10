import React, { useEffect, useState, useCallback } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import DoctorCard from '../../components/doctors/DoctorCard';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import { getDoctorsAPI, getSpecializationsAPI } from '../../services/doctorService';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';

const Doctors = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    specialization: searchParams.get('specialization') || '',
    minFee: '', maxFee: '', minExp: '', availability: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchDoctors = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 9, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const res = await getDoctorsAPI(params);
      setDoctors(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { getSpecializationsAPI().then((r) => setSpecializations(r.data.data)); }, []);
  useEffect(() => { fetchDoctors(1); }, [fetchDoctors]);

  const updateFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));
  const clearFilters = () => setFilters({ search: '', specialization: '', minFee: '', maxFee: '', minExp: '', availability: '' });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">Find Your Doctor</h1>
          <p className="text-blue-100 mb-6">Search from {pagination.total}+ verified specialists</p>
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDoctors(1)}
              placeholder="Search by name or specialization..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none"
            />
            <button onClick={() => fetchDoctors(1)} className="bg-white text-blue-600 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50">
              <FiSearch size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Filters</h3>
                <button onClick={clearFilters} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                  <FiX size={14} /> Clear
                </button>
              </div>

              {/* Specialization */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <select value={filters.specialization} onChange={(e) => updateFilter('specialization', e.target.value)} className="input-field text-sm">
                  <option value="">All</option>
                  {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Fee Range */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee ($)</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minFee} onChange={(e) => updateFilter('minFee', e.target.value)} className="input-field text-sm w-1/2" />
                  <input type="number" placeholder="Max" value={filters.maxFee} onChange={(e) => updateFilter('maxFee', e.target.value)} className="input-field text-sm w-1/2" />
                </div>
              </div>

              {/* Experience */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Experience (yrs)</label>
                <input type="number" placeholder="e.g. 5" value={filters.minExp} onChange={(e) => updateFilter('minExp', e.target.value)} className="input-field text-sm" />
              </div>

              {/* Availability */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Day</label>
                <select value={filters.availability} onChange={(e) => updateFilter('availability', e.target.value)} className="input-field text-sm">
                  <option value="">Any Day</option>
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <button onClick={() => { fetchDoctors(1); setShowFilters(false); }} className="btn-primary w-full text-sm">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-600 text-sm">{pagination.total} doctors found</p>
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-secondary text-sm flex items-center gap-2">
                <FiFilter size={16} /> Filters
              </button>
            </div>

            {loading ? <Spinner /> : doctors.length === 0 ? (
              <div className="text-center py-16">
                <FiSearch className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 text-lg">No doctors found</p>
                <button onClick={clearFilters} className="btn-primary mt-4 text-sm">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {doctors.map((doc) => <DoctorCard key={doc._id} doctor={doc} />)}
                </div>
                <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={fetchDoctors} />
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Doctors;
