
// import { getIO } from "../../../socket";
// import {Project,Team,Notification,Board,User,Department,Function} from "../../models";
// import { Op } from 'sequelize';



// export const createProject = async (req, res) => {
//     try {
//         const { name, description,  departmentid,startDate,endDate,projectLead,projectAdministrator,projectTeam,functionHead,teamId,companyId } = req.body;
// console.log(" req.body : ", req.body);
//         // Validate incoming data
//         if (!name || !description  ||!startDate ||!endDate||!projectLead|| !projectAdministrator ) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Create the new project
//         const newProject = await Project.create({
//             name,
//             description,
           
//             departmentid,
         
//             startDate,
//             endDate,
//             projectLead,
//             projectAdministrator,
//             projectTeam,
//             functionHead,
//             teamId,
//             companyId
//         });






//         return res.status(201).json({
//             message: 'Project created successfully',
//             project: newProject
//         });
//     } catch (error) {
//         console.error("ERORR IN CREATING PROJECT : " , error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// export const getProjectsByFunctionHead = async (req, res) => {
//     try {
//         const { functionHead } = req.body;

//         if (!functionHead) {
//             return res.status(400).json({ message: 'functionHead is required' });
//         }

        

//         // Step 1: Get the function where headId = functionHead
//         const func = await Function.findOne({ where: { headId: functionHead } });

//         if (!func) {
//             return res.status(404).json({ message: 'Function not found for this head' });
//         }

//         // Step 2: Get departments under this function
//         const departments = await Department.findAll({ where: { functionId: func.id } });
//         const departmentIds = departments.map(dep => dep.id);

//         // Step 3: Get teams under those departments
//         const teams = await Team.findAll({ where: { departmentId: departmentIds } });
//         const teamIds = teams.map(team => team.id);

//         // Step 4: Fetch projects based on functionHead, departmentIds, and teamIds
//         const projects = await Project.findAll({
//             where: {
//               [Op.or]: [
//                 { functionHead },
//                 { departmentid: departmentIds },
//                 { teamId: teamIds },
//               ],
//             },
//           });

//         if (projects.length === 0) {
//             return res.status(404).json({ message: 'No projects found' });
//         }

//         return res.status(200).json(projects);
//     } catch (error) {
//         console.error('Error fetching projects:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


// export const getProjectsByDepartmentId = async (req, res) => {
//     try {
//         const { departmentid } = req.body;

//         // Validate departmentId
//         if (!departmentid) {
//             return res.status(400).json({ message: 'Department ID is required' });
//         }

//         // Step 1: Get the department by departmentId
//         const department = await Department.findOne({ where: { id: departmentid } });

//         if (!department) {
//             return res.status(404).json({ message: 'Department not found' });
//         }

//         // Step 2: Get teams under the department
//         const teams = await Team.findAll({ where: { departmentId: department.id } });
//         const teamIds = teams.map(team => team.id);

//         // Step 3: Fetch projects based on departmentId and teamIds
//         const projects = await Project.findAll({
//             where: {
//               [Op.or]: [
//                 { departmentid: departmentid },
//                 { teamId: teamIds },
//               ],
//             },
//         });

//         if (projects.length === 0) {
//             return res.status(404).json({ message: 'No projects found for the given department or teams' });
//         }

//         return res.status(200).json(projects);
//     } catch (error) {
//         console.error('Error fetching projects:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };



// export const getProjectsBTeamid = async (req, res) => {
//     try {
//         const { teamid } = req.body;

//         // Validate departmentId
//         if (!teamid) {
//             return res.status(400).json({ message: 'teamid ID is required' });
//         }

//         // Fetch teams associated with the departmentId
//         const projects = await Project.findAll({
//             where: { teamId:teamid },
//         });

//         if (projects.length === 0) {
//             return res.status(404).json(projects);
//         }

//         return res.status(200).json(projects);
//     } catch (error) {
//         console.error('Error fetching teams:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


// export const getProjectsforUser = async (req, res) => {
//     try {
//         const { userId } = req.body; // Expecting userId in the body

//         // Validate userId
//         if (!userId) {
//             return res.status(400).json({ message: 'userId is required' });
//         }

