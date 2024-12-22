// component
import SvgColor from '../../../components/svg-color';
import PolicyIcon from '@mui/icons-material/PolicyOutlined';
import CoPresentIcon from '@mui/icons-material/CoPresentOutlined';
import BusinessIcon from '@mui/icons-material/BusinessOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const superAdminConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Companies',
    path: '/dashboard/company',
    icon: <BusinessIcon />,
  },
  // {
  //   title: 'Invite',
  //   path: '/dashboard/invite',
  //   icon: <CoPresentIcon />,
  // },
  // {
  //   title: 'users',
  //   path: '/dashboard/user',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: 'policy',
  //   path: '/dashboard/policy',
  //   icon: <PolicyIcon />,
  // },
  // {
  //   title: 'Threads',
  //   path: '/dashboard/thread',
  //   icon: icon('ic_lock'),
  // },
  //   {
  //   title: 'articles',
  //   path: '/dashboard/articles',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'buy & sell',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'questionnaire',
  //   path: '/questionnaire',
  //   icon: <QuestionAnswerOutlinedIcon />,
  // },
  // {
  //   title: 'logout',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default superAdminConfig;
