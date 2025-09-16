'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, Move, Eye, EyeOff, ChevronUp, ChevronDown, BarChart3, Users, FileText, Menu as MenuIcon, Settings, LogOut, Image, Type, Minus, MousePointer, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

// Enhanced mock data structure
const initialData = {
  pages: [
    {
      id: 'home',
      title: 'Home',
      slug: 'home',
      published: true,
      order: 0,
      content: [
        {
          id: '1',
          type: 'hero',
          data: {
            title: 'Welcome to The Golden Chocobo',
            subtitle: 'Premium FFXIV Venue Experience',
            backgroundImage: 'https://via.placeholder.com/1200x600/000000/FFD700?text=Venue+Background',
            alignment: 'center'
          }
        },
        {
          id: '2',
          type: 'text',
          data: {
            content: 'Experience the finest hospitality in Eorzea. Join us for unforgettable nights filled with great company, premium drinks, and exceptional service.',
            alignment: 'center'
          }
        }
      ]
    },
    {
      id: 'staff',
      title: 'Staff',
      slug: 'staff',
      published: true,
      order: 1,
      content: []
    },
    {
      id: 'menu',
      title: 'Menu',
      slug: 'menu',
      published: true,
      order: 2,
      content: []
    }
  ],
  staff: [
    {
      id: '1',
      name: 'Aria Nightfall',
      role: 'Owner',
      bio: 'Passionate about creating memorable experiences in Eorzea.',
      image: 'https://via.placeholder.com/300x400/2a2a2a/FFD700?text=Aria',
      isManager: true,
      managerFlag: 'Venue Owner',
      hasAlt: true,
      alt: {
        name: 'Kira Dawnblade',
        role: 'Event Coordinator',
        bio: 'Specializes in organizing special events and themed nights.',
        image: 'https://via.placeholder.com/300x400/2a2a2a/FFD700?text=Kira'
      },
      order: 0
    }
  ],
  menu: [
    {
      id: '1',
      category: 'House Specials',
      items: [
        {
          id: '1-1',
          name: 'Golden Chocobo Cocktail',
          description: 'Our signature drink with a golden shimmer',
          price: '15,000',
          image: 'https://via.placeholder.com/300x200/2a2a2a/FFD700?text=Cocktail',
          order: 0
        }
      ]
    },
    {
      id: '2',
      category: 'Premium Drinks',
      items: [
        {
          id: '2-1',
          name: 'Eorzean Wine',
          description: 'Fine vintage from the finest vineyards',
          price: '8,000',
          image: 'https://via.placeholder.com/300x200/2a2a2a/FFD700?text=Wine',
          order: 0
        }
      ]
    }
  ],
  footer: {
    text: '© 2024 The Golden Chocobo. All rights reserved.',
    socialLinks: {
      bluesky: 'https://bsky.app/profile/example',
      discord: 'https://discord.gg/example'
    }
  },
  admins: [
    { id: '1', username: 'admin', password: 'admin123', role: 'super' }
  ]
};

