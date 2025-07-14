import mongoose, { Schema, Model } from 'mongoose';

        interface BlogTextDocument extends mongoose.Document {
          title: string;
          fullText: string;
          createdAt: Date;
        }

        const BlogTextSchema: Schema<BlogTextDocument> = new mongoose.Schema({
          title: { type: String, required: true },
          fullText: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        });

        const BlogText: Model<BlogTextDocument> = mongoose.models.BlogText || mongoose.model<BlogTextDocument>('BlogText', BlogTextSchema);

        export default BlogText;