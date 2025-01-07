// import { errorResponse, successResponse } from "../../helpers";
// import { Function, User } from "../../models";

// export const createFunction = async (req, res) => {
//     const data = req.body;
    
//     try {
//         const userData = await User.findByPk(data.headId);
        
//         if (!userData) {
//             throw new Error("User not found");
//         }
//         if(userData.is_function_head) {
//             // throw new Error("User is already a function head");
//             return errorResponse(req, res, "User is already a function head!")
//         }

//         userData.is_function_head = true;
//         await userData.save()

//         const functionData = await Function.create({
//         name: data.name,
//         description: data.description,
//         headId: data.headId,
//         companyId: data.companyId,
//         });


//         return successResponse(req, res, functionData);
//     }
//     catch (error) {
//         console.error("Error creating Function:", error);
//         throw error;
//     }
// }

// export const getCompanyFunctions = async (req, res) => {
//     try {
//         const { companyId } = req.body;
//         console.log('COMPANY ID:', companyId);
//         const functions = await Function.findAll({
//           where: { companyId },
//           include: "Head",
//         });

//         return successResponse(req, res, functions);
//     }
//     catch (error) {
//         throw error;
//     }
// }

// export const updateFunction = async (req, res) => {
//     try {
//         const { name, description, headId, companyId, id } = req.body;
//         const functionData = await Function.findByPk(id);

//         if (!functionData) {
//             throw new Error("Function not found");
//         }

//         const userData = await User.findByPk(headId);
//         // if(userData.is_function_head) {
//         //     return errorResponse(req, res, "User is already a function head!")
//         // }

//         if (headId && headId !== functionData.headId) {
//             const userData = await User.findByPk(functionData.headId);
//             userData.is_function_head = false;
//             await userData.save();

//             const userData2 = await User.findByPk(headId);
//             userData2.is_function_head = true;
//             await userData2.save();
//         }

//         functionData.name = name || functionData.name;
//         functionData.description = description || functionData.description;
//         functionData.headId = headId || functionData.headId;
//         functionData.companyId = companyId || functionData.companyId;

//         const resp = await functionData.save();
//         return successResponse(req, res, resp);
//     }
//     catch (error) {
//         throw error;
//     }
// }

// export const deleteFunction = async (req, res) => {
//     try {
//         const { id } = req.body;
//         const functionData = await Function.findByPk(id);

//         if (!functionData) {
//             throw new Error("Function not found");
//         }

//         const resp = await functionData.destroy();
//         return successResponse(req, res, resp);
//     }
//     catch (error) {
//         throw error;
//     }
// }

import { errorResponse, successResponse } from "../../helpers";
import { Function, User } from "../../models";
import { Op } from "sequelize";

export const createFunction = async (req, res) => {
    const data = req.body;
    
    try {
        const userData = await User.findByPk(data.headId);
        
        if (!userData) {
            throw new Error("User not found");
        }
        if(userData.is_function_head) {
            return errorResponse(req, res, "User is already a function head!")
        }

        userData.is_function_head = true;
        await userData.save()

        const functionData = await Function.create({
            name: data.name,
            description: data.description,
            headId: data.headId,
            companyId: data.companyId,
        });

        return successResponse(req, res, functionData);
    }
    catch (error) {
        console.error("Error creating Function:", error);
        return errorResponse(req, res, "Error creating function");
    }
}

export const getCompanyFunctions = async (req, res) => {
    try {
        const { companyId } = req.body;
        // console.log('COMPANY ID:', companyId);
        const functions = await Function.findAll({
            where: { companyId },
            include: "Head",
        });

        return successResponse(req, res, functions);
    }
    catch (error) {
        return errorResponse(req, res, "Error fetching company functions");
    }
}

export const updateFunction = async (req, res) => {
    try {
        const { name, description, headId, companyId, id } = req.body;
        const functionData = await Function.findByPk(id);

        if (!functionData) {
            return errorResponse(req, res, "Function not found");
        }

        // Check if the new name already exists in the same company
        const existingFunction = await Function.findOne({
            where: {
                name,
                companyId,
                id: { [Op.ne]: id }, // Exclude the current functions
            },
        });

        if (existingFunction) {
            return errorResponse(req, res, "Function name already exists in the company");
        }

        const userData = await User.findByPk(headId);

        if (headId && headId !== functionData.headId) {
            const previousHead = await User.findByPk(functionData.headId);
            previousHead.is_function_head = false;
            await previousHead.save();

            const newHead = await User.findByPk(headId);
            newHead.is_function_head = true;
            await newHead.save();
        }

        functionData.name = name || functionData.name;
        functionData.description = description || functionData.description;
        functionData.headId = headId || functionData.headId;
        functionData.companyId = companyId || functionData.companyId;

        const resp = await functionData.save();
        return successResponse(req, res, resp);
    }
    catch (error) {
        console.error("Error updating Function:", error);
        return errorResponse(req, res, "Error updating function");
    }
}

export const deleteFunction = async (req, res) => {
    try {
        const { id } = req.body;
        const functionData = await Function.findByPk(id);

        if (!functionData) {
            return errorResponse(req, res, "Function not found");
        }

        const resp = await functionData.destroy();
        return successResponse(req, res, resp);
    }
    catch (error) {
        console.error("Error deleting Function:", error);
        return errorResponse(req, res, "Error deleting function");
    }
}