const VenueCMS = () => {
  // ALL HOOKS AT TOP LEVEL
  const [data, setData] = useState(initialData);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('public');
  const [selectedPublicPage, setSelectedPublicPage] = useState('home');
  const [editingPage, setEditingPage] = useState(null);
  const [showAltStaff, setShowAltStaff] = useState({});
  const [adminView, setAdminView] = useState('dashboard'); // dashboard, staff, menu, settings
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Staff form state
  const [staffForm, setStaffForm] = useState({
    name: '', role: '', bio: '', image: '', isManager: false, managerFlag: '',
    hasAlt: false, altName: '', altRole: '', altBio: '', altImage: ''
  });
  const [editingStaff, setEditingStaff] = useState(null);
  const [showStaffForm, setShowStaffForm] = useState(false);

  // Menu form state
  const [menuForm, setMenuForm] = useState({
    categoryName: '', itemName: '', description: '', price: '', image: ''
  });
  const [showMenuForm, setShowMenuForm] = useState(false);

  // Login handling
  const handleLogin = (username: string, password: string) => {
    const admin = data.admins.find(a => a.username === username && a.password === password);
    if (admin) {
      setCurrentUser(admin);
      setCurrentPage('dashboard');
      setAdminView('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('public');
    setAdminView('dashboard');
  };

  // Page management
  const createNewPage = () => {
    const newPage = {
      id: Date.now().toString(),
      title: 'New Page',
      slug: 'new-page',
      published: false,
      order: data.pages.length,
      content: []
    };
    setData(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    setEditingPage(newPage.id);
  };

  const updatePage = (pageId: string, updates: any) => {
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === pageId ? { ...p, ...updates } : p)
    }));
  };

  const deletePage = (pageId: string) => {
    if (pageId === 'home') return;
    setData(prev => ({
      ...prev,
      pages: prev.pages.filter(p => p.id !== pageId)
    }));
  };

  // Staff management
  const addStaff = () => {
    const newStaff = {
      id: Date.now().toString(),
      ...staffForm,
      order: data.staff.length,
      alt: staffForm.hasAlt ? {
        name: staffForm.altName,
        role: staffForm.altRole,
        bio: staffForm.altBio,
        image: staffForm.altImage
      } : undefined
    };
    setData(prev => ({
      ...prev,
      staff: [...prev.staff, newStaff]
    }));
    setStaffForm({
      name: '', role: '', bio: '', image: '', isManager: false, managerFlag: '',
      hasAlt: false, altName: '', altRole: '', altBio: '', altImage: ''
    });
    setShowStaffForm(false);
  };

  const deleteStaff = (staffId: string) => {
    setData(prev => ({
      ...prev,
      staff: prev.staff.filter(s => s.id !== staffId)
    }));
  };

  // Enhanced Content Components
  const ContentComponent = ({ item, isEditing, onUpdate, onDelete }: any) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState(item.data);

    const handleSave = () => {
      onUpdate(item.id, editData);
      setIsEditMode(false);
    };

    const alignmentClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }[editData.alignment || 'center'];

    switch (item.type) {
      case 'hero':
        return (
          <div className={`relative bg-gradient-to-r from-black to-gray-800 text-white p-12 rounded-lg mb-6 ${alignmentClass}`}>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 rounded-lg"
              style={{ backgroundImage: `url(${item.data.backgroundImage})` }}
            />
            <div className="relative z-10">
              {isEditMode ? (
                <div className="space-y-4">
                  <input
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="w-full p-2 bg-black/50 border border-yellow-500 rounded text-white"
                    placeholder="Hero Title"
                  />
                  <input
                    value={editData.subtitle}
                    onChange={(e) => setEditData({...editData, subtitle: e.target.value})}
                    className="w-full p-2 bg-black/50 border border-yellow-500 rounded text-white"
                    placeholder="Hero Subtitle"
                  />
                  <input
                    value={editData.backgroundImage}
                    onChange={(e) => setEditData({...editData, backgroundImage: e.target.value})}
                    className="w-full p-2 bg-black/50 border border-yellow-500 rounded text-white"
                    placeholder="Background Image URL"
                  />
                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => setEditData({...editData, alignment: 'left'})}
                      className={`p-2 rounded ${editData.alignment === 'left' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditData({...editData, alignment: 'center'})}
                      className={`p-2 rounded ${editData.alignment === 'center' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditData({...editData, alignment: 'right'})}
                      className={`p-2 rounded ${editData.alignment === 'right' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-5xl font-bold mb-4 text-yellow-400">{item.data.title}</h1>
                  <p className="text-xl text-gray-300">{item.data.subtitle}</p>
                  {isEditing && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`bg-gray-800 p-6 rounded-lg mb-6 relative ${alignmentClass}`}>
            {isEditMode ? (
              <div className="space-y-4">
                <textarea
                  value={editData.content}
                  onChange={(e) => setEditData({...editData, content: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-yellow-500 rounded text-white h-32"
                  placeholder="Enter text content..."
                />
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'left'})}
                    className={`p-2 rounded ${editData.alignment === 'left' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'center'})}
                    className={`p-2 rounded ${editData.alignment === 'center' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'right'})}
                    className={`p-2 rounded ${editData.alignment === 'right' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-300 leading-relaxed">{item.data.content}</p>
                {isEditing && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'header':
        return (
          <div className={`mb-6 relative ${alignmentClass}`}>
            {isEditMode ? (
              <div className="space-y-4">
                <input
                  value={editData.text}
                  onChange={(e) => setEditData({...editData, text: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-yellow-500 rounded text-white"
                  placeholder="Header text"
                />
                <select
                  value={editData.size}
                  onChange={(e) => setEditData({...editData, size: e.target.value})}
                  className="p-2 bg-black/50 border border-yellow-500 rounded text-white"
                >
                  <option value="h1">Large Header (H1)</option>
                  <option value="h2">Medium Header (H2)</option>
                  <option value="h3">Small Header (H3)</option>
                </select>
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'left'})}
                    className={`p-2 rounded ${editData.alignment === 'left' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'center'})}
                    className={`p-2 rounded ${editData.alignment === 'center' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'right'})}
                    className={`p-2 rounded ${editData.alignment === 'right' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {editData.size === 'h1' && <h1 className="text-4xl font-bold text-yellow-400 mb-4">{editData.text}</h1>}
                {editData.size === 'h2' && <h2 className="text-3xl font-bold text-yellow-400 mb-4">{editData.text}</h2>}
                {editData.size === 'h3' && <h3 className="text-2xl font-bold text-yellow-400 mb-4">{editData.text}</h3>}
                {isEditing && (
                  <div className="absolute top-0 right-0 flex gap-2">
                    <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'button':
        return (
          <div className={`mb-6 relative ${alignmentClass}`}>
            {isEditMode ? (
              <div className="space-y-4">
                <input
                  value={editData.text}
                  onChange={(e) => setEditData({...editData, text: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-yellow-500 rounded text-white"
                  placeholder="Button text"
                />
                <input
                  value={editData.link}
                  onChange={(e) => setEditData({...editData, link: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-yellow-500 rounded text-white"
                  placeholder="Button link (URL)"
                />
                <select
                  value={editData.style}
                  onChange={(e) => setEditData({...editData, style: e.target.value})}
                  className="p-2 bg-black/50 border border-yellow-500 rounded text-white"
                >
                  <option value="primary">Primary (Gold)</option>
                  <option value="secondary">Secondary (Outline)</option>
                </select>
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'left'})}
                    className={`p-2 rounded ${editData.alignment === 'left' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'center'})}
                    className={`p-2 rounded ${editData.alignment === 'center' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'right'})}
                    className={`p-2 rounded ${editData.alignment === 'right' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <a 
                  href={editData.link} 
                  className={`inline-block px-6 py-3 rounded-lg font-bold transition-colors ${
                    editData.style === 'primary' 
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-black' 
                      : 'border-2 border-yellow-500 hover:bg-yellow-500/10 text-yellow-400'
                  }`}
                >
                  {editData.text}
                </a>
                {isEditing && (
                  <div className="absolute top-0 right-0 flex gap-2">
                    <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'image':
        return (
          <div className={`mb-6 relative ${alignmentClass}`}>
            {isEditMode ? (
              <div className="space-y-4">
                <input
                  value={editData.src}
                  onChange={(e) => setEditData({...editData, src: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-yellow-500 rounded text-white"
                  placeholder="Image URL"
                />
                <input
                  value={editData.alt}
                  onChange={(e) => setEditData({...editData, alt: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-yellow-500 rounded text-white"
                  placeholder="Image description"
                />
                <select
                  value={editData.size}
                  onChange={(e) => setEditData({...editData, size: e.target.value})}
                  className="p-2 bg-black/50 border border-yellow-500 rounded text-white"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="full">Full Width</option>
                </select>
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'left'})}
                    className={`p-2 rounded ${editData.alignment === 'left' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'center'})}
                    className={`p-2 rounded ${editData.alignment === 'center' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setEditData({...editData, alignment: 'right'})}
                    className={`p-2 rounded ${editData.alignment === 'right' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img 
                  src={editData.src} 
                  alt={editData.alt}
                  className={`rounded-lg ${
                    editData.size === 'small' ? 'w-48 h-32' :
                    editData.size === 'medium' ? 'w-96 h-64' :
                    editData.size === 'large' ? 'w-full h-96' :
                    'w-full h-auto'
                  } object-cover`}
                />
                {isEditing && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

case 'divider':
        return (
          <div className={`mb-6 relative ${effectClass}`}>
            {isEditMode ? (
              <div className="space-y-4">
                <select
                  value={editData.style}
                  onChange={(e) => setEditData({...editData, style: e.target.value})}
                  className="p-2 bg-black/50 border border-yellow-500 rounded text-white"
                >
                  <option value="line">Simple Line</option>
                  <option value="thick">Thick Line</option>
                  <option value="dotted">Dotted Line</option>
                  <option value="gold">Gold Line</option>
                </select>
                <select
                  value={editData.effects}
                  onChange={(e) => setEditData({...editData, effects: e.target.value})}
                  className="p-2 bg-black/50 border border-yellow-500 rounded text-white text-sm"
                >
                  <option value="none">No Effect</option>
                  <option value="fadeIn">Fade In</option>
                  <option value="slideUp">Slide Up</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <hr className={`transition-all duration-500 ${
                  editData.style === 'line' ? 'border-gray-600 border-t' :
                  editData.style === 'thick' ? 'border-gray-600 border-t-4' :
                  editData.style === 'dotted' ? 'border-gray-600 border-t border-dotted' :
                  'border-yellow-500 border-t-2'
                } w-full`} />
                {isEditing && (
                  <div className="absolute top-0 right-0 flex gap-2">
                    <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'html':
        return (
          <div className={`mb-6 relative ${effectClass}`}>
            {isEditMode ? (
              <div className="space-y-4">
                <textarea
                  value={editData.htmlContent}
                  onChange={(e) => setEditData({...editData, htmlContent: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-yellow-500 rounded text-white h-40 font-mono text-sm"
                  placeholder="Enter HTML/CSS code or embed code here..."
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="transition-all duration-500"
                  dangerouslySetInnerHTML={{ __html: editData.htmlContent }}
                />
                {isEditing && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Staff card component
  const StaffCard = ({ staff, showAlt, onToggleAlt }: any) => {
    const currentData = showAlt && staff.hasAlt ? staff.alt : staff;

    return (
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-6 relative transition-all duration-500 hover:shadow-venue-hover animate-fade-in">
        {staff.isManager && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold transform rotate-12 animate-pulse">
            {staff.managerFlag}
          </div>
        )}
        <img
          src={currentData.image}
          alt={currentData.name}
          className="w-full h-64 object-cover rounded-lg mb-4 transition-all duration-300 hover:scale-105"
        />
        <h3 className="text-xl font-bold text-yellow-400 mb-2 transition-colors duration-300 hover:text-yellow-300">{currentData.name}</h3>
        <p className="text-yellow-300 font-semibold mb-3">{currentData.role}</p>
        <p className="text-gray-300 leading-relaxed mb-4">{currentData.bio}</p>
        {staff.hasAlt && (
          <button
            onClick={() => onToggleAlt(staff.id)}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105"
          >
            {showAlt ? 'Show Main' : 'Show Alt'}
          </button>
        )}
      </div>
    );
  };

  // Menu category component
  const MenuCategory = ({ category }: any) => (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6 border-b border-yellow-500 pb-2 transition-colors duration-300 hover:text-yellow-300">
        {category.category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.items.map((item: any) => (
          <div key={item.id} className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-venue-hover hover:scale-105">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover transition-transform duration-300"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-yellow-400 transition-colors duration-300 hover:text-yellow-300">{item.name}</h3>
                <span className="text-yellow-300 font-bold">{item.price} gil</span>
              </div>
              <p className="text-gray-300">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Image Manager Modal
  const ImageManager = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-yellow-500/30 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400">Image Manager</h2>
          <button
            onClick={() => setShowImageManager(false)}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 mb-6 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">Upload images to Supabase Storage</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                Array.from(e.target.files || []).forEach(handleImageUpload);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded font-semibold transition-colors"
            >
              Choose Files
            </button>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {data.imageStorage.map((image: any) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-32 object-cover rounded border border-gray-600 transition-all duration-300 hover:border-yellow-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded flex items-center justify-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(image.supabaseUrl);
                      setShowImageManager(false);
                    }}
                    className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold"
                  >
                    Use Image
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">{image.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Theme Editor Modal
  const ThemeEditor = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-yellow-500/30 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400">Theme Editor</h2>
          <button
            onClick={() => setShowThemeEditor(false)}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Theme Presets */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Quick Themes</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(data.themes.presets).map(([key, theme]: any) => (
                <button
                  key={key}
                  onClick={() => {
                    setData(prev => ({
                      ...prev,
                      themes: { ...prev.themes, current: key }
                    }));
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    data.themes.current === key
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <span className="font-semibold text-white">{theme.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.background }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.surface }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Theme Creator */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Custom Theme</h3>
            <div className="space-y-4">
              {[
                { key: 'primary', label: 'Primary Color', desc: 'Main accent color' },
                { key: 'secondary', label: 'Secondary Color', desc: 'Secondary accent' },
                { key: 'background', label: 'Background', desc: 'Main background' },
                { key: 'surface', label: 'Surface', desc: 'Card backgrounds' },
                { key: 'text', label: 'Text Color', desc: 'Primary text' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {label}
                    </label>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <input
                    type="color"
                    value={customTheme[key]}
                    onChange={(e) => setCustomTheme(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                    className="w-16 h-10 rounded border border-gray-600 bg-transparent"
                  />
                  <input
                    type="text"
                    value={customTheme[key]}
                    onChange={(e) => setCustomTheme(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                    className="w-20 p-2 bg-black/50 border border-gray-600 rounded text-white text-sm font-mono"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  const newThemeKey = `custom-${Date.now()}`;
                  setData(prev => ({
                    ...prev,
                    themes: {
                      ...prev.themes,
                      current: newThemeKey,
                      presets: {
                        ...prev.themes.presets,
                        [newThemeKey]: {
                          ...customTheme,
                          name: customTheme.name || 'Custom Theme'
                        }
                      }
                    }
                  }));
                  setShowThemeEditor(false);
                }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded font-semibold transition-colors"
              >
                Apply Custom Theme
              </button>
              <button
                onClick={() => setShowThemeEditor(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Login form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleLogin(username, password)) {
      setError('');
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid credentials');
    }
  };

  // Staff form submit handler
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      setData(prev => ({
        ...prev,
        staff: prev.staff.map(s => s.id === editingStaff ? {
          ...s,
          ...staffForm,
          alt: staffForm.hasAlt ? {
            name: staffForm.altName,
            role: staffForm.altRole,
            bio: staffForm.altBio,
            image: staffForm.altImage
          } : undefined
        } : s)
      }));
      setEditingStaff(null);
    } else {
      const newStaff = {
        id: Date.now().toString(),
        ...staffForm,
        order: data.staff.length,
        alt: staffForm.hasAlt ? {
          name: staffForm.altName,
          role: staffForm.altRole,
          bio: staffForm.altBio,
          image: staffForm.altImage
        } : undefined
      };
      setData(prev => ({
        ...prev,
        staff: [...prev.staff, newStaff]
      }));
    }
    setStaffForm({
      name: '', role: '', bio: '', image: '', isManager: false, managerFlag: '',
      hasAlt: false, altName: '', altRole: '', altBio: '', altImage: ''
    });
    setShowStaffForm(false);
  };

  // Login screen
  if (!currentUser && currentPage !== 'public') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-800 flex items-center justify-center animate-fade-in">
        <div className="bg-gray-900 p-8 rounded-lg border border-yellow-500 w-full max-w-md animate-slide-up">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-black border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-black border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
              required
            />
            {error && <p className="text-red-400 animate-fade-in">{error}</p>}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded transition-all duration-300 transform hover:scale-105"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('public')}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded transition-all duration-300"
            >
              Back to Site
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Public site
  if (currentPage === 'public') {
    const publishedPages = data.pages.filter(p => p.published).sort((a, b) => a.order - b.order);
    const currentPageData = publishedPages.find(p => p.slug === selectedPublicPage) || publishedPages[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-800 text-white">
        {/* Navigation */}
        <nav className="bg-black/50 backdrop-blur-sm border-b border-yellow-500/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                {publishedPages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPublicPage(page.slug)}
                    className={`px-4 py-2 rounded transition-all duration-300 transform hover:scale-105 ${
                      selectedPublicPage === page.slug
                        ? 'bg-yellow-500 text-black font-bold shadow-venue'
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    {page.title}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowThemeEditor(true)}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <Palette className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Home page and dynamic pages */}
          {(selectedPublicPage === 'home' || (!['staff', 'menu'].includes(selectedPublicPage))) && currentPageData && (
            <div>
              {currentPageData.content && currentPageData.content.length > 0 ? (
                currentPageData.content.map((item: any) => (
                  <ContentComponent
                    key={item.id}
                    item={item}
                    isEditing={false}
                  />
                ))
              ) : (
                selectedPublicPage !== 'home' && (
                  <div className="text-center py-16">
                    <h1 className="text-4xl font-bold text-yellow-400 mb-4">{currentPageData.title}</h1>
                    <p className="text-gray-400 text-lg">This page is still being created. Check back soon!</p>
                  </div>
                )
              )}
            </div>
          )}

          {/* Staff page */}
          {selectedPublicPage === 'staff' && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">Our Team</h1>
              {data.staff.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.staff.sort((a, b) => a.order - b.order).map((staff: any) => (
                    <StaffCard
                      key={staff.id}
                      staff={staff}
                      showAlt={showAltStaff[staff.id]}
                      onToggleAlt={(id: string) => setShowAltStaff(prev => ({
                        ...prev,
                        [id]: !prev[id]
                      }))}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg">Staff profiles coming soon!</p>
                </div>
              )}
            </div>
          )}

          {/* Menu page */}
          {selectedPublicPage === 'menu' && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, Save, X, Move, Eye, EyeOff, ChevronUp, ChevronDown, BarChart3, Users, FileText, Menu as MenuIcon, Settings, LogOut, Image, Type, Minus, MousePointer, AlignLeft, AlignCenter, AlignRight, Code, Upload, Palette, Sparkles } from 'lucide-react';

// Enhanced mock data structure with themes
const initialData = {
  pages: [
    {
      id: 'home',
      title: 'Home',
      slug: 'home',
      published: true,
      order: 0,
      content: [
        {
          id: '1',
          type: 'hero',
          data: {
            title: 'Welcome to The Golden Chocobo',
            subtitle: 'Premium FFXIV Venue Experience',
            backgroundImage: 'https://via.placeholder.com/1200x600/000000/FFD700?text=Venue+Background',
            alignment: 'center',
            effects: 'fadeIn'
          }
        },
        {
          id: '2',
          type: 'text',
          data: {
            content: 'Experience the finest hospitality in Eorzea. Join us for unforgettable nights filled with great company, premium drinks, and exceptional service.',
            alignment: 'center',
            effects: 'slideUp'
          }
        }
      ]
    },
    {
      id: 'staff',
      title: 'Staff',
      slug: 'staff',
      published: true,
      order: 1,
      content: []
    },
    {
      id: 'menu',
      title: 'Menu',
      slug: 'menu',
      published: true,
      order: 2,
      content: []
    }
  ],
  staff: [
    {
      id: '1',
      name: 'Aria Nightfall',
      role: 'Owner',
      bio: 'Passionate about creating memorable experiences in Eorzea.',
      image: 'https://via.placeholder.com/300x400/2a2a2a/FFD700?text=Aria',
      isManager: true,
      managerFlag: 'Venue Owner',
      hasAlt: true,
      alt: {
        name: 'Kira Dawnblade',
        role: 'Event Coordinator',
        bio: 'Specializes in organizing special events and themed nights.',
        image: 'https://via.placeholder.com/300x400/2a2a2a/FFD700?text=Kira'
      },
      order: 0
    }
  ],
  menu: [
    {
      id: '1',
      category: 'House Specials',
      items: [
        {
          id: '1-1',
          name: 'Golden Chocobo Cocktail',
          description: 'Our signature drink with a golden shimmer',
          price: '15,000',
          image: 'https://via.placeholder.com/300x200/2a2a2a/FFD700?text=Cocktail',
          order: 0
        }
      ]
    }
  ],
  footer: {
    text: '© 2024 The Golden Chocobo. All rights reserved.',
    socialLinks: {
      bluesky: 'https://bsky.app/profile/example',
      discord: 'https://discord.gg/example'
    }
  },
  admins: [
    { id: '1', username: 'admin', password: 'admin123', role: 'super' }
  ],
  themes: {
    current: 'default',
    presets: {
      default: {
        name: 'Golden Chocobo',
        primary: '#FFD700',
        secondary: '#B8860B',
        background: '#000000',
        surface: '#2a2a2a',
        text: '#ffffff'
      },
      valentine: {
        name: 'Valentine\'s Day',
        primary: '#FF69B4',
        secondary: '#DC143C',
        background: '#1a0a0a',
        surface: '#2a1a1a',
        text: '#ffffff'
      },
      christmas: {
        name: 'Christmas',
        primary: '#228B22',
        secondary: '#DC143C',
        background: '#0a1a0a',
        surface: '#1a2a1a',
        text: '#ffffff'
      },
      anniversary: {
        name: 'Anniversary',
        primary: '#8A2BE2',
        secondary: '#4B0082',
        background: '#0a0a1a',
        surface: '#1a1a2a',
        text: '#ffffff'
      }
    }
  },
  imageStorage: [] // For uploaded images
};

const VenueCMS = () => {
  // ALL HOOKS AT TOP LEVEL
  const [data, setData] = useState(initialData);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('public');
  const [selectedPublicPage, setSelectedPublicPage] = useState('home');
  const [editingPage, setEditingPage] = useState(null);
  const [showAltStaff, setShowAltStaff] = useState({});
  const [adminView, setAdminView] = useState('dashboard');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Staff form state
  const [staffForm, setStaffForm] = useState({
    name: '', role: '', bio: '', image: '', isManager: false, managerFlag: '',
    hasAlt: false, altName: '', altRole: '', altBio: '', altImage: ''
  });
  const [editingStaff, setEditingStaff] = useState(null);
  const [showStaffForm, setShowStaffForm] = useState(false);

  // Menu form state
  const [menuForm, setMenuForm] = useState({
    categoryName: '', itemName: '', description: '', price: '', image: ''
  });
  const [showMenuForm, setShowMenuForm] = useState(false);

  // Theme and image management
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [customTheme, setCustomTheme] = useState(data.themes.presets.default);
  const fileInputRef = useRef(null);

  // Apply theme to CSS variables
  useEffect(() => {
    const theme = data.themes.presets[data.themes.current];
    if (theme) {
      document.documentElement.style.setProperty('--venue-gold', theme.primary);
      document.documentElement.style.setProperty('--venue-dark-gold', theme.secondary);
      document.documentElement.style.setProperty('--venue-black', theme.background);
      document.documentElement.style.setProperty('--venue-gray-medium', theme.surface);
      document.documentElement.style.setProperty('--venue-text', theme.text);
    }
  }, [data.themes.current]);

  // Image upload handler
  const handleImageUpload = async (file) => {
    if (!file) return null;

    // In real implementation, this would upload to Supabase Storage
    // For now, create a mock URL
    const mockUrl = URL.createObjectURL(file);
    const imageEntry = {
      id: Date.now().toString(),
      name: file.name,
      url: mockUrl,
      supabaseUrl: `https://your-project.supabase.co/storage/v1/object/public/images/${file.name}`,
      uploaded: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      imageStorage: [...prev.imageStorage, imageEntry]
    }));

    return imageEntry.supabaseUrl;
  };

  // Login handling
  const handleLogin = (username: string, password: string) => {
    const admin = data.admins.find(a => a.username === username && a.password === password);
    if (admin) {
      setCurrentUser(admin);
      setCurrentPage('dashboard');
      setAdminView('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('public');
    setAdminView('dashboard');
  };

  // Page management
  const createNewPage = () => {
    const newPage = {
      id: Date.now().toString(),
      title: 'New Page',
      slug: 'new-page',
      published: false,
      order: data.pages.length,
      content: []
    };
    setData(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    setEditingPage(newPage.id);
  };

  const updatePage = (pageId: string, updates: any) => {
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === pageId ? { ...p, ...updates } : p)
    }));
  };

  const deletePage = (pageId: string) => {
    if (pageId === 'home') return;
    setData(prev => ({
      ...prev,
      pages: prev.pages.filter(p => p.id !== pageId)
    }));
  };

  // Enhanced Content Components
  const ContentComponent = ({ item, isEditing, onUpdate, onDelete }: any) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState(item.data);

    const handleSave = () => {
      onUpdate(item.id, editData);
      setIsEditMode(false);
    };

    const alignmentClass = {
      left: 'text-left justify-start items-start',
      center: 'text-center justify-center items-center',
      right: 'text-right justify-end items-end'
    }[editData.alignment || 'center'];

    const effectClass = {
      none: '',
      fadeIn: 'animate-fade-in',
      slideUp: 'animate-slide-up',
      slideDown: 'animate-slide-down',
      bounce: 'animate-bounce',
      pulse: 'animate-pulse'
    }[editData.effects || 'none'];

    switch (item.type) {
      case 'hero':
        return (
          <div className={`relative bg-gradient-to-r from-black to-gray-800 text-white p-12 rounded-lg mb-6 ${alignmentClass} ${effectClass} transition-all duration-500 hover:shadow-venue-hover`}>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 rounded-lg transition-opacity duration-500"
              style={{ backgroundImage: `url(${item.data.backgroundImage})` }}
            />
            <div className="relative z-10">
              {isEditMode ? (
                <div className="space-y-4">
                  <input
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="w-full p-2 bg-black/50 border border-yellow-500 rounded text-white"
                    placeholder="Hero Title"
                  />
                  <input
                    value={editData.subtitle}
                    onChange={(e) => setEditData({...editData, subtitle: e.target.value})}
                    className="w-full p-2 bg-black/50 border border-yellow-500 rounded text-white"
                    placeholder="Hero Subtitle"
                  />
                  <div className="flex gap-2">
                    <input
                      value={editData.backgroundImage}
                      onChange={(e) => setEditData({...editData, backgroundImage: e.target.value})}
                      className="flex-1 p-2 bg-black/50 border border-yellow-500 rounded text-white"
                      placeholder="Background Image URL"
                    />
                    <button
                      onClick={() => setShowImageManager(true)}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Alignment</label>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditData({...editData, alignment: 'left'})}
                          className={`p-2 rounded ${editData.alignment === 'left' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                        >
                          <AlignLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditData({...editData, alignment: 'center'})}
                          className={`p-2 rounded ${editData.alignment === 'center' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                        >
                          <AlignCenter className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditData({...editData, alignment: 'right'})}
                          className={`p-2 rounded ${editData.alignment === 'right' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                        >
                          <AlignRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Effects</label>
                      <select
                        value={editData.effects}
                        onChange={(e) => setEditData({...editData, effects: e.target.value})}
                        className="w-full p-2 bg-black/50 border border-yellow-500 rounded text-white text-sm"
                      >
                        <option value="none">None</option>
                        <option value="fadeIn">Fade In</option>
                        <option value="slideUp">Slide Up</option>
                        <option value="slideDown">Slide Down</option>
                        <option value="bounce">Bounce</option>
                        <option value="pulse">Pulse</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-5xl font-bold mb-4 text-yellow-400 transition-colors duration-300 hover:text-yellow-300">{item.data.title}</h1>
                  <p className="text-xl text-gray-300 transition-colors duration-300 hover:text-white">{item.data.subtitle}</p>
                  {isEditing && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`bg-gray-800 p-6 rounded-lg mb-6 relative ${alignmentClass} ${effectClass} transition-all duration-500 hover:bg-gray-750`}>
            {isEditMode ? (
              <div className="space-y-4">
                <textarea
                  value={editData.content}
                  onChange={(e) => setEditData({...editData, content: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-yellow-500 rounded text-white h-32"
                  placeholder="Enter text content..."
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Alignment</label>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditData({...editData, alignment: 'left'})}
                        className={`p-2 rounded ${editData.alignment === 'left' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                      >
                        <AlignLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditData({...editData, alignment: 'center'})}
                        className={`p-2 rounded ${editData.alignment === 'center' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                      >
                        <AlignCenter className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditData({...editData, alignment: 'right'})}
                        className={`p-2 rounded ${editData.alignment === 'right' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                      >
                        <AlignRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Effects</label>
                    <select
                      value={editData.effects}
                      onChange={(e) => setEditData({...editData, effects: e.target.value})}
                      className="w-full p-2 bg-black/50 border border-yellow-500 rounded text-white text-sm"
                    >
                      <option value="none">None</option>
                      <option value="fadeIn">Fade In</option>
                      <option value="slideUp">Slide Up</option>
                      <option value="slideDown">Slide Down</option>
                      <option value="pulse">Pulse</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-300 leading-relaxed transition-colors duration-300 hover:text-white">{item.data.content}</p>
                {isEditing && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'header':
        return (
          <div className={`mb-6 relative ${alignmentClass} ${effectClass}`}>
            {isEditMode ? (
              <div className="space-y-4">
                <input
                  value={editData.text}
                  onChange={(e) => setEditData({...editData, text: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-yellow-500 rounded text-white"
                  placeholder="Header text"
                />
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={editData.size}
                    onChange={(e) => setEditData({...editData, size: e.target.value})}
                    className="p-2 bg-black/50 border border-yellow-500 rounded text-white"
                  >
                    <option value="h1">Large (H1)</option>
                    <option value="h2">Medium (H2)</option>
                    <option value="h3">Small (H3)</option>
                  </select>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditData({...editData, alignment: 'left'})}
                      className={`p-2 rounded ${editData.alignment === 'left' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditData({...editData, alignment: 'center'})}
                      className={`p-2 rounded ${editData.alignment === 'center' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditData({...editData, alignment: 'right'})}
                      className={`p-2 rounded ${editData.alignment === 'right' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                  <select
                    value={editData.effects}
                    onChange={(e) => setEditData({...editData, effects: e.target.value})}
                    className="p-2 bg-black/50 border border-yellow-500 rounded text-white text-sm"
                  >
                    <option value="none">No Effect</option>
                    <option value="fadeIn">Fade In</option>
                    <option value="slideUp">Slide Up</option>
                    <option value="pulse">Pulse</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {editData.size === 'h1' && <h1 className="text-4xl font-bold text-yellow-400 mb-4 transition-colors duration-300 hover:text-yellow-300">{editData.text}</h1>}
                {editData.size === 'h2' && <h2 className="text-3xl font-bold text-yellow-400 mb-4 transition-colors duration-300 hover:text-yellow-300">{editData.text}</h2>}
                {editData.size === 'h3' && <h3 className="text-2xl font-bold text-yellow-400 mb-4 transition-colors duration-300 hover:text-yellow-300">{editData.text}</h3>}
                {isEditing && (
                  <div className="absolute top-0 right-0 flex gap-2">
                    <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'image':
        return (
          <div className={`mb-6 relative flex ${alignmentClass} ${effectClass}`}>
            {isEditMode ? (
              <div className="space-y-4 w-full">
                <div className="flex gap-2">
                  <input
                    value={editData.src}
                    onChange={(e) => setEditData({...editData, src: e.target.value})}
                    className="flex-1 p-3 bg-black/50 border border-yellow-500 rounded text-white"
                    placeholder="Image URL"
                  />
                  <button
                    onClick={() => setShowImageManager(true)}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
                <input
                  value={editData.alt}
                  onChange={(e) => setEditData({...editData, alt: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-yellow-500 rounded text-white"
                  placeholder="Image description"
                />
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={editData.size}
                    onChange={(e) => setEditData({...editData, size: e.target.value})}
                    className="p-2 bg-black/50 border border-yellow-500 rounded text-white"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="full">Full Width</option>
                  </select>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditData({...editData, alignment: 'left'})}
                      className={`p-2 rounded ${editData.alignment === 'left' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditData({...editData, alignment: 'center'})}
                      className={`p-2 rounded ${editData.alignment === 'center' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditData({...editData, alignment: 'right'})}
                      className={`p-2 rounded ${editData.alignment === 'right' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                  <select
                    value={editData.effects}
                    onChange={(e) => setEditData({...editData, effects: e.target.value})}
                    className="p-2 bg-black/50 border border-yellow-500 rounded text-white text-sm"
                  >
                    <option value="none">No Effect</option>
                    <option value="fadeIn">Fade In</option>
                    <option value="slideUp">Slide Up</option>
                    <option value="pulse">Pulse</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={editData.src}
                  alt={editData.alt}
                  className={`rounded-lg transition-all duration-500 hover:shadow-venue-hover ${
                    editData.size === 'small' ? 'w-48 h-32' :
                    editData.size === 'medium' ? 'w-96 h-64' :
                    editData.size === 'large' ? 'w-full h-96' :
                    'w-full h-auto'
                  } object-cover`}
                />
                {isEditing && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => setIsEditMode(true)} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
 <button onClick={() => onDelete(item.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Staff card component
  const StaffCard = ({ staff, showAlt, onToggleAlt }: any) => {
    const currentData = showAlt && staff.hasAlt ? staff.alt : staff;

    return (
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-6 relative transition-all duration-500 hover:shadow-venue-hover animate-fade-in">
        {staff.isManager && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold transform rotate-12 animate-pulse">
            {staff.managerFlag}
          </div>
        )}
        <img
          src={currentData.image}
          alt={currentData.name}
          className="w-full h-64 object-cover rounded-lg mb-4 transition-all duration-300 hover:scale-105"
        />
        <h3 className="text-xl font-bold text-yellow-400 mb-2 transition-colors duration-300 hover:text-yellow-300">{currentData.name}</h3>
        <p className="text-yellow-300 font-semibold mb-3">{currentData.role}</p>
        <p className="text-gray-300 leading-relaxed mb-4">{currentData.bio}</p>
        {staff.hasAlt && (
          <button
            onClick={() => onToggleAlt(staff.id)}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105"
          >
            {showAlt ? 'Show Main' : 'Show Alt'}
          </button>
        )}
      </div>
    );
  };

  // Menu category component
  const MenuCategory = ({ category }: any) => (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6 border-b border-yellow-500 pb-2 transition-colors duration-300 hover:text-yellow-300">
        {category.category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.items.map((item: any) => (
          <div key={item.id} className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-venue-hover hover:scale-105">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover transition-transform duration-300"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-yellow-400 transition-colors duration-300 hover:text-yellow-300">{item.name}</h3>
                <span className="text-yellow-300 font-bold">{item.price} gil</span>
              </div>
              <p className="text-gray-300">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Image Manager Modal
  const ImageManager = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-yellow-500/30 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400">Image Manager</h2>
          <button
            onClick={() => setShowImageManager(false)}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 mb-6 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">Upload images to Supabase Storage</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                Array.from(e.target.files || []).forEach(handleImageUpload);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded font-semibold transition-colors"
            >
              Choose Files
            </button>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {data.imageStorage.map((image: any) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-32 object-cover rounded border border-gray-600 transition-all duration-300 hover:border-yellow-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded flex items-center justify-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(image.supabaseUrl);
                      setShowImageManager(false);
                    }}
                    className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold"
                  >
                    Use Image
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">{image.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Theme Editor Modal
  const ThemeEditor = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-yellow-500/30 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400">Theme Editor</h2>
          <button
            onClick={() => setShowThemeEditor(false)}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Theme Presets */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Quick Themes</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(data.themes.presets).map(([key, theme]: any) => (
                <button
                  key={key}
                  onClick={() => {
                    setData(prev => ({
                      ...prev,
                      themes: { ...prev.themes, current: key }
                    }));
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    data.themes.current === key
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <span className="font-semibold text-white">{theme.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.background }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.surface }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Theme Creator */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Custom Theme</h3>
            <div className="space-y-4">
              {[
                { key: 'primary', label: 'Primary Color', desc: 'Main accent color' },
                { key: 'secondary', label: 'Secondary Color', desc: 'Secondary accent' },
                { key: 'background', label: 'Background', desc: 'Main background' },
                { key: 'surface', label: 'Surface', desc: 'Card backgrounds' },
                { key: 'text', label: 'Text Color', desc: 'Primary text' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {label}
                    </label>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <input
                    type="color"
                    value={customTheme[key]}
                    onChange={(e) => setCustomTheme(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                    className="w-16 h-10 rounded border border-gray-600 bg-transparent"
                  />
                  <input
                    type="text"
                    value={customTheme[key]}
                    onChange={(e) => setCustomTheme(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                    className="w-20 p-2 bg-black/50 border border-gray-600 rounded text-white text-sm font-mono"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  const newThemeKey = `custom-${Date.now()}`;
                  setData(prev => ({
                    ...prev,
                    themes: {
                      ...prev.themes,
                      current: newThemeKey,
                      presets: {
                        ...prev.themes.presets,
                        [newThemeKey]: {
                          ...customTheme,
                          name: customTheme.name || 'Custom Theme'
                        }
                      }
                    }
                  }));
                  setShowThemeEditor(false);
                }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded font-semibold transition-colors"
              >
                Apply Custom Theme
              </button>
              <button
                onClick={() => setShowThemeEditor(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Login form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleLogin(username, password)) {
      setError('');
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid credentials');
    }
  };

  // Staff form submit handler
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      setData(prev => ({
        ...prev,
        staff: prev.staff.map(s => s.id === editingStaff ? {
          ...s,
          ...staffForm,
          alt: staffForm.hasAlt ? {
            name: staffForm.altName,
            role: staffForm.altRole,
            bio: staffForm.altBio,
            image: staffForm.altImage
          } : undefined
        } : s)
      }));
      setEditingStaff(null);
    } else {
      const newStaff = {
        id: Date.now().toString(),
        ...staffForm,
        order: data.staff.length,
        alt: staffForm.hasAlt ? {
          name: staffForm.altName,
          role: staffForm.altRole,
          bio: staffForm.altBio,
          image: staffForm.altImage
        } : undefined
      };
      setData(prev => ({
        ...prev,
        staff: [...prev.staff, newStaff]
      }));
    }
    setStaffForm({
      name: '', role: '', bio: '', image: '', isManager: false, managerFlag: '',
      hasAlt: false, altName: '', altRole: '', altBio: '', altImage: ''
    });
    setShowStaffForm(false);
  };

  // Login screen
  if (!currentUser && currentPage !== 'public') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-800 flex items-center justify-center animate-fade-in">
        <div className="bg-gray-900 p-8 rounded-lg border border-yellow-500 w-full max-w-md animate-slide-up">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-black border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-black border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
              required
            />
            {error && <p className="text-red-400 animate-fade-in">{error}</p>}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded transition-all duration-300 transform hover:scale-105"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('public')}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded transition-all duration-300"
            >
              Back to Site
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Public site
  if (currentPage === 'public') {
    const publishedPages = data.pages.filter(p => p.published).sort((a, b) => a.order - b.order);
    const currentPageData = publishedPages.find(p => p.slug === selectedPublicPage) || publishedPages[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-800 text-white">
        {/* Navigation */}
        <nav className="bg-black/50 backdrop-blur-sm border-b border-yellow-500/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                {publishedPages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPublicPage(page.slug)}
                    className={`px-4 py-2 rounded transition-all duration-300 transform hover:scale-105 ${
                      selectedPublicPage === page.slug
                        ? 'bg-yellow-500 text-black font-bold shadow-venue'
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    {page.title}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowThemeEditor(true)}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <Palette className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Home page and dynamic pages */}
          {(selectedPublicPage === 'home' || (!['staff', 'menu'].includes(selectedPublicPage))) && currentPageData && (
            <div>
              {currentPageData.content && currentPageData.content.length > 0 ? (
                currentPageData.content.map((item: any) => (
                  <ContentComponent
                    key={item.id}
                    item={item}
                    isEditing={false}
                  />
                ))
              ) : (
                selectedPublicPage !== 'home' && (
                  <div className="text-center py-16">
                    <h1 className="text-4xl font-bold text-yellow-400 mb-4">{currentPageData.title}</h1>
                    <p className="text-gray-400 text-lg">This page is still being created. Check back soon!</p>
                  </div>
                )
              )}
            </div>
          )}

          {/* Staff page */}
          {selectedPublicPage === 'staff' && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">Our Team</h1>
              {data.staff.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.staff.sort((a, b) => a.order - b.order).map((staff: any) => (
                    <StaffCard
                      key={staff.id}
                      staff={staff}
                      showAlt={showAltStaff[staff.id]}
                      onToggleAlt={(id: string) => setShowAltStaff(prev => ({
                        ...prev,
                        [id]: !prev[id]
                      }))}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg">Staff profiles coming soon!</p>
                </div>
              )}
            </div>
          )}

          {/* Menu page */}
          {selectedPublicPage === 'menu' && (
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">Menu</h1>
              {data.menu.length > 0 && data.menu.some(cat => cat.items.length > 0) ? (
                data.menu.map((category: any) => (
                  <MenuCategory key={category.id} category={category} />
                ))
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg">Menu coming soon!</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-black/50 border-t border-yellow-500/30 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">{data.footer.text}</p>
              <div className="flex space-x-4">
                <a href={data.footer.socialLinks.bluesky} className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                  <span className="sr-only">BlueSky</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L20.18 9.27L15.09 14.14L16.18 21.02L12 18.27L7.82 21.02L8.91 14.14L3.82 9.27L10.91 8.26L12 2Z"/>
                  </svg>
                </a>
                <a href={data.footer.socialLinks.discord} className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                  <span className="sr-only">Discord</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Modals */}
        {showThemeEditor && <ThemeEditor />}
        {showImageManager && <ImageManager />}
      </div>
    );
  }

  // Admin Dashboard and Management
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-800 text-white">
      {/* Admin Header */}
      <div className="bg-black/50 border-b border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-yellow-400">Venue Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowThemeEditor(true)}
                className="text-gray-300 hover:text-yellow-400 flex items-center gap-2 transition-colors"
              >
                <Palette className="w-5 h-5" />
                Themes
              </button>
              <button
                onClick={() => setCurrentPage('public')}
                className="text-gray-300 hover:text-yellow-400 flex items-center gap-2 transition-colors"
              >
                <Eye className="w-5 h-5" />
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-400 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { key: 'pages', label: 'Pages', icon: FileText },
              { key: 'staff', label: 'Staff', icon: Users },
              { key: 'menu', label: 'Menu', icon: MenuIcon },
              { key: 'settings', label: 'Settings', icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setAdminView(key)}
                className={`px-4 py-3 border-b-2 transition-all duration-300 flex items-center gap-2 ${
                  adminView === key
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard View */}
        {adminView === 'dashboard' && (
          <div className="animate-fade-in">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-yellow-500/20 transition-all duration-300 hover:shadow-venue-hover">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-yellow-400 mr-3" />
                  <div>
                    <p className="text-gray-400">Total Pages</p>
                    <p className="text-2xl font-bold text-white">{data.pages.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-yellow-500/20 transition-all duration-300 hover:shadow-venue-hover">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-400 mr-3" />
                  <div>
                    <p className="text-gray-400">Staff Members</p>
                    <p className="text-2xl font-bold text-white">{data.staff.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-yellow-500/20 transition-all duration-300 hover:shadow-venue-hover">
                <div className="flex items-center">
                  <MenuIcon className="w-8 h-8 text-green-400 mr-3" />
                  <div>
                    <p className="text-gray-400">Menu Items</p>
                    <p className="text-2xl font-bold text-white">
                      {data.menu.reduce((total, category) => total + category.items.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-yellow-500/20 transition-all duration-300 hover:shadow-venue-hover">
                <div className="flex items-center">
                  <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
                  <div>
                    <p className="text-gray-400">Published Pages</p>
                    <p className="text-2xl font-bold text-white">
                      {data.pages.filter(p => p.published).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-yellow-500/20 mb-8">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={createNewPage}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  New Page
                </button>
                <button
                  onClick={() => {
                    setAdminView('staff');
                    setShowStaffForm(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  Add Staff
                </button>
                <button
                  onClick={() => {
                    setAdminView('menu');
                    setShowMenuForm(true);
                  }}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                >
                  <MenuIcon className="w-5 h-5" />
                  Add Menu Item
                </button>
                <button
                  onClick={() => setShowThemeEditor(true)}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                >
                  <Palette className="w-5 h-5" />
                  Edit Theme
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pages Management View */}
        {adminView === 'pages' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-yellow-500/20 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-yellow-400">Pages Management</h2>
              <button
                onClick={createNewPage}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Page
              </button>
            </div>

            <div className="space-y-3">
              {data.pages.map(page => (
                <div key={page.id} className="flex items-center justify-between bg-black/30 p-4 rounded border border-gray-700 transition-all duration-300 hover:border-yellow-500/50">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-1">
                      <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{page.title}</h3>
                      <p className="text-gray-400 text-sm">/{page.slug}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      page.published
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {page.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingPage(page.id)}
                      className="text-yellow-400 hover:text-yellow-300 p-2 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {page.id !== 'home' && page.slug !== 'staff' && page.slug !== 'menu' && (
                      <button
                        onClick={() => deletePage(page.id)}
                        className="text-red-400 hover:text-red-300 p-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => updatePage(page.id, { published: !page.published })}
                      className="text-blue-400 hover:text-blue-300 p-2 transition-colors"
                    >
                      {page.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff Management View */}
        {adminView === 'staff' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-yellow-400">Staff Management</h2>
              <button
                onClick={() => setShowStaffForm(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Staff Member
              </button>
            </div>

            {/* Staff List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.staff.map((staff: any) => (
                <div key={staff.id} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-yellow-500/20 transition-all duration-300 hover:shadow-venue-hover">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{staff.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setStaffForm({
                            name: staff.name,
                            role: staff.role,
                            bio: staff.bio,
                            image: staff.image,
                            isManager: staff.isManager,
                            managerFlag: staff.managerFlag || '',
                            hasAlt: staff.hasAlt,
                            altName: staff.alt?.name || '',
                            altRole: staff.alt?.role || '',
                            altBio: staff.alt?.bio || '',
                            altImage: staff.alt?.image || ''
                          });
                          setEditingStaff(staff.id);
                          setShowStaffForm(true);
                        }}
                        className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setData(prev => ({
                          ...prev,
                          staff: prev.staff.filter(s => s.id !== staff.id)
                        }))}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-yellow-300 font-semibold mb-2">{staff.role}</p>
                  <p className="text-gray-400 text-sm mb-3">{staff.bio}</p>
                  {staff.isManager && (
                    <span className="inline-block bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold mb-2">
                      {staff.managerFlag}
                    </span>
                  )}
                  {staff.hasAlt && (
                    <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Has Alt Character
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings View */}
        {adminView === 'settings' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-yellow-500/20 animate-fade-in">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Site Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                <input
                  type="text"
                  defaultValue="The Golden Chocobo"
                  className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Alt Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={staffForm.altImage}
                          onChange={(e) => setStaffForm({...staffForm, altImage: e.target.value})}
                          className="flex-1 p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowImageManager(true)}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStaffForm(false);
                    setEditingStaff(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Editor Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-yellow-500/30 w-full max-w-6xl max-h-[90vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-yellow-400">
                Edit Page: {data.pages.find(p => p.id === editingPage)?.title}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const page = data.pages.find(p => p.id === editingPage);
                    if (page) {
                      updatePage(editingPage, { published: !page.published });
                    }
                  }}
                  className={`px-4 py-2 rounded font-semibold transition-colors ${
                    data.pages.find(p => p.id === editingPage)?.published
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-gray-600 hover:bg-gray-500 text-white'
                  }`}
                >
                  {data.pages.find(p => p.id === editingPage)?.published ? 'Published' : 'Publish'}
                </button>
                <button
                  onClick={() => setEditingPage(null)}
                  className="text-gray-400 hover:text-white p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Page Settings */}
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    value={data.pages.find(p => p.id === editingPage)?.title || ''}
                    onChange={(e) => updatePage(editingPage, { title: e.target.value })}
                    placeholder="Page Title"
                    className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                  />
                  <input
                    value={data.pages.find(p => p.id === editingPage)?.slug || ''}
                    onChange={(e) => updatePage(editingPage, { slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="page-url-slug"
                    className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                  />
                </div>
              </div>

              {/* Enhanced Content Editor */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-yellow-400">Page Content Builder</h3>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'hero',
                            data: {
                              title: 'New Hero Section',
                              subtitle: 'Add your subtitle here',
                              backgroundImage: 'https://via.placeholder.com/1200x600/000000/FFD700?text=Hero+Background',
                              alignment: 'center',
                              effects: 'fadeIn'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Hero Section"
                    >
                      <Image className="w-4 h-4" />
                      Hero
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'header',
                            data: {
                              text: 'New Header',
                              size: 'h2',
                              alignment: 'center',
                              effects: 'slideUp'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Header"
                    >
                      <Type className="w-4 h-4" />
                      Header
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'text',
                            data: {
                              content: 'Add your text content here...',
                              alignment: 'left',
                              effects: 'fadeIn'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Text Block"
                    >
                      <FileText className="w-4 h-4" />
                      Text
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'image',
                            data: {
                              src: 'https://via.placeholder.com/600x400/2a2a2a/FFD700?text=Your+Image',
                              alt: 'Image description',
                              size: 'medium',
                              alignment: 'center',
                              effects: 'fadeIn'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Image"
                    >
                      <Image className="w-4 h-4" />
                      Image
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'button',
                            data: {
                              text: 'Click Me',
                              link: '#',
                              style: 'primary',
                              alignment: 'center',
                              effects: 'pulse'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Button"
                    >
                      <MousePointer className="w-4 h-4" />
                      Button
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'divider',
                            data: {
                              style: 'line',
                              effects: 'fadeIn'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Divider"
                    >
                      <Minus className="w-4 h-4" />
                      Divider
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'html',
                            data: {
                              htmlContent: '<div style="padding: 20px; background: #333; border-radius: 8px; text-align: center;">\n  <h3 style="color: #FFD700; margin: 0;">Custom HTML Block</h3>\n  <p style="color: #ccc; margin: 10px 0 0 0;">Add your custom HTML/CSS or embed codes here</p>\n</div>',
                              effects: 'fadeIn'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add HTML/Embed"
                    >
                      <Code className="w-4 h-4" />
                      HTML
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.pages.find(p => p.id === editingPage)?.content?.map((item: any) => (
                    <ContentComponent
                      key={item.id}
                      item={item}
                      isEditing={true}
                      onUpdate={(itemId: string, newData: any) => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const updatedContent = page.content.map(c =>
                            c.id === itemId ? { ...c, data: newData } : c
                          );
                          updatePage(editingPage, { content: updatedContent });
                        }
                      }}
                      onDelete={(itemId: string) => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const updatedContent = page.content.filter(c => c.id !== itemId);
                          updatePage(editingPage, { content: updatedContent });
                        }
                      }}
                    />
                  ))}

                  {(!data.pages.find(p => p.id === editingPage)?.content?.length) && (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-600 rounded-lg">
                      <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                      <p className="text-lg mb-2">No content blocks yet</p>
                      <p className="text-sm">Use the buttons above to add your first content block</p>
                      <p className="text-xs mt-2 text-gray-500">Pro tip: Start with a Hero section for impact!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showThemeEditor && <ThemeEditor />}
      {showImageManager && <ImageManager />}
    </div>
  );
};

// Add custom CSS animations
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-slide-up {
    animation: slideUp 0.6s ease-out;
  }

  .animate-slide-down {
    animation: slideDown 0.6s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

export default VenueCMS;
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Footer Text</label>
                <input
                  type="text"
                  defaultValue={data.footer.text}
                  className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">BlueSky URL</label>
                  <input
                    type="text"
                    defaultValue={data.footer.socialLinks.bluesky}
                    className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Discord URL</label>
                  <input
                    type="text"
                    defaultValue={data.footer.socialLinks.discord}
                    className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                  />
                </div>
              </div>
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded font-semibold transition-all duration-300 transform hover:scale-105">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Staff Form Modal */}
      {showStaffForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-yellow-500/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-yellow-400">
                {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
              </h2>
              <button
                onClick={() => {
                  setShowStaffForm(false);
                  setEditingStaff(null);
                  setStaffForm({
                    name: '', role: '', bio: '', image: '', isManager: false, managerFlag: '',
                    hasAlt: false, altName: '', altRole: '', altBio: '', altImage: ''
                  });
                }}
                className="text-gray-400 hover:text-white p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleStaffSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                    className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <input
                    type="text"
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({...staffForm, role: e.target.value})}
                    className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  value={staffForm.bio}
                  onChange={(e) => setStaffForm({...staffForm, bio: e.target.value})}
                  className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white h-24 transition-all duration-300 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={staffForm.image}
                    onChange={(e) => setStaffForm({...staffForm, image: e.target.value})}
                    className="flex-1 p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowImageManager(true)}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={staffForm.isManager}
                    onChange={(e) => setStaffForm({...staffForm, isManager: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Is Manager</span>
                </label>

                {staffForm.isManager && (
                  <input
                    type="text"
                    placeholder="Manager Flag Text"
                    value={staffForm.managerFlag}
                    onChange={(e) => setStaffForm({...staffForm, managerFlag: e.target.value})}
                    className="flex-1 p-2 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                  />
                )}
              </div>

              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={staffForm.hasAlt}
                    onChange={(e) => setStaffForm({...staffForm, hasAlt: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Has Alt Character</span>
                </label>

                {staffForm.hasAlt && (
                  <div className="space-y-4 border-t border-gray-600 pt-4">
                    <h3 className="text-lg font-semibold text-yellow-400">Alt Character Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Alt Name</label>
                        <input
                          type="text"
                          value={staffForm.altName}
                          onChange={(e) => setStaffForm({...staffForm, altName: e.target.value})}
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Alt Role</label>
                        <input
                          type="text"
                          value={staffForm.altRole}
                          onChange={(e) => setStaffForm({...staffForm, altRole: e.target.value})}
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Alt Bio</label>
                      <textarea
                        value={staffForm.altBio}
                        onChange={(e) => setStaffForm({...staffForm, altBio: e.target.value})}
 className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white h-24 transition-all duration-300 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Alt Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={staffForm.altImage}
                          onChange={(e) => setStaffForm({...staffForm, altImage: e.target.value})}
                          className="flex-1 p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowImageManager(true)}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStaffForm(false);
                    setEditingStaff(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Editor Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-yellow-500/30 w-full max-w-6xl max-h-[90vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-yellow-400">
                Edit Page: {data.pages.find(p => p.id === editingPage)?.title}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const page = data.pages.find(p => p.id === editingPage);
                    if (page) {
                      updatePage(editingPage, { published: !page.published });
                    }
                  }}
                  className={`px-4 py-2 rounded font-semibold transition-colors ${
                    data.pages.find(p => p.id === editingPage)?.published
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-gray-600 hover:bg-gray-500 text-white'
                  }`}
                >
                  {data.pages.find(p => p.id === editingPage)?.published ? 'Published' : 'Publish'}
                </button>
                <button
                  onClick={() => setEditingPage(null)}
                  className="text-gray-400 hover:text-white p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Page Settings */}
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    value={data.pages.find(p => p.id === editingPage)?.title || ''}
                    onChange={(e) => updatePage(editingPage, { title: e.target.value })}
                    placeholder="Page Title"
                    className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                  />
                  <input
                    value={data.pages.find(p => p.id === editingPage)?.slug || ''}
                    onChange={(e) => updatePage(editingPage, { slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="page-url-slug"
                    className="w-full p-3 bg-black/50 border border-gray-600 rounded text-white transition-all duration-300 focus:border-yellow-500"
                  />
                </div>
              </div>

              {/* Enhanced Content Editor */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-yellow-400">Page Content Builder</h3>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'hero',
                            data: {
                              title: 'New Hero Section',
                              subtitle: 'Add your subtitle here',
                              backgroundImage: 'https://via.placeholder.com/1200x600/000000/FFD700?text=Hero+Background',
                              alignment: 'center',
                              effects: 'fadeIn'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Hero Section"
                    >
                      <Image className="w-4 h-4" />
                      Hero
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'header',
                            data: {
                              text: 'New Header',
                              size: 'h2',
                              alignment: 'center',
                              effects: 'slideUp'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Header"
                    >
                      <Type className="w-4 h-4" />
                      Header
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'text',
                            data: {
                              content: 'Add your text content here...',
                              alignment: 'left',
                              effects: 'fadeIn'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Text Block"
                    >
                      <FileText className="w-4 h-4" />
                      Text
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'image',
                            data: {
                              src: 'https://via.placeholder.com/600x400/2a2a2a/FFD700?text=Your+Image',
                              alt: 'Image description',
                              size: 'medium',
                              alignment: 'center',
                              effects: 'fadeIn'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Image"
                    >
                      <Image className="w-4 h-4" />
                      Image
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'button',
                            data: {
                              text: 'Click Me',
                              link: '#',
                              style: 'primary',
                              alignment: 'center',
                              effects: 'pulse'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Button"
                    >
                      <MousePointer className="w-4 h-4" />
                      Button
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'divider',
                            data: {
                              style: 'line',
                              effects: 'fadeIn'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add Divider"
                    >
                      <Minus className="w-4 h-4" />
                      Divider
                    </button>
                    <button
                      onClick={() => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const newContent = [...page.content, {
                            id: Date.now().toString(),
                            type: 'html',
                            data: {
                              htmlContent: '<div style="padding: 20px; background: #333; border-radius: 8px; text-align: center;">\n  <h3 style="color: #FFD700; margin: 0;">Custom HTML Block</h3>\n  <p style="color: #ccc; margin: 10px 0 0 0;">Add your custom HTML/CSS or embed codes here</p>\n</div>',
                              effects: 'fadeIn'
                            }
                          }];
                          updatePage(editingPage, { content: newContent });
                        }
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                      title="Add HTML/Embed"
                    >
                      <Code className="w-4 h-4" />
                      HTML
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.pages.find(p => p.id === editingPage)?.content?.map((item: any) => (
                    <ContentComponent
                      key={item.id}
                      item={item}
                      isEditing={true}
                      onUpdate={(itemId: string, newData: any) => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const updatedContent = page.content.map(c =>
                            c.id === itemId ? { ...c, data: newData } : c
                          );
                          updatePage(editingPage, { content: updatedContent });
                        }
                      }}
                      onDelete={(itemId: string) => {
                        const page = data.pages.find(p => p.id === editingPage);
                        if (page) {
                          const updatedContent = page.content.filter(c => c.id !== itemId);
                          updatePage(editingPage, { content: updatedContent });
                        }
                      }}
                    />
                  ))}

                  {(!data.pages.find(p => p.id === editingPage)?.content?.length) && (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-600 rounded-lg">
                      <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                      <p className="text-lg mb-2">No content blocks yet</p>
                      <p className="text-sm">Use the buttons above to add your first content block</p>
                      <p className="text-xs mt-2 text-gray-500">Pro tip: Start with a Hero section for impact!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showThemeEditor && <ThemeEditor />}
      {showImageManager && <ImageManager />}
    </div>
  );
};

// Add custom CSS animations
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-slide-up {
    animation: slideUp 0.6s ease-out;
  }

  .animate-slide-down {
    animation: slideDown 0.6s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

export default VenueCMS;