//         // Fetch all projects where userId is part of the projectLead, projectAdministrator, or projectTeam
//         const projects = await Project.findAll({
//             where: {
//                 [Op.or]: [
//                     { projectLead: userId }, // Check if user is project lead
//                     { projectAdministrator: userId }, // Check if user is project administrator
//                     { projectTeam: { [Op.contains]: [userId] } } // Check if user is part of project team
//                 ]
//             }
//         });

      

//         return res.status(200).json(projects);
//     } catch (error) {
//         console.error('Error fetching projects for user:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


import { getIO } from "../../../socket";
import {Project,Team,Notification,Board,User,Department,Function} from "../../models";
import { Op } from 'sequelize';



export const createProject = async (req, res) => {
    try {
        const { name, description,  departmentid,startDate,endDate,projectLead,projectAdministrator,projectTeam,functionHead,teamId,companyId } = req.body;
console.log(" req.body : ", req.body);
        // Validate incoming data
        if (!name || !description  ||!startDate ||!endDate||!projectLead|| !projectAdministrator ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create the new project
        const newProject = await Project.create({
            name,
            description,
           
            departmentid,
         
            startDate,
            endDate,
            projectLead,
            projectAdministrator,
            projectTeam,
            functionHead,
            teamId,
            companyId
        });






        return res.status(201).json({
            message: 'Project created successfully',
            project: newProject
        });
    } catch (error) {
        console.error("ERORR IN CREATING PROJECT : " , error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getProjectsByFunctionHead = async (req, res) => {
    try {
        const { functionHead } = req.body;

        if (!functionHead) {
            return res.status(400).json({ message: 'functionHead is required' });
        }

        

        // Step 1: Get the function where headId = functionHead
        const func = await Function.findOne({ where: { headId: functionHead } });

        if (!func) {
            return res.status(404).json({ message: 'Function not found for this head' });
        }

        // Step 2: Get departments under this function
        const departments = await Department.findAll({ where: { functionId: func.id } });
        const departmentIds = departments.map(dep => dep.id);

        // Step 3: Get teams under those departments
        const teams = await Team.findAll({ where: { departmentId: departmentIds } });
        const teamIds = teams.map(team => team.id);

        // Step 4: Fetch projects based on functionHead, departmentIds, and teamIds
        const projects = await Project.findAll({
            where: {
              [Op.or]: [
                { functionHead },
                { departmentid: departmentIds },
                { teamId: teamIds },
              ],
            },
          });

        if (projects.length === 0) {
            return res.status(404).json(projects);
        }

        return res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const getProjectsByDepartmentId = async (req, res) => {
    try {
        const { departmentid } = req.body;

        // Validate departmentId
        if (!departmentid) {
            return res.status(400).json({ message: 'Department ID is required' });
        }

        // Step 1: Get the department by departmentId
        const department = await Department.findOne({ where: { id: departmentid } });

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Step 2: Get teams under the department
        const teams = await Team.findAll({ where: { departmentId: department.id } });
        const teamIds = teams.map(team => team.id);

        // Step 3: Fetch projects based on departmentId and teamIds
        const projects = await Project.findAll({
            where: {
              [Op.or]: [
                { departmentid: departmentid },
                { teamId: teamIds },
              ],
            },
        });

        if (projects.length === 0) {
            return res.status(404).json(projects);
        }

        return res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};



export const getProjectsBTeamid = async (req, res) => {
    try {
        const { teamid } = req.body;

        // Validate departmentId
        if (!teamid) {
            return res.status(400).json({ message: 'teamid ID is required' });
        }

        // Fetch teams associated with the departmentId
        const projects = await Project.findAll({
            where: { teamId:teamid },
        });

        if (projects.length === 0) {
            return res.status(404).json(projects);
        }

        return res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching teams:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const getProjectsforUser = async (req, res) => {
    try {
        const { userId } = req.body; // Expecting userId in the body

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        // Fetch all projects where userId is part of the projectLead, projectAdministrator, or projectTeam
        const projects = await Project.findAll({
            where: {
                [Op.or]: [
                    { projectLead: userId }, // Check if user is project lead
                    { projectAdministrator: userId }, // Check if user is project administrator
                    { projectTeam: { [Op.contains]: [userId] } } // Check if user is part of project team
                ]
            }
        });

      

        return res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects for user:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};