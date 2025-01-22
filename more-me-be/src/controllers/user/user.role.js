
import { errorResponse, successResponse } from "../../helpers";
import { Team, User,Department } from "../../models";
import { Op } from 'sequelize';

export const getTeamsWithUsers = async (req, res) => {
    try {
      const { departmentId } = req.body; // Get departmentId from request body
  
      // Step 1: Fetch the department details using departmentId
      const department = await Department.findOne({
        where: { id: departmentId },
      });
  
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
  
      const departments = department.name;
  console.log("---------------------D",departments);
      // Step 2: Fetch all teams for the given departmentId
      const teams = await Team.findAll({
        where: { departmentId },
      });
  
      if (!teams || teams.length === 0) {
        return res.status(404).json({ message: 'No teams found for this department' });
      }
  
      // Step 3: For each team, fetch all users (including leadId)
      const allUsers = await Promise.all(
        teams.map(async (team) => {
          // Combine userIds with leadId to fetch all related users
          const userIds = Array.isArray(team.userIds) ? team.userIds : [];
          const allUserIds = [...new Set([...userIds, team.leadId])]; // Ensure no duplicates
  
          // Get users for the current team
          const usersInTeam = await User.findAll({
            where: {
              id: allUserIds, // Fetch all users by IDs
            },
          });
  
          // Embed team name and department name in each user
          return usersInTeam.map((user) => ({
            ...user.toJSON(),
            teams: team.name,
            departments,
          }));
        })
      );
  
      // Step 4: Flatten the array of arrays into a single array of users
      const user = allUsers.flat();
  console.log(user);
      // Step 5: Return the combined list of users with team and department details
      return successResponse(req, res, user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving teams or users' });
    }
  };
  
  export const getTeamWithUsers = async (req, res) => {
    try {
      const { id } = req.body; // Get team ID from request body
  
      // Step 1: Fetch the team details using the team ID
      const team = await Team.findByPk(id);
  
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
  
      const teamName = team.name;
  
      // Step 2: Fetch the department details using team.departmentId
      const department = await Department.findOne({
        where: { id: team.departmentId },
      });
  
      const departmentName = department ? department.name : 'None';
  
      // Step 3: Fetch all users in the team (from userIds) and include the leadId
      const userIds = Array.isArray(team.userIds) ? team.userIds : [];
      const allUserIds = [...new Set([...userIds, team.leadId])]; // Ensure no duplicates
  
      const users = await User.findAll({
        where: {
          id: allUserIds, // Fetch all users by IDs
        },
      });
  
      // Step 4: Embed team name and department name into each user
      const user = users.map((user) => ({
        ...user.toJSON(),
        teams:teamName,
        departments:departmentName,
      }));
  
      console.log("--------------------RESULTS", user);
  
      // Step 5: Return the combined list of users with team and department details
      return successResponse(req, res, user);
    } catch (error) {
      console.error("--------------------ERROR", error);
      return res.status(500).json({ message: 'Error retrieving team or users' });
    }
  };
  
  export const getTeamMembers = async (req, res) => {
    try {
      const { id } = req.body; // Get user ID from request body
      console.log("TEAM MEMBERS--------------", req.body);
  
      // Step 1: Fetch all teams that the user is part of (check if userId exists in team.userIds array)
      const teams = await Team.findAll({
        where: {
          userIds: {
            [Op.contains]: [id], // Checks if the userId is included in the userIds array
          },
        },
      });
      console.log(teams);
  
      if (!teams || teams.length === 0) {
        return res.status(404).json({ message: 'No teams found for this user' });
      }
  
      // Step 2: Create an array to store all users and their team/department info
      const usersWithTeamInfo = [];
  
      for (let team of teams) {
        const teamName = team.name;
  
        // Fetch the department details using team.departmentId
        const department = await Department.findOne({
          where: { id: team.departmentId },
        });
  
        const departmentName = department ? department.name : 'None';
  
        // Fetch all users in the team (from userIds) and include the leadId
        const userIds = Array.isArray(team.userIds) ? team.userIds : [];
        const allUserIds = [...new Set([...userIds, team.leadId])]; // Ensure no duplicates
  
        const users = await User.findAll({
          where: {
            id: allUserIds, // Fetch all users by IDs
          },
        });
  
        // Embed team name and department name into each user and push into the usersWithTeamInfo array
        users.forEach((user) => {
          usersWithTeamInfo.push({
            ...user.toJSON(),
            teams: teamName,
            departments: departmentName,
          });
        });
      }
  
      // Step 3: Return the combined list of users with team and department details
      console.log("--------------------RESULTS", usersWithTeamInfo);
      return successResponse(req, res, usersWithTeamInfo);
    } catch (error) {
      console.error("--------------------ERROR", error);
      return res.status(500).json({ message: 'Error retrieving teams or users' });
    }
  };
  