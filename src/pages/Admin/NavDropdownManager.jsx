import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import {
  useGetNavDropdownItemsQuery,
  useCreateNavDropdownItemMutation,
  useUpdateNavDropdownItemMutation,
  useDeleteNavDropdownItemMutation,
  useUploadServiceImageMutation,
} from "../../redux/api";

export default function NavDropdownManager() {
  const { isMobile, isTablet } = useBreakpoint();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading, isError } = useGetNavDropdownItemsQuery();
  const items = data?.data || [];

  const [createItem, { isLoading: isCreating }] = useCreateNavDropdownItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateNavDropdownItemMutation();
  const [deleteItem] = useDeleteNavDropdownItemMutation();
  const [uploadImage, { isLoading: isUploadingImg }] = useUploadServiceImageMutation();

  // FORM STATE
  const [formData, setFormData] = useState({
    categories: "",
    desc: "",
    subcategories: [],
    techTools: []
  });

  useEffect(() => {
    if (editing) {
      setFormData({
        categories: editing.categories || "",
        desc: editing.desc || "",
        subcategories: editing.subcategories ? JSON.parse(JSON.stringify(editing.subcategories)) : [],
        techTools: editing.techTools ? JSON.parse(JSON.stringify(editing.techTools)) : []
      });
    } else {
      setFormData({ categories: "", desc: "", subcategories: [], techTools: [] });
    }
  }, [editing]);

  // HANDLERS
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubcategoryAdd = () => {
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, { name: "", desc: "" }]
    });
  };

  const handleSubcategoryChange = (index, field, value) => {
    const updated = [...formData.subcategories];
    updated[index][field] = value;
    setFormData({ ...formData, subcategories: updated });
  };

  const handleSubcategoryRemove = (index) => {
    const updated = formData.subcategories.filter((_, i) => i !== index);
    setFormData({ ...formData, subcategories: updated });
  };

  const handleToolAdd = () => {
    setFormData({
      ...formData,
      techTools: [...formData.techTools, { name: "", icon: "" }]
    });
  };

  const handleToolChange = (index, field, value) => {
    const updated = [...formData.techTools];
    updated[index][field] = value;
    setFormData({ ...formData, techTools: updated });
  };

  const handleToolRemove = (index) => {
    const updated = formData.techTools.filter((_, i) => i !== index);
    setFormData({ ...formData, techTools: updated });
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    try {
      const res = await uploadImage(data).unwrap();
      if (res.success) {
        handleToolChange(index, 'icon', res.url);
      }
    } catch (err) {
      alert(err?.data?.message || "Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateItem({ id: editing._id, data: formData }).unwrap();
      } else {
        await createItem(formData).unwrap();
      }
      setEditing(null);
      setShowForm(false);
      setFormData({ categories: "", desc: "", subcategories: [], techTools: [] });
    } catch (err) {
      alert(err?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this navigation item completely?")) return;
    try {
      await deleteItem(id).unwrap();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  // STYLES (Admin defaults)
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'white',
    outline: 'none',
    fontSize: '14px',
    marginBottom: '16px'
  };

  const btnPrimary = {
    padding: '10px 20px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const btnDanger = {
    ...btnPrimary,
    background: '#ef4444',
    padding: '6px 12px',
    fontSize: '12px'
  };

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto" }}>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
          gap: 20,
          marginBottom: 35,
        }}
      >
        <div>
          <span style={{ color: "#60a5fa", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>
            Navigation Management
          </span>
          <h2 style={{ fontSize: isMobile ? 34 : 44, marginTop: 8, marginBottom: 8, fontFamily: "var(--font-display)" }}>
            Navbar Dropdowns
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)" }}>Manage categories, subcategories, and tools in the dropdown menu.</p>
        </div>
        <button
          style={btnPrimary}
          onClick={() => {
            setEditing(null);
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? "Close Form" : "+ Add Dropdown Category"}
        </button>
      </motion.div>

      {/* FORM SECTION */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 40 }}
          >
            <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ marginBottom: 20 }}>{editing ? 'Edit Dropdown Category' : 'Create Dropdown Category'}</h3>
              
              <label style={{ display: 'block', marginBottom: 8, color: 'rgba(255,255,255,0.7)' }}>Category Name (e.g. Services, Development)</label>
              <input name="categories" value={formData.categories} onChange={handleChange} style={inputStyle} required />

              <label style={{ display: 'block', marginBottom: 8, color: 'rgba(255,255,255,0.7)' }}>Category Description (Short summary)</label>
              <textarea name="desc" value={formData.desc} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '30px 0' }} />

              {/* SUBCATEGORIES */}
              <div style={{ marginBottom: 30 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <h4>Subcategories (Left Panel)</h4>
                  <button type="button" onClick={handleSubcategoryAdd} style={{ ...btnPrimary, background: '#10b981', padding: '6px 12px', fontSize: 12 }}>+ Add Subcategory</button>
                </div>
                {formData.subcategories.map((sub, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 8, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <input placeholder="Name (e.g. web app development)" value={sub.name} onChange={(e) => handleSubcategoryChange(idx, 'name', e.target.value)} style={{ ...inputStyle, marginBottom: 10 }} />
                      <input placeholder="Description" value={sub.desc} onChange={(e) => handleSubcategoryChange(idx, 'desc', e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
                    </div>
                    <button type="button" onClick={() => handleSubcategoryRemove(idx)} style={btnDanger}>X</button>
                  </div>
                ))}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '30px 0' }} />

              {/* TECH TOOLS */}
              <div style={{ marginBottom: 30 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <h4>Tech Tools (Right Panel)</h4>
                  <button type="button" onClick={handleToolAdd} style={{ ...btnPrimary, background: '#10b981', padding: '6px 12px', fontSize: 12 }}>+ Add Tool</button>
                </div>
                {formData.techTools.map((tool, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 8, marginBottom: 10 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input placeholder="Tool Name (e.g. React)" value={tool.name} onChange={(e) => handleToolChange(idx, 'name', e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
                      <div style={{ display: 'flex', gap: 10 }}>
                          {tool.icon && <img src={tool.icon} alt="Icon Preview" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />}
                          <input placeholder="Icon URL" value={tool.icon} onChange={(e) => handleToolChange(idx, 'icon', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, idx)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} disabled={isUploadingImg} />
                      </div>
                    </div>
                    <button type="button" onClick={() => handleToolRemove(idx)} style={btnDanger}>X</button>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={isCreating || isUpdating} style={{ ...btnPrimary, width: '100%', padding: '14px', fontSize: '16px' }}>
                {isCreating || isUpdating ? 'Saving...' : 'Save Configuration'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIST VIEW */}
      <div>
        <h3 style={{ marginBottom: 20 }}>Existing Categories ({items.length})</h3>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading categories.</p>}
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {items.map(item => (
            <div key={item._id} style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ fontSize: 20, marginBottom: 5, color: '#60a5fa' }}>{item.categories}</h4>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 15, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
              
              <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
                <span>{item.subcategories?.length || 0} Subcats</span>
                <span>•</span>
                <span>{item.techTools?.length || 0} Tech Tools</span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  onClick={() => {
                    setEditing(item);
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ ...btnPrimary, flex: 1, background: 'rgba(255,255,255,0.1)' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  style={{ ...btnDanger, flex: 1 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
