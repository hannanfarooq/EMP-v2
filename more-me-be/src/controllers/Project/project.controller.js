
import { getIO } from "../../../socket";
import {Project,Team,Notification,Board,User} from "../../models";
import { Op } from 'sequelize';


export const createProject = async (req, res) => {
    try {
        const { name, description,  departmentid,startDate,endDate,projectLead,projectAdministrator,projectTeam } = req.body;
console.log(" req.body : ", req.body);
        // Validate incoming data
        if (!name || !description  || !departmentid||!startDate ||!endDate||!projectLead|| !projectAdministrator ) {
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
            projectTeam
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

export const getProjectsByDepartmentId = async (req, res) => {
    try {
        const { departmentid } = req.body;

        // Validate departmentId
        if (!departmentid) {
            return res.status(400).json({ message: 'Department ID is required' });
        }

        // Fetch teams associated with the departmentId
        const projects = await Project.findAll({
            where: { departmentid:departmentid },
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


export const getProjectsBTeamid = async (req, res) => {
    try {
        const { teamid } = req.body;

        // Validate departmentId
        if (!teamid) {
            return res.status(400).json({ message: 'teamid ID is required' });
        }

        // Fetch teams associated with the departmentId
        const projects = await Project.findAll({
            where: { teamid:teamid },
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