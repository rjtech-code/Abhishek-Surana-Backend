import slugifyLib from 'slugify';

export const generateSlug = (text) => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

export const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};