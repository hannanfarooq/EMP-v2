// const axios = require('axios');
import axios from "axios";
import { errorResponse, successResponse } from "../../helpers";
import { User, Company, buyAndSell } from "../../models";

export const addItem = async (req, res) => {
  try {
    const {
      name,
      description,
      photo,
      price,
      sellerId,
      companyId,
      sellerPhone,
      category,
    } = req.body;

    // Ensure 'photo' is an array, defaulting to an empty array if undefined
    const sanitizedPhotos = Array.isArray(photo)
      ? photo.filter((p) => p !== "")
      : [];

    const newItem = await buyAndSell.create({
      name,
      description,
      photo: sanitizedPhotos,
      price,
      sellerId,
      companyId,
      sellerPhone,
      category,
    });

    return successResponse(req, res, newItem);
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

export const deleteBuyAndSell = async (req, res) => {
  try {
    const buyAndSellId = req.params.id;
    const data = await buyAndSell.destroy({
      where: { id: buyAndSellId },
    });

    return successResponse(req, res, data);
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

export const getItemsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { category } = req.query;

    const whereClause = {};

    if (category) {
      whereClause.category = category;
    }

    whereClause.companyId = companyId;

    const items = await buyAndSell.findAll({
      where: whereClause,
    });

    res.status(200).json({ items });
  } catch (error) {
    console.error("Error getting items by companyId:", error);
    res.status(500).json({ error: "An error occurred while fetching items" });
  }
};

export const updateBuyAndSell = async (req, res) => {
  try {
    const buyAndSellId = req.params.id;
    const updatedBuyAndSell = await buyAndSell.update(req.body, {
      where: { id: buyAndSellId },
    });

    return successResponse(req, res, updatedBuyAndSell);
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

export const fetchArticles = async (req, res) => {
  const options = {
    method: "GET",
    url: "https://bing-news-search1.p.rapidapi.com/news/search",
    params: {
      q: "leadership",
      freshness: "Day",
      textFormat: "Raw",
      safeSearch: "Off",
      setLang: "EN",
    },
    headers: {
      "X-BingApis-SDK": "true",
      "X-RapidAPI-Key": "dce73c7b0cmsh33c29cee3fefcecp12684fjsn9db5c86bcbbf",
      "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json("Error While fetching");
  }
};
