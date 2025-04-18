// component
import SvgColor from "../../../components/svg-color";
import PolicyIcon from "@mui/icons-material/PolicyOutlined";
import CoPresentIcon from "@mui/icons-material/CoPresentOutlined";
import BadgeIcon from "@mui/icons-material/Badge";
import TaskIcon from "@mui/icons-material/AssignmentOutlined"; // For task management
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const Leadconfig = [
  {
    title: "dashboard",
    path: "/dashboard/app",
    icon: icon("ic_analytics"),
  },

  {
    title: "users",
    path: "/dashboard/user",
    icon: icon("ic_user"),
  },
  {
    title: "Team Management",
    path: "/dashboard/Team-management",
    icon: <BadgeIcon />,
  },
  {
    title: "Task Management",
    path: "/dashboard/task-management",
    icon: <TaskIcon />,
  },
  {
    title: "policy",
    path: "/dashboard/policy",
    icon: <PolicyIcon />,
  },
  {
    title: "announccements",
    path: "/dashboard/announcements",
    icon: icon("ic_announcements"),
  },
  {
    title: "Connects",
    path: "/dashboard/thread",
    icon: icon("ic_lock"),
  },
  // {
  //   title: 'company',
  //   path: '/dashboard/company',
  //   icon: <BusinessIcon />,
  // },
  // {
  //   title: "articles",
  //   path: "/dashboard/articles",
  //   icon: icon("ic_blog"),
  // },
  // {
  //   title: "Marketplace",
  //   path: "/dashboard/products",
  //   icon: icon("ic_cart"),
  // },
  {
    title: "Chat",
    path: "/dashboard/chat-company",
    icon: <QuestionAnswerOutlinedIcon />,
  },
  {
    title: "questionnaire",
    path: "/dashboard/questionnaire",
    icon: icon("ic_question"),
  },
  {
    title: "gamification",
    path: "/dashboard/gamification",
    icon: icon("ic_gamification"),
  },
  {
    title: "articles",
    path: "/dashboard/articles",
    icon: icon("ic_blog"),
  },
  {
    title: "logout",
    path: "/login",
    icon: icon("ic_lock"),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default Leadconfig;
