import { errorResponse, successResponse } from "../../helpers";
import { Department, User } from "../../models";

export const createDepartment = async (req, res) => {
    const data = req.body;
    
    try {
        const departmentData = await Department.create({
        name: data.name,
        headId: data.headId,
        functionId: data.functionId,
        });

        const userData = await User.findByPk(data.headId);
        userData.is_department_head = true;
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

export const updateDepartment = async (req, res) => {
    try {
        const { name, headId, functionId, id } = req.body;
        const departmentData = await Department.findByPk(id);

        if (!departmentData) {
            throw new Error("Department not found");
        }

        departmentData.name = name;
        departmentData.headId = headId;
        departmentData.functionId = functionId;

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
        console.log('DEPARTMENT delete DATA:', departmentData);

        if (!departmentData) {
            throw new Error("Department not found");
        }

        const resp = await departmentData.destroy();
        return successResponse(req, res, resp);
    }
    catch (error) {
        throw error;
    }
}
