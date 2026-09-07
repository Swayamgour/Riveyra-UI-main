import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import {
  useGetNavDropdownItemsQuery,
  useCreateNavDropdownItemMutation,
  useUpdateNavDropdownItemMutation,
  useDeleteNavDropdownItemMutation,
  useAddSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useUploadServiceImageMutation,
} from "../../redux/api";

// ---- Shared styles (kept simple & consistent) ----
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.2)",
  color: "white",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
};

const btnPrimary = {
  padding: "10px 20px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 14,
};

const btnGhost = {
  ...btnPrimary,
  background: "rgba(255,255,255,0.08)",
};

const btnDanger = {
  ...btnPrimary,
  background: "rgba(239,68,68,0.15)",
  color: "#f87171",
  border: "1px solid rgba(239,68,68,0.3)",
  padding: "8px 14px",
  fontSize: "13px",
};

const card = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
};

export default function NavDropdownManager() {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  const { data, isLoading, isError } = useGetNavDropdownItemsQuery();
  const items = data?.data || [];

  const [createItem, { isLoading: isCreatingCategory }] = useCreateNavDropdownItemMutation();
  const [updateItem, { isLoading: isUpdatingCategory }] = useUpdateNavDropdownItemMutation();
  const [deleteItem] = useDeleteNavDropdownItemMutation();

  const [addSubcategory, { isLoading: isAddingSub }] = useAddSubcategoryMutation();
  const [updateSubcategory, { isLoading: isUpdatingSub }] = useUpdateSubcategoryMutation();
  const [deleteSubcategory] = useDeleteSubcategoryMutation();

  const [uploadImage, { isLoading: isUploadingImg }] = useUploadServiceImageMutation();

  // STEP 1: which category is open (drill-in view). null = show the category grid.
  const [activeCategorySlug, setActiveCategorySlug] = useState(null);
  const activeCategory = items.find((c) => c.categorySlug === activeCategorySlug) || null;

  // Keep the drilled-in category in sync after refetches (e.g. after adding a subcategory)
  useEffect(() => {
    if (activeCategorySlug && !activeCategory && !isLoading) {
      // category no longer exists (deleted) -> go back to grid
      setActiveCategorySlug(null);
    }
  }, [activeCategorySlug, activeCategory, isLoading]);

  // ---------------- STEP 1: CATEGORY FORM ----------------
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // category object or null (create mode)
  const [categoryForm, setCategoryForm] = useState({ categories: "", desc: "", icon: "" });

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ categories: "", desc: "", icon: "" });
    setShowCategoryForm(true);
  };

  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({ categories: cat.categories || "", desc: cat.desc || "", icon: cat.icon || "" });
    setShowCategoryForm(true);
  };

  const submitCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.categories.trim()) return;
    try {
      if (editingCategory) {
        await updateItem({ id: editingCategory._id, data: categoryForm }).unwrap();
      } else {
        await createItem(categoryForm).unwrap();
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryForm({ categories: "", desc: "", icon: "" });
    } catch (err) {
      alert(err?.data?.message || "Something went wrong while saving the category.");
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete "${cat.categories}"? This also removes all of its subcategories.`)) return;
    try {
      await deleteItem(cat._id).unwrap();
      if (activeCategorySlug === cat.categorySlug) setActiveCategorySlug(null);
    } catch {
      alert("Failed to delete category.");
    }
  };

  // ---------------- STEP 2: SUBCATEGORY FORM ----------------
  const [showSubForm, setShowSubForm] = useState(false);
  const [editingSub, setEditingSub] = useState(null); // subcategory slug being edited, or null
  const [subForm, setSubForm] = useState({ name: "", desc: "", icon: "" });

  const openCreateSub = () => {
    setEditingSub(null);
    setSubForm({ name: "", desc: "", icon: "" });
    setShowSubForm(true);
  };

  const openEditSub = (sub) => {
    setEditingSub(sub.slug);
    setSubForm({ name: sub.name || "", desc: sub.desc || "", icon: sub.icon || "" });
    setShowSubForm(true);
  };

  const submitSub = async (e) => {
    e.preventDefault();
    if (!subForm.name.trim() || !activeCategory) return;
    try {
      if (editingSub) {
        await updateSubcategory({
          categorySlug: activeCategory.categorySlug,
          subcategorySlug: editingSub,
          data: subForm,
        }).unwrap();
      } else {
        await addSubcategory({
          categorySlug: activeCategory.categorySlug,
          data: subForm,
        }).unwrap();
      }
      setShowSubForm(false);
      setEditingSub(null);
      setSubForm({ name: "", desc: "", icon: "" });
    } catch (err) {
      alert(err?.data?.message || "Something went wrong while saving the subcategory.");
    }
  };

  const handleDeleteSub = async (sub) => {
    if (!activeCategory) return;
    if (!window.confirm(`Delete subcategory "${sub.name}"? Its detail page (if any) will remain but won't be linked from here anymore.`)) return;
    try {
      await deleteSubcategory({ categorySlug: activeCategory.categorySlug, subcategorySlug: sub.slug }).unwrap();
    } catch {
      alert("Failed to delete subcategory.");
    }
  };

  const handleIconUpload = async (e, onDone) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await uploadImage(data).unwrap();
      if (res.success) onDone(res.url);
    } catch (err) {
      alert(err?.data?.message || "Image upload failed");
    }
  };

  // STEP 3: open the detail-page editor in a new tab, scoped to this exact subcategory
  const openDetailEditor = (sub) => {
    if (!activeCategory) return;
    window.open(`/admin/servicesDetailTwo/${activeCategory.categorySlug}/${sub.slug}`, "_blank");
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
          marginBottom: 30,
        }}
      >
        <div>
          <span style={{ color: "#60a5fa", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>
            Step 1 → 2 → 3
          </span>
          <h2 style={{ fontSize: isMobile ? 30 : 40, marginTop: 8, marginBottom: 8, fontFamily: "var(--font-display)" }}>
            {activeCategory ? activeCategory.categories : "Service Categories"}
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)" }}>
            {activeCategory
              ? "Add subcategories, then open each one's detail page in a new tab."
              : "Step 1: create a category. Step 2: add its subcategories. Step 3: fill in each subcategory's detail page."}
          </p>
        </div>

        {!activeCategory ? (
          <button style={btnPrimary} onClick={openCreateCategory}>+ Add Category</button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button style={btnGhost} onClick={() => setActiveCategorySlug(null)}>← Back to Categories</button>
            <button style={btnPrimary} onClick={openCreateSub}>+ Add Subcategory</button>
          </div>
        )}
      </motion.div>

      {/* ================= STEP 1: CATEGORY LIST + FORM ================= */}
      {!activeCategory && (
        <>
          <AnimatePresence>
            {showCategoryForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", marginBottom: 30 }}
              >
                <form onSubmit={submitCategory} style={{ ...card, padding: 24 }}>
                  <h3 style={{ marginBottom: 16 }}>{editingCategory ? "Edit Category" : "New Category"}</h3>
                  <label style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                    Category Name
                  </label>
                  <input
                    style={{ ...inputStyle, marginBottom: 14 }}
                    placeholder="e.g. Web Development"
                    value={categoryForm.categories}
                    onChange={(e) => setCategoryForm({ ...categoryForm, categories: e.target.value })}
                    required
                    autoFocus
                  />
                  <label style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                    Short Description
                  </label>
                  <textarea
                    style={{ ...inputStyle, marginBottom: 14, minHeight: 70 }}
                    placeholder="One or two lines about this category"
                    value={categoryForm.desc}
                    onChange={(e) => setCategoryForm({ ...categoryForm, desc: e.target.value })}
                  />
                  <label style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                    Icon (URL or upload)
                  </label>
                  <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
                    {categoryForm.icon && (
                      <img src={categoryForm.icon} alt="" style={{ width: 36, height: 36, objectFit: "contain" }} />
                    )}
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Icon URL"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImg}
                      onChange={(e) => handleIconUpload(e, (url) => setCategoryForm((f) => ({ ...f, icon: url })))}
                      style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit" disabled={isCreatingCategory || isUpdatingCategory} style={btnPrimary}>
                      {isCreatingCategory || isUpdatingCategory ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                    </button>
                    <button type="button" style={btnGhost} onClick={() => setShowCategoryForm(false)}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading && <p style={{ color: "rgba(255,255,255,0.6)" }}>Loading categories...</p>}
          {isError && <p style={{ color: "#f87171" }}>Error loading categories.</p>}

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {items.map((item) => (
              <div key={item._id} style={{ ...card, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  {item.icon && <img src={item.icon} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />}
                  <h4 style={{ fontSize: 19, color: "#60a5fa", margin: 0 }}>{item.categories}</h4>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {item.desc}
                </p>
                <div style={{ display: "flex", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>
                  <span>{item.subcategories?.length || 0} subcategories</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...btnPrimary, flex: 1 }} onClick={() => setActiveCategorySlug(item.categorySlug)}>
                    Manage Subcategories →
                  </button>
                  <button style={btnGhost} onClick={() => openEditCategory(item)}>Edit</button>
                  <button style={btnDanger} onClick={() => handleDeleteCategory(item)}>Delete</button>
                </div>
              </div>
            ))}
            {!isLoading && items.length === 0 && (
              <div style={{ ...card, padding: 40, textAlign: "center", color: "rgba(255,255,255,0.5)", gridColumn: "1 / -1" }}>
                No categories yet — click "+ Add Category" to create your first one.
              </div>
            )}
          </div>
        </>
      )}

      {/* ================= STEP 2 & 3: SUBCATEGORIES OF THE ACTIVE CATEGORY ================= */}
      {activeCategory && (
        <>
          <AnimatePresence>
            {showSubForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", marginBottom: 30 }}
              >
                <form onSubmit={submitSub} style={{ ...card, padding: 24 }}>
                  <h3 style={{ marginBottom: 16 }}>{editingSub ? "Edit Subcategory" : "New Subcategory"}</h3>
                  <label style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                    Subcategory Name
                  </label>
                  <input
                    style={{ ...inputStyle, marginBottom: 14 }}
                    placeholder="e.g. E-commerce Development"
                    value={subForm.name}
                    onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                    required
                    autoFocus
                  />
                  <label style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                    Short Description
                  </label>
                  <textarea
                    style={{ ...inputStyle, marginBottom: 14, minHeight: 70 }}
                    placeholder="One or two lines about this subcategory"
                    value={subForm.desc}
                    onChange={(e) => setSubForm({ ...subForm, desc: e.target.value })}
                  />
                  <label style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                    Icon (URL or upload)
                  </label>
                  <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
                    {subForm.icon && <img src={subForm.icon} alt="" style={{ width: 36, height: 36, objectFit: "contain" }} />}
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Icon URL"
                      value={subForm.icon}
                      onChange={(e) => setSubForm({ ...subForm, icon: e.target.value })}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImg}
                      onChange={(e) => handleIconUpload(e, (url) => setSubForm((f) => ({ ...f, icon: url })))}
                      style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit" disabled={isAddingSub || isUpdatingSub} style={btnPrimary}>
                      {isAddingSub || isUpdatingSub ? "Saving..." : editingSub ? "Save Changes" : "Add Subcategory"}
                    </button>
                    <button type="button" style={btnGhost} onClick={() => setShowSubForm(false)}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
            {(activeCategory.subcategories || []).map((sub) => (
              <div key={sub.slug} style={{ ...card, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  {sub.icon && <img src={sub.icon} alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />}
                  <h4 style={{ fontSize: 16, margin: 0, color: "#fff" }}>{sub.name}</h4>
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginBottom: 8, minHeight: 18 }}>{sub.desc}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 14, fontFamily: "monospace" }}>
                  /{activeCategory.categorySlug}/{sub.slug}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={{ ...btnPrimary, background: "#10b981", flex: 1, minWidth: 150 }} onClick={() => openDetailEditor(sub)}>
                    Add/Edit Detail Page ↗
                  </button>
                  <button style={btnGhost} onClick={() => openEditSub(sub)}>Edit</button>
                  <button style={btnDanger} onClick={() => handleDeleteSub(sub)}>Delete</button>
                </div>
              </div>
            ))}
            {(!activeCategory.subcategories || activeCategory.subcategories.length === 0) && (
              <div style={{ ...card, padding: 40, textAlign: "center", color: "rgba(255,255,255,0.5)", gridColumn: "1 / -1" }}>
                No subcategories yet — click "+ Add Subcategory" above to create your first one.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
