import React from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { FiShield, FiAward, FiHeart, FiUsers } from 'react-icons/fi';

const values = [
  { icon: FiShield, title: 'Trusted & Verified', desc: 'All doctors are thoroughly verified with proper credentials and licenses.' },
  { icon: FiAward, title: 'Excellence in Care', desc: 'We maintain the highest standards in healthcare services and patient experience.' },
  { icon: FiHeart, title: 'Patient First', desc: 'Every decision we make puts patients\' health and well-being at the center.' },
  { icon: FiUsers, title: 'Community Health', desc: 'Building a healthier community by making quality healthcare accessible to all.' },
];

const team = [
  { name: 'Dr. Sarah Williams', role: 'Chief Medical Officer', img: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=3b82f6&color=fff&size=100' },
  { name: 'James Thompson', role: 'CEO & Co-Founder', img: 'https://ui-avatars.com/api/?name=James+Thompson&background=10b981&color=fff&size=100' },
  { name: 'Dr. Maria Chen', role: 'Head of Technology', img: 'https://ui-avatars.com/api/?name=Maria+Chen&background=8b5cf6&color=fff&size=100' },
];

const About = () => (
  <PublicLayout>
    {/* Hero */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">About DocBook</h1>
        <p className="text-blue-100 text-lg leading-relaxed">
          We're on a mission to make quality healthcare accessible to everyone by connecting patients with the right doctors, at the right time.
        </p>
      </div>
    </div>

    {/* Story */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            DocBook was founded in 2020 with a simple vision: to eliminate the friction from healthcare appointment booking. We saw patients waiting weeks for appointments and doctors struggling to manage their schedules.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, we've grown to serve thousands of patients and hundreds of doctors across multiple specialties. Our platform makes it easy to find, book, and manage medical appointments — all in one place.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['500+', 'Expert Doctors'], ['50K+', 'Happy Patients'], ['30+', 'Specializations'], ['4.8★', 'Average Rating']].map(([val, label]) => (
            <div key={label} className="bg-blue-50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{val}</div>
              <div className="text-gray-600 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Leadership</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {team.map(({ name, role, img }) => (
            <div key={name} className="text-center">
              <img src={img} alt={name} className="w-24 h-24 rounded-full mx-auto mb-3 ring-4 ring-blue-100" />
              <h3 className="font-bold text-gray-800">{name}</h3>
              <p className="text-blue-600 text-sm">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default About;
