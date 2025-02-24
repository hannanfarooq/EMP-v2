import { successResponse } from "../../helpers";
import {Category} from "../../models/";

export const createCategory = async (req, res) => {
    try {
      const { name, companyId } = req.body;
  
      if (!name || !companyId) {
        return res.status(400).json({ error: "Name and companyId are required." });
      }
  
      const category = await Category.create({ name, companyId });
      return successResponse(req, res, category);
    
    } catch (error) {
        console.log("CREATE CATEGORY : ",error);
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

  export const getAllCategories = async (req, res) => {
    try {
      const { companyId } = req.body; // Optional filtering
  
      const whereCondition = companyId ? { companyId } : {}; 
  
      const categories = await Category.findAll({ where: whereCondition });
  
      return successResponse(req, res, categories);
    } catch (error) {
        console.log("GET CATEGORY : ",error);
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

  export const updateCategory = async (req, res) => {
    try {
      const { id } = req.body;
      const { name } = req.body;
  
      const category = await Category.findByPk(id);
  
      if (!category) {
        return res.status(404).json({ error: "Category not found." });
      }
  
      await category.update({ name });
  
      return successResponse(req, res, {});
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

  export const deleteCategory = async (req, res) => {
    try {
      const { id } = req.body;
  
      const category = await Category.findByPk(id);
  
      if (!category) {
        return res.status(404).json({ error: "Category not found." });
      }
  
      await category.destroy();
  
      return successResponse(req, res, {});
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };