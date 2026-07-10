import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FaHeartbeat className="text-blue-400 text-2xl" />
            <span className="text-xl font-bold text-white">Doc<span className="text-blue-400">Book</span></span>
          </div>
          <p className="text-sm text-gray-400 mb-4">Your trusted platform for booking doctor appointments online. Quality healthcare, just a click away.</p>
          <div className="flex gap-3">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/doctors', 'Find Doctors'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-blue-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4">Specializations</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {['Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Psychiatry'].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><FiMapPin className="text-blue-400" /><span>123 Medical Plaza, New York</span></li>
            <li className="flex items-center gap-2"><FiPhone className="text-blue-400" /><span>+1 (800) 123-4567</span></li>
            <li className="flex items-center gap-2"><FiMail className="text-blue-400" /><span>support@docbook.com</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <p>© {new Date().getFullYear()} DocBook. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-blue-400">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
