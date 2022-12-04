import { RequestHandler } from "express";
import { TagModel } from "../models";
import { Document } from "mongoose";

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

export const deleteTag: RequestHandler<
  {},
  { deletedTag: Document },
  { tagId: string }
> = async (req, res, next) => {
  try {
    const { tagId } = req.body;
    const deletedTag = await TagModel.findByIdAndDelete(tagId);
    if (!deletedTag) throw new Error("Tag did not exist");
    res.status(200).json({ deletedTag });
  } catch (error) {
    next(error);
  }
};
