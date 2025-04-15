import { errorResponse, successResponse } from "../../helpers";
import { Department, User,CompanyAnnouncement,AnnouncementQuestion,AnnouncementResponse,Team } from "../../models";

export const createDepartment = async (req, res) => {
    const data = req.body;
    
    try {
        const departmentData = await Department.create({
        name: data.name,
        headId: data.headId,
        functionId: data.functionId,
        companyId:data.companyId,
        });

        const userData = await User.findByPk(data.headId);
        userData.is_department_head = true;
        userData.role = "manager";
       
        userData.departmentId=departmentData.id;

        await userData.save()

        return successResponse(req, res, departmentData);
    }
    catch (error) {
        console.error("Error creating Department:", error);
        throw error;
    }
}
export const getFunctionDepartments = async (req, res) => {
    try {
        const { functionId } = req.body;
        const departments = await Department.findAll({ where: { functionId }, include: 'Head' });
        return successResponse(req, res, departments);
    }
    catch (error) {
        throw error;
    }
}
export const getDepartmentsyuserid = async (req, res) => {
    try {
        const { headId } = req.body;
        const departments = await Department.findAll({ where: { headId }, include: 'Head' });
        return successResponse(req, res, departments);
    }
    catch (error) {
        throw error;
    }
}

export const updateDepartment = async (req, res) => {
  try {
    console.log("updateTeam", req.body);

    const { id, name, headId } = req.body;  // Destructure id, teamMembers, and leadId from the request body

    const Departmen = await Department.findByPk(id);

    if (!Departmen) {
      throw new Error("Team not found");
    }

    // Check if the lead has changed
    let oldheadId = Departmen.headId;

    // Update basic team data if provided
    if (req.body.name) Departmen.name = req.body.name;
    if (req.body.headId) {
      // Only update lead if it's different from the current lead
      if (headId && headId !== oldheadId) {
        // Get the old team lead and update them
        const oldLead = await User.findByPk(oldheadId);
        if (oldLead) {
          oldLead.is_department_head = false;
          oldLead.role = "user";  // Resetting the role
          oldLead.departmentId=null;
          await oldLead.save();  // Save the old lead data
        }

        // Update the leadId in the team data
        Departmen.headId = headId;

        // Get the new team lead and update them
        const newLead = await User.findByPk(headId);
        if (newLead) {
          newLead.is_department_head = true;
          newLead.role = "manager";
          newLead.departmentId=id; // Assuming new lead role is "user"
          await newLead.save();  // Save the new lead data
        }
      }
    }

   

   

    // Save updated team data
    const resp = await Departmen.save();

    // Return success response
    return successResponse(req, res, resp);
  } catch (error) {
    console.error("Error updating team:", error);
    return errorResponse(req, res, error.message);  // Return an error response
  }
};
const deleteTeam = async (id) => {
    try {
      // Check if team exists
      const teamData = await Team.findByPk(id);
      if (!teamData) {
        console.log(`Team with ID ${id} not found.`);
        return { success: false, message: "Team not found" };
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
  
      // Fetch team leader data and reset their role
      const userData = await User.findByPk(teamData.leadId);
      if (userData) {
        userData.role = "user"; // Reset role if needed
        await userData.save();
        console.log(`Updated user ${userData.id} role after team deletion.`);
      }
  
      // Delete the team
      await teamData.destroy();
  
      console.log(`Team with ID ${id} deleted successfully.`);
      return { success: true, message: "Team deleted successfully" };
    } catch (error) {
      console.error("Error deleting team:", error);
      return { success: false, message: "Internal Server Error" };
    }
  };
  

export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.body;
        const departmentData = await Department.findByPk(id);
        // console.log('DEPARTMENT delete DATA:', departmentData);

        if (!departmentData) {
            throw new Error("Department not found");
        }
        const companyAnnouncements = await CompanyAnnouncement.findAll({
            where: { departmentId: id },
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

          const userData = await User.findByPk(departmentData.headId);
          if (userData) {
        
              userData.role = "user";
              await userData.save();
          }
          const teams = await Team.findAll({ where: { departmentId: id } });

          await Promise.all(teams.map(team => deleteTeam(team.id)));

      
        const resp = await departmentData.destroy();
        return successResponse(req, res, resp);
    }
    catch (error) {
        throw error;
    }
}

export const getFunctionDepartmentsall = async (req, res) => {
  try {
      const { compnayid } = req.body;
      const departments = await Department.findAll({ where: { companyId:compnayid } });
      return successResponse(req, res, departments);
  }
  catch (error) {
      throw error;
  }
}