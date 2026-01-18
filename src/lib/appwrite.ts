import { Client, Databases, Account } from 'appwrite';

export const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (endpoint && projectId) {
    client
        .setEndpoint(endpoint)
        .setProject(projectId);
}

export const databases = new Databases(client);
export const account = new Account(client);

// Helper to check if Appwrite is configured
export const isAppwriteConfigured = () => !!(endpoint && projectId);
