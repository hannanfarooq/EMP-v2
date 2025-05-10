import { AttachMoneyOutlined, FitnessCenterOutlined, TagFacesOutlined, Man3Outlined, HealingOutlined, SpaOutlined, PsychologyOutlined } from '@mui/icons-material';

//export const baseURL = 'http://18.206.90.216:3004';
// for local host
// export const baseURL = 'http://localhost:3004';
// for aws server
export const baseURL = process.env.REACT_APP_SERVER_URL || 'http://18.213.181.237:5000';

export const QUESTIONS_ANSWERED = 'questionsAnswered';

export const areas = [
    {name: 'Motivation', icon: <TagFacesOutlined /> }, 
    {name: 'Exercise', icon: <FitnessCenterOutlined /> }, 
    {name: 'Leadership', icon: <Man3Outlined /> }, 
    {name: 'Nutrition', icon: <HealingOutlined /> }, 
    {name: 'Self-Care', icon: <SpaOutlined /> }, 
    {name: 'Mindset', icon: <PsychologyOutlined /> }, 
    {name: 'Personal Finance', icon: <AttachMoneyOutlined /> },
  ];

export const question_emojies = [
  {
    name: "⛔",
  },
  {
    name: "👎",
  },
  {
    name: "🤷",
  },
  {
    name: "👍",
  },
  {
    name: "✅",
  },
];

export const buyAndSellCategories = [
  {
    value: 'All Products' 
  },
  {
    value: 'Clothing'
  },
  {
    value: 'Electronics'
  },
  {
    value: 'Sports'
  },
  {
    value: 'Others'
  },
]
