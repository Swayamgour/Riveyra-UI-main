import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const BASE_URL = "https://lead-crm-backend-1cq8.onrender.com/api";
const BASE_URL = "https://riveyra.admin.amaxjobs.com/api/v1";

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
        if (endpoint !== "createProject") {
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
        "contact"
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
        })

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


    useGetContactQuery,
    useCreateContactMutation,


    useRegisterMutation,
    useLoginMutation,
    useCheckTokenQuery,
    useGetProfileQuery


} = api;


