import { Homepage } from '../models/Homepage.js';
import { Blog } from '../models/Blog.js';
import { Initiative } from '../models/Initiative.js';
import { Gallery } from '../models/Gallery.js';

export class HomepageService {
  static async getHomepageContent() {
    let homepage = await Homepage.findOne({ isSingleton: true })
      .populate({
        path: 'featuredBlogIds',
        match: { status: 'published' },
        select: 'title slug excerpt featuredImage category publishedAt readingTimeMinutes',
      })
      .populate({
        path: 'featuredInitiativeIds',
        match: { published: true },
        select: 'title slug summary coverImage category status year',
      })
      .lean();

    if (!homepage) {
      homepage = await Homepage.create({
        isSingleton: true,
        hero: {
          eyebrow: 'District Administration',
          headline: 'District Churu, Rajasthan',
          subheadline: 'Official public portal of Shri Abhishek Surana, IAS, District Collector & DM.',
        },
        leadership: {
          heading: 'A Message to the Citizens of Churu',
          description: 'Our administration prioritizes transparent service delivery, fast grievance redressal, and holistic rural-urban development.',
          quote: 'True public service is measured by the progress of the most vulnerable.',
        },
        impactStats: [
          { label: 'Gram Panchayats Covered', value: '250+', icon: 'map-pin', order: 1, active: true },
          { label: 'Citizen Grievances Resolved', value: '98.4%', icon: 'check-circle', order: 2, active: true },
          { label: 'Model Schools Developed', value: '120+', icon: 'book-open', order: 3, active: true },
        ],
      });
      homepage = homepage.toObject();
    }

    const previewLimit = homepage.galleryPreviewCount || 6;
    const galleryPreview = await Gallery.find({ published: true }).sort('order -createdAt').limit(previewLimit).lean();

    return {
      ...homepage,
      galleryPreview,
    };
  }

  static async updateHomepageContent(data) {
    const updated = await Homepage.findOneAndUpdate({ isSingleton: true }, { $set: data }, { new: true, upsert: true, runValidators: true });
    return updated;
  }
}