import { successResponse } from "../../helpers";
import {SubCategory} from "../../models/";



export const createSubCategory = async (req, res) => {
    try {
      const { name, categoryId, companyId } = req.body;
  
      // Check required fields
      if (!name || !categoryId) {
        return res.status(400).json({ error: "Name and categoryId are required." });
      }
  
      const subCategory = await SubCategory.create({ name, categoryId, companyId });
   return successResponse(req, res, subCategory);
  
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };


  export const getSubCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const whereCondition = {};
    
        if (categoryId) whereCondition.categoryId = categoryId;
      
    
        const subCategories = await SubCategory.findAll({
          where: whereCondition,
         
        });
    
        return successResponse(req, res, subCategories);
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
      }
  };
  export const updateSubCategory = async (req, res) => {
    try {
      const { id } = req.body;
      const { name } = req.body;
  
      const subCategory = await SubCategory.findByPk(id);
  
      if (!subCategory) {
        return res.status(404).json({ error: "SubCategory not found." });
      }
  
      await subCategory.update({ name});
  
      return successResponse(req, res, subCategory);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

  export const deleteSubCategory = async (req, res) => {
    try {
      const { id } = req.body;
  
      const subCategory = await SubCategory.findByPk(id);
  
      if (!subCategory) {
        return res.status(404).json({ error: "SubCategory not found." });
      }
  
      await subCategory.destroy();
  
      return successResponse(req, res, {});
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };