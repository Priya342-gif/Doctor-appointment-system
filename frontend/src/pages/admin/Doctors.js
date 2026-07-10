import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { getAdminDoctorsAPI, deleteDoctorAPI } from '../../services/adminService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiGrid, FiCalendar, FiUserCheck, FiSearch, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { FaUserMd, FaUserInjured } from 'react-icons/fa';

const navItems = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/doctors', icon: FaUserMd, label: 'Doctors' },
  { to: '/admin/patients', icon: FaUserInjured, label: 'Patients' },
  { to: '/admin/appointments', icon: FiCalendar, label: 'Appointments' },
  { to: '/admin/add-doctor', icon: FiUserCheck, label: 'Add Doctor' },
];

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDoctors = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAdminDoctorsAPI({ page, limit: 10, search });
      setDoctors(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(1); }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoctorAPI(selected._id);
      toast.success('Doctor deleted');
      setDeleteModal(false);
      fetchDoctors(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Doctors Management">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors..."
            className="input-field pl-9 text-sm"
          />
        </div>
        <Link to="/admin/add-doctor" className="btn-primary text-sm flex items-center gap-2 whitespace-nowrap">
          <FiPlus size={16} /> Add Doctor
        </Link>
      </div>

      {loading ? <Spinner /> : doctors.length === 0 ? (
        <div className="card text-center py-16">
          <FaUserMd className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No doctors found</p>
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="text-gray-500 border-b text-left">
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Specialization</th>
                  <th className="pb-3 font-medium">Hospital</th>
                  <th className="pb-3 font-medium">Experience</th>
                  <th className="pb-3 font-medium">Fee</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={doc.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.user?.name || 'Dr')}&background=3b82f6&color=fff`}
                          alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-800">{doc.user?.name}</p>
                          <p className="text-xs text-gray-500">{doc.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-blue-600 font-medium">{doc.specialization}</td>
                    <td className="py-3 text-gray-600 max-w-[150px] truncate">{doc.hospitalName}</td>
                    <td className="py-3 text-gray-600">{doc.experience} yrs</td>
                    <td className="py-3 text-gray-700">${doc.consultationFee}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link to={`/admin/add-doctor?edit=${doc._id}`} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                          <FiEdit size={16} />
                        </Link>
                        <button onClick={() => { setSelected(doc); setDeleteModal(true); }} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={fetchDoctors} />
        </>
      )}

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Doctor" size="sm">
        <p className="text-gray-600 mb-5">Delete <strong>{selected?.user?.name}</strong>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteModal(false)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminDoctors;
