import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const BASE_URL = "https://lead-crm-backend-1cq8.onrender.com/api";
// const BASE_URL = "https://riveyra.admin.amaxjobs.com/api/v1";
const BASE_URL = "http://localhost:5007/api/v1";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { endpoint }) => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        // 🔥 IMPORTANT: JSON header only for non-file APIs
        // if (endpoint !== "createProject") {
        //     headers.set("Content-Type", "application/json");
        // }

        if (
            endpoint !== "createProject" &&
            endpoint !== "updateProject" &&
            endpoint !== "createBlog" &&
            endpoint !== "updateBlog" &&
            endpoint !== "uploadServiceImage"
        ) {
            headers.set("Content-Type", "application/json");
        }

        return headers;
    },
});

export const api = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: [
        "Projects",
        "Careers",
        "Services",
        "Categories",
        "Blogs",
        "contact",
        "PageSeo",
        "ServicesDetailTwo",
        "NavDropdown"
    ],

    endpoints: (builder) => ({

        // ================= PROJECTS =================

        getProjects: builder.query({
            query: () => "/projects",
            providesTags: ["Projects"],
        }),



        getProjectBySlug: builder.query({
            query: (slug) => `/projects/${slug}`,
            providesTags: ["Projects"],
        }),

        createProject: builder.mutation({
            query: (formData) => ({
                url: "/projects",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Projects"],
        }),

        updateProject: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/projects/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Projects"],
        }),

        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Projects"],
        }),


        // ================= CAREERS =================

        getCareers: builder.query({
            query: () => "/careers",
            providesTags: ["Careers"],
        }),

        getCareerBySlug: builder.query({
            query: (id) => `/careers/${id}`,
            providesTags: ["Careers"],
        }),

        createCareer: builder.mutation({
            query: (data) => ({
                url: "/careers",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Careers"],
        }),

        updateCareer: builder.mutation({
            query: ({ id, data }) => ({
                url: `/careers/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Careers"],
        }),

        deleteCareer: builder.mutation({
            query: (id) => ({
                url: `/careers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Careers"],
        }),



        /* ================= SERVICE DETAILS (subcategory page content) ================= */
        // Fetched/saved by slug reference: { categorySlug, subcategorySlug }
        getServicesDetailTwo: builder.query({
            query: ({ categorySlug, subcategorySlug }) => `/service-details/${encodeURIComponent(categorySlug)}/${encodeURIComponent(subcategorySlug)}`,
            providesTags: ["ServicesDetailTwo"],
        }),
        updateServicesDetailTwo: builder.mutation({
            query: (data) => ({
                url: "/service-details",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ServicesDetailTwo"],
        }),
        deleteServicesDetailTwo: builder.mutation({
            query: ({ categorySlug, subcategorySlug }) => ({
                url: `/service-details/${encodeURIComponent(categorySlug)}/${encodeURIComponent(subcategorySlug)}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ServicesDetailTwo"],
        }),
        getLatestTestimonials: builder.query({
            query: () => "/service-details/testimonials/latest",
            providesTags: ["ServicesDetailTwo"],
        }),
        uploadServiceImage: builder.mutation({
            query: (formData) => ({
                url: "/service-details/upload",
                method: "POST",
                body: formData,
            }),
        }),

        /* ================= APPLY JOB ================= */
        applyJob: builder.mutation({
            query: (formData) => ({
                url: "/apply",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Applications"],
        }),

        downloadResume: builder.mutation({
            query: (body) => ({
                url: "/apply/download-url",
                method: "POST",
                body
            }),
            invalidatesTags: ["Applications"],
        }),

        /* ================= GET ALL ================= */
        getApplications: builder.query({
            query: () => "/apply",
            providesTags: ["Applications"],
        }),

        /* ================= GET SINGLE ================= */
        getApplicationById: builder.query({
            query: (id) => `/apply/${id}`,
            providesTags: ["Applications"],
        }),

        /* ================= UPDATE ================= */
        updateApplication: builder.mutation({
            query: ({ id, status }) => ({
                url: `/apply/${id}`,
                method: "PATCH",            // ✅ correct method
                body: { status },
            }),
            invalidatesTags: ["Applications"],
        }),

        deleteApplication: builder.mutation({
            query: (id) => ({
                url: `/apply/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Applications"],
        }),



        getDashboardCounts: builder.query({
            query: () => "/dashboard/counts",
            providesTags: ["Dashboard"],
        }),



        // ✅ GET ALL CATEGORIES (level 1, each with nested subcategories)
        getNavDropdownItems: builder.query({
            query: () => "/service-categories",
            providesTags: ["NavDropdown"],
        }),

        // ✅ GET SINGLE CATEGORY BY SLUG
        getNavDropdownItemByCategory: builder.query({
            query: (categorySlug) => `/service-categories/category/${categorySlug}`,
            providesTags: ["NavDropdown"],
        }),

        // ✅ CREATE CATEGORY (level 1)
        createNavDropdownItem: builder.mutation({
            query: (data) => ({
                url: "/service-categories",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["NavDropdown"],
        }),

        // ✅ UPDATE CATEGORY (level 1, by mongo _id)
        updateNavDropdownItem: builder.mutation({
            query: ({ id, data }) => ({
                url: `/service-categories/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["NavDropdown"],
        }),

        // ✅ DELETE CATEGORY
        deleteNavDropdownItem: builder.mutation({
            query: (id) => ({
                url: `/service-categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["NavDropdown"],
        }),

        // ✅ ADD SUBCATEGORY (level 2, nested under a category)
        addSubcategory: builder.mutation({
            query: ({ categorySlug, data }) => ({
                url: `/service-categories/${categorySlug}/subcategories`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["NavDropdown"],
        }),

        // ✅ UPDATE SUBCATEGORY
        updateSubcategory: builder.mutation({
            query: ({ categorySlug, subcategorySlug, data }) => ({
                url: `/service-categories/${categorySlug}/subcategories/${subcategorySlug}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["NavDropdown"],
        }),

        // ✅ DELETE SUBCATEGORY
        deleteSubcategory: builder.mutation({
            query: ({ categorySlug, subcategorySlug }) => ({
                url: `/service-categories/${categorySlug}/subcategories/${subcategorySlug}`,
                method: "DELETE",
            }),
            invalidatesTags: ["NavDropdown"],
        }),

        // ✅ GET ALL SERVICES
        getServices: builder.query({
            query: () => "/services",
            providesTags: ["Services"],
        }),

        // ✅ GET SINGLE SERVICE (DETAIL PAGE)
        getServiceBySlug: builder.query({
            query: (slug) => `/services/${slug}`,
        }),

        getServiceById: builder.query({
            query: (id) => `/services/id/${id}`,
        }),

        // ✅ CREATE SERVICE
        createService: builder.mutation({
            query: (formData) => ({
                url: "/services",
                method: "POST",
                body: formData, // 👈 FormData hona chahiye
            }),
            invalidatesTags: ["Services"],
        }),
        // ✅ UPDATE SERVICE
        updateService: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/services/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Services"],
        }),

        // ✅ DELETE SERVICE
        deleteService: builder.mutation({
            query: (id) => ({
                url: `/services/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Services"],
        }),

        // ================= CATEGORIES =================

        // GET ALL
        getCategories: builder.query({
            query: () => "/categories",
            providesTags: ["Categories"],
        }),

        // GET SINGLE
        getCategoryById: builder.query({
            query: (id) => `/categories/${id}`,
            providesTags: ["Categories"],
        }),

        // CREATE
        createCategory: builder.mutation({
            query: (data) => ({
                url: "/categories",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Categories"],
        }),

        // UPDATE
        updateCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/categories/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Categories"],
        }),

        // DELETE
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Categories"],
        }),


        // ================= BLOGS =================

        // GET ALL BLOGS (Admin)
        getBlogs: builder.query({
            query: () => "/blogs",
            providesTags: ["Blogs"],
        }),

        // GET PUBLISHED BLOGS (Website)
        getPublishedBlogs: builder.query({
            query: () => "/blogs/published",
            providesTags: ["Blogs"],
        }),

        // GET BLOG BY ID (Admin Edit)
        getBlogById: builder.query({
            query: (id) => `/blogs/id/${id}`,
            providesTags: ["Blogs"],
        }),

        // GET BLOG BY SLUG (Website Detail)
        getBlogBySlug: builder.query({
            query: (slug) => `/blogs/${slug}`,
            providesTags: ["Blogs"],
        }),

        // CREATE BLOG
        createBlog: builder.mutation({
            query: (formData) => ({
                url: "/blogs",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Blogs"],
        }),

        // UPDATE BLOG
        updateBlog: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/blogs/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Blogs"],
        }),

        // DELETE BLOG
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blogs"],
        }),

        // TOGGLE PUBLISH / DRAFT
        toggleBlogStatus: builder.mutation({
            query: (id) => ({
                url: `/blogs/${id}/status`,
                method: "PATCH",
            }),
            invalidatesTags: ["Blogs"],
        }),



        getContact: builder.query({
            query: () => "/contact",
            providesTags: ["contact"],
        }),

        // ✅ CREATE SERVICE
        createContact: builder.mutation({
            query: (body) => ({
                url: "/contact",
                method: "POST",
                body: body, // 👈 FormData hona chahiye
            }),
            invalidatesTags: ["contact"],
        }),


        // REGISTER
        register: builder.mutation({
            query: (data) => ({
                url: 'auth/register',
                method: 'POST',
                body: data
            })
        }),

        // LOGIN
        login: builder.mutation({
            query: (data) => ({
                url: 'auth/login',
                method: 'POST',
                body: data
            })
        }),

        // CHECK TOKEN
        checkToken: builder.query({
            query: () => ({
                url: 'auth/check-token',
                method: 'GET'
            })
        }),

        // PROFILE
        getProfile: builder.query({
            query: () => ({
                url: 'auth/profile',
                method: 'GET'
            }),
            providesTags: ['Profile']
        }),


        // ================= PAGE SEO (Home / About / Contact / Career / Portfolio / Blogs) =================

        // GET ALL PAGE SEO (Admin listing screen)
        getAllPageSeo: builder.query({
            query: () => "/page-seo",
            providesTags: ["PageSeo"],
        }),

        // GET SEO FOR ONE PAGE — page = "home" | "about" | "contact" | "career" | "portfolio" | "blogs"
        // Website ke SEO.jsx component se ye call hoga, e.g. useGetPageSeoQuery("home")
        getPageSeo: builder.query({
            query: (page) => `/page-seo/${page}`,
            providesTags: (result, error, page) => [{ type: "PageSeo", id: page }],
        }),

        // CREATE / UPDATE SEO FOR ONE PAGE (Admin panel — one form per page)
        // usage: updatePageSeo({ page: "home", data: { title, description, image, seo: {...} } })
        updatePageSeo: builder.mutation({
            query: ({ page, data }) => ({
                url: `/page-seo/${page}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { page }) => [
                "PageSeo",
                { type: "PageSeo", id: page },
            ],
        }),

        // RESET A PAGE'S SEO BACK TO AUTO-DEFAULTS
        deletePageSeo: builder.mutation({
            query: (page) => ({
                url: `/page-seo/${page}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, page) => [
                "PageSeo",
                { type: "PageSeo", id: page },
            ],
        }),

    }),
});


// 🔥 EXPORT HOOKS
export const {
    useGetProjectsQuery,
    useGetProjectBySlugQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,


    useGetCareersQuery,
    useGetCareerBySlugQuery,
    useCreateCareerMutation,
    useUpdateCareerMutation,
    useDeleteCareerMutation,


    useApplyJobMutation,
    useGetApplicationsQuery,
    useGetApplicationByIdQuery,
    useUpdateApplicationMutation,
    useDeleteApplicationMutation,
    useDownloadResumeMutation,


    useGetDashboardCountsQuery,


    useGetServicesQuery,
    useGetServiceBySlugQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
    useGetServiceByIdQuery,

    useGetNavDropdownItemsQuery,
    useGetNavDropdownItemByCategoryQuery,
    useCreateNavDropdownItemMutation,
    useUpdateNavDropdownItemMutation,
    useDeleteNavDropdownItemMutation,
    useAddSubcategoryMutation,
    useUpdateSubcategoryMutation,
    useDeleteSubcategoryMutation,

    useGetServicesDetailTwoQuery,
    useUpdateServicesDetailTwoMutation,
    useDeleteServicesDetailTwoMutation,
    useUploadServiceImageMutation,
    useGetLatestTestimonialsQuery,

    // Categories
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,

    // Blogs
    useGetBlogsQuery,
    useGetPublishedBlogsQuery,
    useGetBlogByIdQuery,
    useGetBlogBySlugQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useToggleBlogStatusMutation,


    useGetContactQuery,
    useCreateContactMutation,


    useRegisterMutation,
    useLoginMutation,
    useCheckTokenQuery,
    useGetProfileQuery,


    // Page SEO
    useGetAllPageSeoQuery,
    useGetPageSeoQuery,
    useUpdatePageSeoMutation,
    useDeletePageSeoMutation,


} = api;