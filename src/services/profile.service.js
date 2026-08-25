import { Profile } from '../models/Profile.js';

export class ProfileService {
  static async getProfile() {
    let profile = await Profile.findOne({ isSingleton: true }).lean();
    if (!profile) {
      profile = await Profile.create({
        isSingleton: true,
        officerName: 'Abhishek Surana',
        designation: 'District Magistrate & Collector',
        cadre: 'IAS (Rajasthan Cadre)',
        batch: '2018',
        biography:
          'Shri Abhishek Surana is an Indian Administrative Service officer currently serving as the District Magistrate & Collector of District Churu, Rajasthan.',
        education: [{ degree: 'B.Tech in Electrical Engineering', institution: 'IIT Delhi', year: '2014' }],
        leadershipStatement: 'Empowering communities through responsive, data-backed governance.',
        vision: 'Transforming Churu into a model district with smart water management and modern education.',
      });
      profile = profile.toObject();
    }
    return profile;
  }

  static async updateProfile(data) {
    const profile = await Profile.findOneAndUpdate({ isSingleton: true }, { $set: data }, { new: true, upsert: true, runValidators: true });
    return profile;
  }
}