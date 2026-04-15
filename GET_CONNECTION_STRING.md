# 🔗 Get Your Supabase Connection String

## Step-by-Step Instructions

### 1. Go to Supabase Settings
Open this link in your browser:
https://supabase.com/dashboard/project/nwqktzqgmssgorrghfmd/settings/database

### 2. Find Connection String Section
Scroll down to the **"Connection string"** section

### 3. Select the Right Tab
Click on the **"URI"** tab (not "Session mode" or "Transaction mode")

### 4. Copy the Connection String
You'll see something like:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 5. Important Notes

**DO NOT use:**
- ❌ The pooler connection (port 6543)
- ❌ Session mode
- ❌ Transaction mode

**DO use:**
- ✅ Direct connection (port 5432)
- ✅ URI format
- ✅ The password shown in the Supabase dashboard

### 6. What to Look For

The connection string should have:
- `db.nwqktzqgmssgorrghfmd.supabase.co` (direct connection host)
- `:5432` (direct connection port)
- Your actual password (not `[YOUR-PASSWORD]`)

### 7. Example Format

```
postgresql://postgres.nwqktzqgmssgorrghfmd:[PASSWORD]@db.nwqktzqgmssgorrghfmd.supabase.co:5432/postgres
```

### 8. Special Characters in Password

If your password has special characters like `@` or `#`, they need to be URL-encoded:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `&` becomes `%26`
- `+` becomes `%2B`
- `,` becomes `%2C`
- `/` becomes `%2F`
- `:` becomes `%3A`
- `;` becomes `%3B`
- `=` becomes `%3D`
- `?` becomes `%3F`
- `[` becomes `%5B`
- `]` becomes `%5D`

For example, if your password is `123456789abC@#`, it becomes:
```
123456789abC%40%23
```

---

## 🎯 What to Do Next

### Option 1: Copy from Supabase Dashboard

1. Go to the link above
2. Copy the exact connection string shown
3. Paste it here and I'll help you format it

### Option 2: Reset Your Password

If you're having trouble with special characters:

1. Go to: https://supabase.com/dashboard/project/nwqktzqgmssgorrghfmd/settings/database
2. Scroll to "Database password"
3. Click "Reset database password"
4. Choose a simple password (only letters and numbers)
5. Copy the new connection string

---

## 📸 Screenshot Guide

When you open the Supabase database settings page, you should see:

```
┌─────────────────────────────────────────────────────┐
│  Database Settings                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Connection string                                  │
│  ┌─────────────────────────────────────────────┐  │
│  │ [URI] [Session mode] [Transaction mode]     │  │
│  │                                             │  │
│  │ postgresql://postgres.nwqktzqgmssgorrghfmd: │  │
│  │ [YOUR-PASSWORD]@db.nwqktzqgmssgorrghfmd.    │  │
│  │ supabase.co:5432/postgres                   │  │
│  │                                             │  │
│  │ [Copy] [Show password]                      │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

Click **"Show password"** to see your actual password, then copy the entire string.

---

## 🚨 Common Issues

### Issue: "Tenant or user not found"
**Cause:** Using pooler connection instead of direct
**Solution:** Make sure the host is `db.nwqktzqgmssgorrghfmd.supabase.co` and port is `5432`

### Issue: "Authentication failed"
**Cause:** Wrong password or special characters not encoded
**Solution:** 
1. Verify password in Supabase dashboard
2. URL-encode special characters
3. Or reset to a simpler password

### Issue: "Can't reach database server"
**Cause:** Wrong host or port
**Solution:** Use the exact connection string from Supabase dashboard

---

## ✅ Once You Have the Connection String

1. Copy the connection string from Supabase
2. If it has special characters, URL-encode them
3. Update `backend/.env`:
   ```env
   DATABASE_URL="your_connection_string_here"
   ```
4. Run the migration:
   ```bash
   npx prisma migrate dev --name init
   ```

---

## 💡 Pro Tip

The easiest way is to:
1. Go to Supabase dashboard
2. Click "Show password" 
3. Copy the ENTIRE connection string
4. Paste it directly into `.env`
5. If it fails, URL-encode the special characters

---

**Need help? Paste the connection string you see in Supabase and I'll help you format it correctly!**
