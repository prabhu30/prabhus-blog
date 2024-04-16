import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class DatabaseService {
    client = new Client();
    databases;
    bucketId;

    constructor() {
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucketId = new Storage(this.client);
    }

    // Post/Article Services

    async createPost({ title, content, slug, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.log("Appwrite Database Service :: Create Post :: Error", error);
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title, content, featuredImage, status
                }
            )
        } catch (error) {
            console.log("Appwrite Database Service :: Update Post :: Error", error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug)

            return true;
        } catch (error) {
            console.log("Appwrite Database Service :: Delete Post :: Error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite Database Service :: Get Post :: Error", error);
            return false;
        }
    }

    async getPosts(queries = [
        Query.equal("status", "active")
    ]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite Database Service :: Get Active Posts :: Error", error);
            return false;
        }
    }


    // File Services

    async uploadFile(file) {
        try {
            return await this.bucketId.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite Database Service :: Upload File :: Error", error);
            return false
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucketId.deleteFile(
                conf.appwriteBucketId,
                fileId
            )

            return true;
        } catch (error) {
            console.log("Appwrite Database Service :: Delete File :: Error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.bucketId.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}

const databaseService = new DatabaseService();

export default databaseService;