import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { getPatientsAPI, deleteUserAPI, toggleUserStatusAPI } from '../../services/adminService';
import { toast } from 'react-toastify';
import { FiGrid, FiCalendar, FiUserCheck, FiSearch, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { FaUserMd, FaUserInjured } from 'react-icons/fa';

const navItems = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/doctors', icon: FaUserMd, label: 'Doctors' },
  { to: '/admin/patients', icon: FaUserInjured, label: 'Patients' },
  { to: '/admin/appointments', icon: FiCalendar, label: 'Appointments' },
  { to: '/admin/add-doctor', icon: FiUserCheck, label: 'Add Doctor' },
];

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPatients = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getPatientsAPI({ page, limit: 10, search });
      setPatients(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(1); }, [search]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUserAPI(selected._id);
      toast.success('Patient deleted');
      setDeleteModal(false);
      fetchPatients(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleUserStatusAPI(id);
      toast.success(res.data.message);
      fetchPatients(pagination.page);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Patients Management">
      <div className="flex items-center justify-between mb-5">
        <div className="relative w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients..." className="input-field pl-9 text-sm" />
        </div>
        <span className="text-gray-500 text-sm">{pagination.total} patients</span>
      </div>

      {loading ? <Spinner /> : patients.length === 0 ? (
        <div className="card text-center py-16">
          <FaUserInjured className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-gray-500 border-b text-left">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Age / Gender</th>
                  <th className="pb-3 font-medium">Address</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'P')}&background=10b981&color=fff`}
                          alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{p.phone || '—'}</td>
                    <td className="py-3 text-gray-600">{p.age || '—'} / {p.gender || '—'}</td>
                    <td className="py-3 text-gray-500 text-xs max-w-[120px] truncate">{p.address || '—'}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleToggle(p._id)} className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100" title="Toggle Status">
                          {p.isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                        </button>
                        <button onClick={() => { setSelected(p); setDeleteModal(true); }} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={fetchPatients} />
        </>
      )}

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Patient" size="sm">
        <p className="text-gray-600 mb-5">Delete patient <strong>{selected?.name}</strong>? This cannot be undone.</p>
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

export default AdminPatients;
