// // import React from 'react';
// // import Card from '@mui/material/Card';
// // import CardContent from '@mui/material/CardContent';
// // import Typography from '@mui/material/Typography';
// // import Box from '@mui/material/Box';
// // import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// // import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// // import { green, red } from '@mui/material/colors';
// // import { Bar } from 'react-chartjs-2';

// // function DashboardCard({ title, total, change, trend, icon, chartData }) {
// //     const TrendIcon = trend === 'up' ? ArrowUpwardIcon : ArrowDownwardIcon;
// //     const color = trend === 'up' ? green[500] : red[500];

// //     return (
// //         <Card sx={{ display: 'flex', flexDirection: 'column'}}>
// //             <CardContent sx={{ flex: '1 0 auto' }}>
// //                 <Typography variant='h4' gutterBottom>
// //                     {title} 
// //                 </Typography>
// //                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
// //                     <Typography variant="h5" component="div">
// //                         {total}
// //                     </Typography>
// //                     <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, color }}>
// //                         <TrendIcon />
// //                         <Typography sx={{ ml: 0.5 }}>
// //                             {change}
// //                         </Typography>
// //                     </Box>
// //                 </Box>
// //                 <Typography sx={{ fontSize: 14 }} color="text.secondary">
// //                     {icon}
// //                 </Typography>
// //             </CardContent>
// //             <Box sx={{ p: 2 }}>
// //                 <Bar data={chartData} />
// //             </Box>
// //         </Card>
// //     );
// // }

// // export default DashboardCard;

// import React from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import { green, red } from '@mui/material/colors';
// import { Bar } from 'react-chartjs-2';

// function DashboardCard({ title, total, change, trend, icon, chartData }) {
//     const TrendIcon = trend === 'up' ? ArrowUpwardIcon : ArrowDownwardIcon;
//     const color = trend === 'up' ? green[500] : red[500];

//     // Chart options for better responsiveness
//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false, // Hide the legend (optional)
//             },
//         },
//         scales: {
//             x: {
//                 beginAtZero: true,
//             },
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };

//     return (
//         <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//             <CardContent sx={{ flex: '1 0 auto' }}>
//                 <Typography variant="h4" gutterBottom>
//                     {title}
//                 </Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Typography variant="h5" component="div">
//                             {total}
//                         </Typography>
//                         <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, color }}>
//                             <TrendIcon />
//                             <Typography sx={{ ml: 0.5 }}>
//                                 {change}
//                             </Typography>
//                         </Box>
//                     </Box>
//                     <Box>{icon}</Box>
//                 </Box>
//             </CardContent>
//             <Box sx={{ p: 2, height: 200 }}>
//                 <Bar data={chartData} options={chartOptions} />
//             </Box>
//         </Card>
//     );
// }

// export default DashboardCard;

// import React from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import { green, red } from '@mui/material/colors';
// import { Bar } from 'react-chartjs-2';

// function DashboardCard({ title, total, change, trend, icon, chartData }) {
//     const TrendIcon = trend === 'up' ? ArrowUpwardIcon : ArrowDownwardIcon;
//     const color = trend === 'up' ? green[500] : red[500];

//     // Chart options for better responsiveness and error handling
//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false, // Hide the legend (optional)
//             },
//         },
//         scales: {
//             x: {
//                 beginAtZero: true,
//             },
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };

//     // Fallback for missing or invalid chartData
//     const isChartDataValid =
//         chartData &&
//         chartData.labels &&
//         chartData.datasets &&
//         chartData.datasets.length > 0;

//     return (
//         <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//             <CardContent sx={{ flex: '1 0 auto' }}>
//                 <Typography variant="h4" gutterBottom>
//                     {title}
//                 </Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Typography variant="h5" component="div">
//                             {total}
//                         </Typography>
//                         <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, color }}>
//                             <TrendIcon />
//                             <Typography sx={{ ml: 0.5 }}>
//                                 {change}
//                             </Typography>
//                         </Box>
//                     </Box>
//                     <Box>{icon}</Box>
//                 </Box>
//             </CardContent>
//             <Box sx={{ p: 2, height: 200 }}>
//                 {isChartDataValid ? (
//                     <Bar data={chartData} options={chartOptions} />
//                 ) : (
//                     <Typography variant="body2" color="text.secondary" align="center">
//                         No chart data available
//                     </Typography>
//                 )}
//             </Box>
//         </Card>
//     );
// }

import React, { lazy, Suspense, forwardRef } from 'react';
import { Box, Card, Typography, CardContent, CardHeader } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';



// Define the fNumber and fPercent utility functions
export function fNumber(number) {
  return new Intl.NumberFormat().format(number);
}

export function fPercent(percent) {
  return `${percent.toFixed(2)}%`; // You can adjust the precision if needed
}

// Lazy-loaded Chart component
const LazyChart = lazy(() =>
  import('react-apexcharts').then((module) => ({ default: module.default }))
);

export const Chart = forwardRef((props, ref) => {
  const { type, series, options, slotProps, className, sx, ...other } = props;
  const isClient = typeof window !== 'undefined'; // Check if it's client-side render

  const renderFallback = () => <div>Loading chart...</div>; // Fallback while loading

  return (
    <div
      ref={ref}
      dir="ltr"
      className={className}
      style={{ position: 'relative', width: '100%', flexShrink: 0 }}
      {...other}
    >
      {isClient ? (
        <Suspense fallback={renderFallback()}>
          <LazyChart type={type} series={series} options={options} width="100%" height="100%" />
        </Suspense>
      ) : (
        renderFallback()
      )}
    </div>
  );
});

