import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Wine } from '../models';
import { IAuthRequest } from '../types';

export const getWines = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const {
      page = 1,
      limit = 20,
      sort = '-createdAt',
      style,
      country,
      vintage,
      producer,
      search,
      cellarRoom,
      cellarRack,
    } = req.query;

    // Build filter query
    const filter: any = { userId: req.user._id.toString() };

    if (style) {
      filter.style = style;
    }

    if (country) {
      filter['region.country'] = new RegExp(country as string, 'i');
    }

    if (vintage) {
      filter.vintage = parseInt(vintage as string);
    }

    if (producer) {
      filter.producer = new RegExp(producer as string, 'i');
    }

    if (cellarRoom) {
      filter['cellar.location.room'] = new RegExp(cellarRoom as string, 'i');
    }

    if (cellarRack) {
      filter['cellar.location.rack'] = new RegExp(cellarRack as string, 'i');
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search as string, 'i') },
        { producer: new RegExp(search as string, 'i') },
        { grapes: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const wines = await Wine.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Wine.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        wines,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get wines error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getWine = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const wine = await Wine.findOne({
      _id: id,
      userId: req.user._id.toString(),
    });

    if (!wine) {
      res.status(404).json({
        success: false,
        message: 'Wine not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { wine },
    });
  } catch (error) {
    console.error('Get wine error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const createWine = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const wineData = {
      ...req.body,
      userId: req.user._id.toString(),
    };

    const wine = new Wine(wineData);
    await wine.save();

    res.status(201).json({
      success: true,
      message: 'Wine created successfully',
      data: { wine },
    });
  } catch (error) {
    console.error('Create wine error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateWine = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const wine = await Wine.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id.toString(),
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!wine) {
      res.status(404).json({
        success: false,
        message: 'Wine not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Wine updated successfully',
      data: { wine },
    });
  } catch (error) {
    console.error('Update wine error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteWine = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const wine = await Wine.findOneAndDelete({
      _id: id,
      userId: req.user._id.toString(),
    });

    if (!wine) {
      res.status(404).json({
        success: false,
        message: 'Wine not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Wine deleted successfully',
    });
  } catch (error) {
    console.error('Delete wine error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
