import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useBreakpoint } from "../../hooks/useBreakpoint";

import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useToggleBlogStatusMutation,
} from "../../redux/api";

import BlogCard from "./BlogCard";

export default function BlogManager() {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();

  const { data, isLoading, isError } = useGetBlogsQuery();  

  const blogs = data?.data || [];

  const [deleteBlog] = useDeleteBlogMutation();
  const [toggleStatus] = useToggleBlogStatusMutation();

  // ============================
  // EDIT
  // ============================

  const handleEdit = (blog) => {
    navigate(`/admin/blogs/${blog._id}/edit`);
  };

  // ============================
  // DELETE
  // ============================

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Delete this blog?"
    );

    if (!ok) return;

    try {
      await deleteBlog(id).unwrap();
    } catch (err) {
      // console.log(err);
      alert(err?.data?.message || "Something went wrong");
    }
  };

  // ============================
  // TOGGLE STATUS
  // ============================

  const handleStatus = async (id) => {
    try {
      await toggleStatus(id).unwrap();
    } catch (err) {
      // console.log(err);
      alert(err?.data?.message || "Something went wrong");
    }
  };
  
  // console.log(blogs[0]);

  return (
    <div
      style={{
        maxWidth: 1400,
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
            Blogs
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,.6)",
            }}
          >
            Create, edit and publish blog posts.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() =>
            navigate("/admin/blogs/create")
          }
        >
          Add Blog
        </button>
      </motion.div>

      {/* ================= COUNT ================= */}

      <div
        style={{
          marginBottom: 25,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{fontSize: 22}}>
          Blogs ({blogs.length})
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
          Loading blogs...
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
          Failed to load blogs.
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!isLoading &&
        !isError &&
        blogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}          
            animate={{ opacity: 1 }}
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
            <div style={{fontSize: 54, marginBottom: 16}}>
              📝
            </div>

            <h3>No Blogs Found</h3>

          <p style={{ marginTop: 10, color: "rgba(255,255,255,.55)" }}>            
              Create your first blog post.
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
        {blogs.map((blog, index) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            index={index}
            isMobile={isMobile}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleStatus}
          />
        ))}
      </div>
    </div>
  );
}