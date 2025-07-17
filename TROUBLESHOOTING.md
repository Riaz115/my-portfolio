# Registration System Troubleshooting Guide

## Issues Fixed

### ✅ **Redux API Endpoint Conflicts**
- **Problem**: Multiple API slices were causing endpoint conflicts
- **Solution**: Consolidated all API endpoints into a single `apiSlice.ts` file
- **Files Updated**: 
  - `store/api/apiSlice.ts` (consolidated)
  - Deleted `store/api/authApi.ts` and `store/api/portfolioApi.ts`
  - Updated all component imports

### ✅ **500 Internal Server Error**
- **Problem**: Registration API was failing with 500 errors
- **Solution**: Added comprehensive error handling and debugging
- **Files Updated**: `app/api/auth/register/route.ts`

### ✅ **Hydration Warning**
- **Problem**: Server/client mismatch warnings
- **Solution**: Added `suppressHydrationWarning` to html element
- **Files Updated**: `app/layout.tsx`

## Current Status

The registration system should now work properly. Here's what was fixed:

1. **API Consolidation**: All Redux API endpoints are now in one file
2. **Error Handling**: Better error messages and debugging
3. **Database Connection**: Improved MongoDB connection handling
4. **Form Validation**: Enhanced client and server-side validation

## Testing Steps

### 1. Environment Setup
```bash
# Run the setup script
node setup-env.js
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test Registration
- Go to: http://localhost:3000/auth/register
- Fill in the form with valid data
- Submit and check for success

### 4. Check Logs
- **Browser Console**: Check for any JavaScript errors
- **Server Logs**: Check terminal for API call logs
- **Network Tab**: Check the actual API response

## Common Issues & Solutions

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (Windows)
net start MongoDB

# Start MongoDB (macOS/Linux)
sudo systemctl start mongod
```

### Environment Variables
Make sure `.env.local` exists with:
```env
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
```

### Port Conflicts
If port 3000 is busy:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

## Debug Information

### API Endpoints
- **Registration**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Profile**: `GET /api/auth/profile`

### Database Collections
- **Users**: `users` collection in MongoDB
- **Indexes**: Email field is indexed for performance

### Error Codes
- **400**: Bad Request (validation errors)
- **409**: Conflict (user already exists)
- **500**: Internal Server Error
- **503**: Service Unavailable (database issues)

## Performance Optimizations

1. **Database Indexing**: Email field is indexed
2. **Connection Pooling**: MongoDB connection pooling enabled
3. **Caching**: Redux state management for user data
4. **Validation**: Client and server-side validation

## Security Features

1. **Password Hashing**: Bcrypt with 12 salt rounds
2. **JWT Tokens**: Secure authentication tokens
3. **Input Sanitization**: XSS protection
4. **Rate Limiting**: Built into Next.js API routes

## Next Steps

After successful registration:
1. Users are automatically logged in
2. JWT token is stored in Redux state
3. Users are redirected to home page
4. Profile data can be accessed via `/api/auth/profile`

## Support

If you're still experiencing issues:

1. **Check MongoDB**: Ensure it's running and accessible
2. **Check Environment**: Verify `.env.local` exists and has correct values
3. **Check Logs**: Look at browser console and server logs
4. **Test API**: Use browser dev tools to test API directly
5. **Restart Server**: Stop and restart the development server

## Files Modified

- `store/api/apiSlice.ts` - Consolidated API endpoints
- `app/api/auth/register/route.ts` - Enhanced error handling
- `app/auth/register/page.tsx` - Updated imports and improved UX
- `app/layout.tsx` - Added hydration warning suppression
- All component files - Updated API imports
- Deleted: `store/api/authApi.ts`, `store/api/portfolioApi.ts`

The registration system should now work reliably with proper error handling and user feedback. 