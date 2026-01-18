# Appwrite Deployment & Setup Guide

This portfolio is ready to be deployed on **Appwrite Sites** and uses **Appwrite Databases** for the Contact Form.

## 1. Deploying to Appwrite Sites

Appwrite Sites allows you to deploy Next.js applications directly from your Git repository.

### Prerequisites
- An [Appwrite Cloud](https://cloud.appwrite.io/) account.
- This repository pushed to GitHub/GitLab.

### Steps
1. **Create a Project**: Log in to Appwrite Console and create a new project (e.g., "My Portfolio").
2. **Go to Sites**: In the left sidebar, click on **Sites**.
3. **Create Site**:
   - Click **Create site**.
   - Select your Git provider (e.g., GitHub) and authorize if needed.
   - Select this repository.
   - **Branch**: `main` (or your working branch).
   - **Root Directory**: Leave as `/` (default).
   - **Framework**: It should auto-detect **Next.js**.
   - **Build Settings**:
     - Build command: `npm run build`
     - Output directory: `.next`
4. **Environment Variables**: Add the variables listed below in the "Environment Variables" section of the deployment wizard.
5. **Deploy**: Click **Create** to start the build.

---

## 2. Setting up the Backend (Contact Form)

To make the "Send Message" button work, you need to set up a Database and Collection in Appwrite.

### Steps
1. **Go to Databases**: In your Appwrite Project, click **Databases**.
2. **Create Database**:
   - Name: `Portfolio`
   - ID: `portfolio` (or copy the generated ID).
3. **Create Collection**:
   - Inside the database, click **Create collection**.
   - Name: `Messages`
   - ID: `messages` (or copy the generated ID).
4. **Create Attributes**:
   - Click on the "Messages" collection.
   - Go to **Attributes** tab and add the following **String** attributes:
     - `name` (Size: 100, Required: Yes)
     - `email` (Size: 100, Required: Yes)
     - `message` (Size: 5000, Required: Yes)
     - `created_at` (Size: 30, Required: No)
5. **Permissions**:
   - Go to **Settings** tab of the Collection.
   - Under **Permissions**, add a role **Any** (or "Guests").
   - Check **Create** permission. (This allows anyone to send a message).
   - *Security Note*: For production, consider using Appwrite Functions to handle submissions securely, or add strict validation.

---

## 3. Environment Variables

Add these to your **Appwrite Site Settings** (and `.env.local` for local development):

```bash
# Your Appwrite Cloud Endpoint (default is usually correct)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1

# Your Project ID (found in Project Settings)
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

# The Database ID you created (e.g., 'portfolio')
NEXT_PUBLIC_APPWRITE_DB_ID=portfolio

# The Collection ID you created (e.g., 'messages')
NEXT_PUBLIC_APPWRITE_COLLECTION_ID=messages
```
