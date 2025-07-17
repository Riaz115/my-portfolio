import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    let result = await fetchBaseQuery({
      baseUrl: '/api',
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
      },
    })(args, api, extraOptions);

    // Handle 401 errors (unauthorized/expired token)
    if (result.error && (result.error as any).status === 401) {
      // Clear auth state and redirect to login
      api.dispatch({ type: 'auth/logout' });
      window.location.href = '/auth/login';
    }

    return result;
  },
  tagTypes: ['User', 'WebsiteSettings', 'HomeData', 'About', 'Skill', 'Experience', 'Project', 'Contact'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      { user: any; token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<
      { user: any; token: string },
      { name: string; email: string; password: string }
    >({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getProfile: builder.query<any, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    // Website Settings
    getWebsiteSettings: builder.query<any, void>({
      query: () => '/website-settings',
      providesTags: ['WebsiteSettings'],
    }),
    updateWebsiteSettings: builder.mutation<any, any>({
      query: (data) => ({
        url: '/website-settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WebsiteSettings'],
    }),

    // Home Data
    getHomeData: builder.query<any, void>({
      query: () => '/home',
      providesTags: ['HomeData'],
    }),
    updateHomeData: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/home',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['HomeData'],
    }),

    // About
    getAbout: builder.query<any, void>({
      query: () => '/about',
      providesTags: ['About'],
    }),
    updateAbout: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/about',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['About'],
    }),

    // Skills
    getSkills: builder.query<any[], void>({
      query: () => '/skills',
      providesTags: ['Skill'],
    }),
    createSkill: builder.mutation<any, any>({
      query: (skill) => ({
        url: '/skills',
        method: 'POST',
        body: skill,
      }),
      invalidatesTags: ['Skill'],
    }),
    updateSkill: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/skills/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Skill'],
    }),
    deleteSkill: builder.mutation<any, string>({
      query: (id) => ({
        url: `/skills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skill'],
    }),

    // Experience
    getExperience: builder.query<any[], void>({
      query: () => '/experience',
      providesTags: ['Experience'],
    }),
    createExperience: builder.mutation<any, any>({
      query: (data) => ({
        url: '/experience',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Experience'],
    }),
    updateExperience: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/experience/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Experience'],
    }),
    deleteExperience: builder.mutation<any, string>({
      query: (id) => ({
        url: `/experience/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Experience'],
    }),

    // Projects
    getProjects: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => `/projects?page=${page}&limit=${limit}`,
      providesTags: ['Project'],
    }),
    getProjectById: builder.query<any, string>({
      query: (id) => `/projects/${id}`,
      providesTags: ['Project'],
    }),
    createProject: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/projects',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ data }) => ({
        url: '/projects',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation<any, string>({
      query: (id) => ({
        url: '/projects',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: ['Project'],
    }),

    // Contact
    getContacts: builder.query<any[], void>({
      query: () => '/contacts',
      providesTags: ['Contact'],
    }),
    createContact: builder.mutation<any, any>({
      query: (contact) => ({
        url: '/contacts',
        method: 'POST',
        body: contact,
      }),
      invalidatesTags: ['Contact'],
    }),
    updateContactStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: '/contacts',
        method: 'PATCH',
        body: { id, status },
      }),
      invalidatesTags: ['Contact'],
    }),
    replyToContact: builder.mutation<any, { id: string; email: string; message: string }>({
      query: ({ id, email, message }) => ({
        url: '/contacts/reply',
        method: 'POST',
        body: { id, email, message },
      }),
    }),
    deleteContact: builder.mutation<any, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  
  // Website Settings hooks
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingsMutation,
  
  // Home Data hooks
  useGetHomeDataQuery,
  useUpdateHomeDataMutation,
  
  // About hooks
  useGetAboutQuery,
  useUpdateAboutMutation,
  
  // Skills hooks
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  
  // Experience hooks
  useGetExperienceQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  
  // Projects hooks
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  
  // Contact hooks
  useGetContactsQuery,
  useCreateContactMutation,
  useUpdateContactStatusMutation,
  useReplyToContactMutation,
  useDeleteContactMutation,
} = api;