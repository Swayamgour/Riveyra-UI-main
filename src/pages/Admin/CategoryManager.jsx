import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBreakpoint } from "../../hooks/useBreakpoint";

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/api";

import CategoryForm from "./CategoryForm";
import CategoryCard from "./CategoryCard";

export default function CategoryManager() {
  const { isMobile, isTablet } = useBreakpoint();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const {
    data,
    isLoading,
    isError,
  } = useGetCategoriesQuery();

  const categories = data?.data || [];

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // ============================
  // CREATE / UPDATE
  // ============================

  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await updateCategory({
          id: editing._id,
          data: values,
        }).unwrap();
      } else {
        await createCategory(values).unwrap();
      }

      setEditing(null);
      setShowForm(false);
    } catch (err) {
      console.log(err);
      alert(err?.data?.message || "Something went wrong");
    }
  };

  // ============================
  // EDIT
  // ============================

  const handleEdit = (category) => {
    setEditing(category);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================
  // DELETE
  // ============================

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Delete this category?"
    );

    if (!ok) return;

    try {
      await deleteCategory(id).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  // ============================
  // CANCEL
  // ============================

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div
      style={{
        maxWidth: 1300,
        margin: "0 auto",
      }}
    >
      {/* ================= HEADER ================= */}

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
          <span
            style={{
              color: "#60a5fa",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Blog Management
          </span>

          <h2
            style={{
              fontSize: isMobile ? 34 : 44,
              marginTop: 8,
              marginBottom: 8,
              fontFamily: "var(--font-display)",
            }}
          >
            Categories
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,.6)",
            }}
          >
            Create and manage blog categories.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? "Close" : "+ Add Category"}
        </button>
      </motion.div>

      {/* ================= FORM ================= */}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: .25,
            }}
            style={{
              marginBottom: 40,
            }}
          >
            <CategoryForm
              initialData={editing}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= COUNT ================= */}

      <div
        style={{
          marginBottom: 25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontSize: 22,
          }}
        >
          Categories ({categories.length})
        </h3>
      </div>

      {/* ================= LOADING ================= */}

      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#999",
          }}
        >
          Loading...
        </div>
      )}

      {/* ================= ERROR ================= */}

      {isError && (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#ef4444",
          }}
        >
          Failed to load categories.
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!isLoading && !isError &&
        categories.length === 0 && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            style={{
              padding: 60,
              borderRadius: 20,
              textAlign: "center",
              background:
                "rgba(255,255,255,.02)",
              border:
                "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div
              style={{
                fontSize: 50,
                marginBottom: 15,
              }}
            >
              📁
            </div>

            <h3>No Categories Found</h3>

            <p
              style={{
                marginTop: 10,
                color: "rgba(255,255,255,.55)",
              }}
            >
              Create your first blog category.
            </p>
          </motion.div>
        )}

      {/* ================= GRID ================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
            ? "repeat(2,1fr)"
            : "repeat(3,1fr)",
          gap: 24,
        }}
      >
        {categories.map((category, index) => (
          <CategoryCard
            key={category._id}
            category={category}
            index={index}
            isMobile={isMobile}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}