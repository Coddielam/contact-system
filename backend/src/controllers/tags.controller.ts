import { RequestHandler } from "express";
import { TagModel } from "../models";
import { Document } from "mongoose";
import tagModel, { TTag } from "../models/tag.model";
import { CustomError } from "../error";

export const findAllTags: RequestHandler<{}, { tags: Document[] }, {}> = async (
  req,
  res,
  next
) => {
  try {
    const tags = await TagModel.find();
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
};

export const createTag: RequestHandler<
  {},
  { tag: Document },
  { tag: string }
> = async (req, res, next) => {
  try {
    const { tag } = req.body;
    const newTag = new TagModel({
      name: tag,
    });

    const savedTag = await newTag.save();
    res.status(200).json({ tag: savedTag });
  } catch (error) {
    next(error);
  }
};

export const deleteTag: RequestHandler<{}, {}, { tagIds: string[] }> = async (
  req,
  res,
  next
) => {
  const { tagIds } = req.body;
  try {
    const result = await TagModel.deleteMany({
      _id: { $in: tagIds },
    });
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const updateTags: RequestHandler<
  {},
  {},
  { tags: { _id: string; name: string }[] }
> = async (req, res, next) => {
  const { tags } = req.body;

  try {
    const tagsFound = await TagModel.find({
      _id: { $in: tags.map((tag) => tag._id) },
    });

    if (!tagsFound || !tagsFound.length)
      throw new CustomError("No matching tags", 400);

    tagsFound.map((dbTag) => {
      dbTag.name = (
        tags.find((tag) => tag._id === dbTag._id.toString()) ?? dbTag
      ).name;
    });

    const result = await TagModel.bulkSave(tagsFound);

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};