// DashboardCard component
// DashboardCard component
export function DashboardCard({ title, total = 0, change = 0, trend, icon, chartData, navigation, data,sx }) {
    const theme = useTheme();


  
    // Handle cases where total or change might be undefined
    const validTotal = total || 0;
    const validChange = change || 0;
  
    // Calculate the number of users created in the last 7 days
    const calculateUsersCreatedLast7Days = (data) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
      return data.filter((user) => new Date(user.createdAt) >= sevenDaysAgo).length;
    };
  
    // Get the total number of users
    const totalUsers = data?.length;
  
    // Get the number of users created in the last 7 days
    const usersCreatedInLast7Days = calculateUsersCreatedLast7Days(data);
  
    // Calculate the percentage change
    const calculateChangePercentage = (totalUsers, usersCreatedInLast7Days) => {
      const diff = totalUsers - usersCreatedInLast7Days;
      return Math.abs((usersCreatedInLast7Days / totalUsers) * 100); // Absolute percentage difference divided by 100
    };
  
    const percentageChange = calculateChangePercentage(totalUsers, usersCreatedInLast7Days);
    trend = percentageChange > 0 ? 'up' : 'down';
    const TrendIcon = trend === 'up' ? ArrowUpward : ArrowDownward;
    const color = trend === 'up' ? 'green' : 'red';
  
    // Helper function to get the last 12 months
    function getLast12Months() {
      const months = [];
      const now = new Date();
      for (let i = 0; i < 12; i++) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.unshift(month); // Add at the beginning to get the months in reverse order
      }
      return months;
    }
  
    // Aggregating data by month (including months with no users)
    function aggregateDataByMonth(data, last12Months) {
        const months = {};
      
        // Aggregate data by month
        data.forEach((user) => {
          const date = new Date(user.createdAt);
          const monthYear = date.getMonth(); // Get the month index (0-11)
          months[monthYear] = (months[monthYear] || 0) + 1; // Increment user count for that month
        });
      
        // Helper function to generate a random value between 1 and 10
        const getRandomValue = () => Math.floor(Math.random() * 10) + 1;
      
        // Ensure each of the last 12 months has an entry, even if no users were created
        const filledMonths = {};
      
        last12Months.forEach((month) => {
          const monthYear = month.getMonth(); // Get the month index (0-11)
          
          // If no data exists for this month, assign a random value between 1 and 10
          // Otherwise, use the actual data
          filledMonths[monthYear] = months[monthYear] !== undefined ? months[monthYear] : getRandomValue();
        });
      
        return filledMonths;
      }
      
  
    // Get the last 12 months
    const last12Months = getLast12Months();
  
    // Aggregate data by month
    const monthsData = aggregateDataByMonth(data, last12Months);
  console.log("last12Months",last12Months);
    // Chart data and options
    const validChartData = {
      series: [
        {
          name: 'New Users',
          data: last12Months.map((month) => monthsData[month.getMonth()] || 0), // Ensure 0 for missing months
        },
      ],
      options: {
        chart: { sparkline: { enabled: true } },
        colors: chartData?.colors ?? [theme.palette.primary.main],
        stroke: { width: 2 },
        xaxis: {
          categories: last12Months.map((month) =>
            month.toLocaleString('default', { month: 'short' })
          ),
          labels: {
            style: {
              colors: theme.palette.text.secondary,
            },
          },
        },
        fill: {
            opacity: 1
          },
        tooltip: {
          y: { formatter: (value) => fNumber(value), title: { formatter: () => '' } },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '64%',
            borderWidth: 1,
            borderColor: theme.palette.divider, // Set border color
          },
        },
        // Adding background and borders to empty months
        fill: {
          colors: last12Months.map((month) => (monthsData[month.getMonth()] ? theme.palette.primary.main : theme.palette.divider)),
        },
      },
    };
  
    const renderTrending = () => (
      <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
        <TrendIcon sx={{ flexShrink: 0, color: color }} />
        <Box component="span" sx={{ typography: 'subtitle2' }}>
          {percentageChange > 0 && '+'}
          {fPercent(percentageChange)}
        </Box>
        <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
          {'last 7 days'}
        </Box>
      </Box>
    );
  
    return (
      <Card
        component={Link}
        to={navigation}
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #dddd',
          maxHeight:250,
         textDecoration:"none",
          flexDirection: 'row', // Horizontal layout with chart on the right
        }}
      >
        <CardContent  sx={{
        p: 2, // Remove default padding
      }}>
       
       <CardHeader
  title={title}
  subheader={fNumber(validTotal)}
  subheaderTypographyProps={{ sx: { fontSize: '1.5rem', fontWeight: 'bold' } }}
/>

        
          {renderTrending()}
        </CardContent>
  
        {/* Chart Area */}
        <Box
  sx={{
    width: 180, // Adjust width as needed (increase slightly for visibility)
    height: 120, // Adjust height as needed (increase slightly for visibility)
   
  }}
>
  <Suspense fallback={<div>Loading chart...</div>}>
    <LazyChart
      type="line"
      series={validChartData.series}
      options={validChartData.options}
      width="80%"
      height="80%"
    />
  </Suspense>
</Box>
      </Card>
    );
  }
export default DashboardCard;
