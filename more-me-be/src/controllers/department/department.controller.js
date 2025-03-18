import { errorResponse, successResponse } from "../../helpers";
import { Department, User,CompanyAnnouncement,AnnouncementQuestion,AnnouncementResponse } from "../../models";

export const createDepartment = async (req, res) => {
    const data = req.body;
    
    try {
        const departmentData = await Department.create({
        name: data.name,
        headId: data.headId,
        functionId: data.functionId,
        compnayid:data.compnayid,
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
        const { name, headId,  id } = req.body;
        const departmentData = await Department.findByPk(id);

        if (!departmentData) {
            throw new Error("Department not found");
        }

        departmentData.name = name;
        departmentData.headId = headId;
      

        const resp = await departmentData.save();
        return successResponse(req, res, resp);
    }
    catch (error) {
        throw error;
    }
}

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

        const resp = await departmentData.destroy();
        return successResponse(req, res, resp);
    }
    catch (error) {
        throw error;
    }
}
