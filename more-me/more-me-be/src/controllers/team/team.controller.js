import { errorResponse, successResponse } from "../../helpers";
import { Team, User } from "../../models";

export const createTeam = async (req, res) => {
  const data = req.body;

  try {
    const teamData = await Team.create({
      name: data.name,
      leadId: data.leadId,
      departmentId: data.departmentId,
    });

    const userData = await User.findByPk(data.leadId);
    userData.is_team_lead = true;

    return successResponse(req, res, teamData);
  } catch (error) {
    console.error("Error creating Team:", error);
    throw error;
  }
};

export const getDepartmentTeams = async (req, res) => {
  try {
    const { departmentId } = req.body;
    console.log("DEPARTMENT ID:", departmentId);
    const teams = await Team.findAll({
      where: { departmentId },
      include: "Lead",
    });

    return successResponse(req, res, teams);
  } catch (error) {
    throw error;
  }
};

export const updateTeam = async (req, res) => {
  try {
    console.log("updateTeam", req.body);
    const { team, id } = req.body;
    const teamData = await Team.findByPk(id);

    if (!teamData) {
      throw new Error("Team not found");
    }

    if (req.body) {
      teamData.name = req.body.name;
      teamData.leadId = req.body.leadId;
      teamData.departmentId = req.body.departmentId;
    }

    const resp = await teamData.save();
    return successResponse(req, res, resp);
  } catch (error) {
    throw error;
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.body;
    const teamData = await Team.findByPk(id);

    if (!teamData) {
      throw new Error("Team not found");
    }

    const resp = await teamData.destroy();
    return successResponse(req, res, resp);
  } catch (error) {
    throw error;
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.body;
    const users = await User.findAll({ where: { teamId } });
    return successResponse(req, res, users);
  } catch (error) {
    throw error;
  }
};
