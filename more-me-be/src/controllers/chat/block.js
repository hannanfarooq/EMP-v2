import { successResponse } from "../../helpers";
import {User,BlockedUser} from "../../models";
import { Op } from 'sequelize';
export const blockUsers = async (req, res) => {
    const { blockerId, blockedIds } = req.body;
  
    try {
      // console.log('Request Body:', req.body);
      const parsedBlockerId = parseInt(blockerId, 10);
  
      // Create or update blocked users
      // console.log('Finding BlockedUser with blockedId:', parsedBlockerId);
      let blockedUser = await BlockedUser.findOne({ where: { blockerId: parsedBlockerId } });
  
      // console.log('Search Result:', blockedUser);
  
      if (blockedUser) {
        // Update the blockedIds array, ensuring uniqueness
        if (!blockedUser.blockedId.includes(blockedIds)) {
          blockedUser.blockedId.push(blockedIds);
        }
        // console.log('The Blocked User After:', blockedUser);
        blockedUser.changed('blockedId', true);
        await blockedUser.save();
      } else {
        // console.log('Creating New Blocked User Entry');
        blockedUser = await BlockedUser.create({ blockerId: parsedBlockerId, blockedId: [blockedIds] });
      }
  
      res.status(200).json(blockedUser);
    } catch (error) {
      // console.log('-----------------------ERROR', error);
      res.status(500).json({ error: 'Failed to block users' });
    }
  };

  export const GetBlockUser = async (req,res)=>{
    try{
    const { id} =req.params;
    const parsedBlockerId = parseInt(id, 10);
  
    // Create or update blocked users
    // console.log('Finding BlockedUser with blockedId:', parsedBlockerId);
    let blockedUser = await BlockedUser.findOne({ where: { blockerId: parsedBlockerId } });
    if(blockedUser)
        {
           return  successResponse(req,res,blockedUser);
        }
        else{
            return  successResponse(req,res,{}); 
        }
    } catch (error) {
        // console.log('-----------------------ERROR', error);
        res.status(500).json({ error: 'Failed to block users' });
      }
  }
  export const GetBlockedByUsers = async (req, res) => {
    try {
      const { id } = req.params;
      const parsedCurrentUserId = parseInt(id, 10);
    
      // Find all entries where the current user is in the blockedId array
      let blockedByUsers = await BlockedUser.findAll({
        where: {
          blockedId: {
            [Op.contains]: [parsedCurrentUserId]
          }
        }
      });
  
      if (blockedByUsers) {
        return successResponse(req, res, blockedByUsers);
      } else {
        return successResponse(req, res, []);
      }
    } catch (error) {
      // console.log('-----------------------ERROR', error);
      res.status(500).json({ error: 'Failed to retrieve users who blocked the current user' });
    }
  };
  // Function to unblock users
  export const unblockUsers = async (req, res) => {
    const { blockerId, blockedIds } = req.body;
  
    try {
    
  
     
  
      // Find blocked user entry
      const blockedUser = await BlockedUser.findOne({ where: { blockerId } });
      if (!blockedUser) {
        return res.status(404).json({ error: 'Blocked user entry not found' });
      }
  
      // Remove blockedIds from the array
      blockedUser.blockedId = blockedUser.blockedId.filter(id => blockedIds!=id);
      blockedUser.changed('blockedId', true);
      await blockedUser.save();
  
      res.status(200).json(blockedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to unblock users' });
    }
  };

