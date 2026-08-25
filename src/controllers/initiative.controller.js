import { InitiativeService } from '../services/initiative.service.js';
import { Initiative } from '../models/Initiative.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class InitiativeController {
  static createInitiative = asyncHandler(async (req, res) => {
    const initiative = await InitiativeService.createInitiative(
      req.body,
      {
        coverImage: req.files?.coverImage?.[0] || null,
        gallery: req.files?.gallery || [],
      }
    );

    return ApiResponse.success(
      res,
      "Initiative created successfully",
      initiative,
      HTTP_STATUS.CREATED
    );
  });

  static updateInitiative = asyncHandler(async (req, res) => {
    const initiative = await InitiativeService.updateInitiative(
      req.params.id,
      req.body,
      {
        coverImage: req.files?.coverImage?.[0] || null,
        gallery: req.files?.gallery || [],
      }
    );

    return ApiResponse.success(
      res,
      "Initiative updated successfully",
      initiative
    );
  });

  static deleteInitiative = asyncHandler(async (req, res) => {
    await InitiativeService.deleteInitiative(req.params.id);
    return ApiResponse.success(res, 'Initiative and associated media deleted successfully');
  });

  static getAdminInitiatives = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { initiatives, total } = await InitiativeService.getAdminInitiatives({ ...req.query, page, limit });
    return ApiResponse.paginated(res, 'Admin initiatives retrieved', initiatives, { page, limit, total });
  });

  static getAdminInitiativeById = asyncHandler(async (req, res) => {
    const initiative = await Initiative.findById(req.params.id);
    if (!initiative) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Initiative not found');
    }
    return ApiResponse.success(res, 'Initiative details retrieved', initiative);
  });

  static getPublicInitiatives = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { initiatives, total } = await InitiativeService.getPublicInitiatives({ ...req.query, page, limit });
    return ApiResponse.paginated(res, 'Initiatives fetched successfully', initiatives, { page, limit, total });
  });

  static getPublicInitiativeBySlug = asyncHandler(async (req, res) => {
    const initiative = await InitiativeService.getPublicInitiativeBySlug(req.params.slug);
    return ApiResponse.success(res, 'Initiative details retrieved', initiative);
  });

  static getFeaturedInitiatives = asyncHandler(async (req, res) => {
    const { initiatives } = await InitiativeService.getPublicInitiatives({ featured: true, limit: 3 });
    return ApiResponse.success(res, 'Featured initiatives fetched', initiatives);
  });

  static getCategories = asyncHandler(async (req, res) => {
    const categories = await InitiativeService.getCategories();
    return ApiResponse.success(res, 'Initiative categories fetched', categories);
  });
}