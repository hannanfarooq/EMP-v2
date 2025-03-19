import { errorResponse, successResponse } from "../../helpers";
import { Team, User,CompanyAnnouncement,AnnouncementQuestion,AnnouncementResponse } from "../../models";

export const createTeam = async (req, res) => {
  const data = req.body;

  try {
    const teamData = await Team.create({
      name: data.name,
      leadId: data.leadId,
      departmentId: data.departmentId,
      
    });
    const userIds = data.member.map(member => member);
    teamData.userIds=userIds;
    const resp = await teamData.save();
    const userData = await User.findByPk(data.leadId);
    userData.is_team_lead = true;
    userData.role = "lead";
    userData.teamid = teamData.id;
    userData.save();


    return successResponse(req, res, teamData);
  } catch (error) {
    console.error("Error creating Team:", error);
    throw error;
  }
};

export const getDepartmentTeams = async (req, res) => {
  try {
    const { departmentId } = req.body;
    // console.log("DEPARTMENT ID:", departmentId);
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

    const { id, teamMembers, leadId } = req.body;  // Destructure id, teamMembers, and leadId from the request body

    const teamData = await Team.findByPk(id);

    if (!teamData) {
      throw new Error("Team not found");
    }

    // Check if the lead has changed
    let oldLeadId = teamData.leadId;

    // Update basic team data if provided
    if (req.body.name) teamData.name = req.body.name;
    if (req.body.leadId) {
      // Only update lead if it's different from the current lead
      if (leadId && leadId !== oldLeadId) {
        // Get the old team lead and update them
        const oldLead = await User.findByPk(oldLeadId);
        if (oldLead) {
          oldLead.is_department_head = false;
          oldLead.role = "user";
          oldLead.teamid = null;   // Resetting the role
          await oldLead.save();  // Save the old lead data
        }

        // Update the leadId in the team data
        teamData.leadId = leadId;

        // Get the new team lead and update them
        const newLead = await User.findByPk(leadId);
        if (newLead) {
          newLead.is_department_head = true;
          newLead.role = "lead"; 
          newLead.teamid = id;  // Assuming new lead role is "user"
           // Assuming new lead role is "user"
          await newLead.save();  // Save the new lead data
        }
      }
    }
    console.log("teamMembers : ", teamMembers);

    // Directly assign the array of user IDs
    teamData.userIds = Array.isArray(teamMembers) ? teamMembers : [];
    
    console.log("userIds stored: ", teamData.userIds);

   

    // Save updated team data
    const resp = await teamData.save();

    // Return success response
    return successResponse(req, res, resp);
  } catch (error) {
    console.error("Error updating team:", error);
    return errorResponse(req, res, error.message);  // Return an error response
  }
};
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if team exists
    const teamData = await Team.findByPk(id);
    if (!teamData) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Fetch all related CompanyAnnouncements
    const companyAnnouncements = await CompanyAnnouncement.findAll({
      where: { teamId: id },
    });

    if (companyAnnouncements.length > 0) {
      // Extract announcement IDs
      const announcementIds = companyAnnouncements.map((ann) => ann.id);

      // Fetch all related AnnouncementQuestions
      const relatedQuestions = await AnnouncementQuestion.findAll({
        where: { announcementId: announcementIds },
      });

      if (relatedQuestions.length > 0) {
        // Extract question IDs
        const questionIds = relatedQuestions.map((q) => q.id);

        // Delete all related AnnouncementResponses
        await AnnouncementResponse.destroy({
          where: { questionId: questionIds },
        });

        // Delete all related AnnouncementQuestions
        await AnnouncementQuestion.destroy({
          where: { announcementId: announcementIds },
        });
      }

      // Delete related CompanyAnnouncements
      await CompanyAnnouncement.destroy({
        where: { teamId: id },
      });
    }
    const userData = await User.findByPk(teamData.leadId);

    if (userData) {
     
        userData.role = "user";  // Or another role if needed
        await userData.save();
        console.log(`Updated user ${userData.id} role and department head status`);
    }
    // Delete the team
    await teamData.destroy();

    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.body;
    const id=teamId;
    const teamData = await Team.findByPk(id);
    return successResponse(req, res, teamData.userIds?teamData.userIds:[]);
  } catch (error) {
    throw error;
  }
};
export const getDepartmentLead = async (req, res) => {
  try {
    const { leadId } = req.body;
    console.log("leadId :", leadId);
    const teams = await Team.findAll({
      where: { id:leadId },
      include: "Lead",
    });
    console.log(teams);

    return successResponse(req, res, teams);
  } catch (error) {
    throw error;
  }
};