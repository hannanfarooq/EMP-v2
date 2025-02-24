import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { useChart } from '../../../components/chart';
import { CircularProgressBar } from "@tomickigrzegorz/react-circular-progress-bar";
import { Margin } from '@mui/icons-material';

const props = {
  animationSmooth: '500ms ease-out',
  percent: 67,
  colorSlice: '#00a1ff',
  colorCircle: '#fff',
  fontColor: '#555659',
  fontSize: '1.5rem',
  fontWeight: 700,
  size: 300,
  stroke: 7,
  strokeBottom: 5,
  speed: 500,
  cut: 0,
  rotation: 30,
  opacity: 10,
  round: true,
  fill: window.outerWidth > 1024 ? '#fff' : '#EBFAFE',
  unit: '%',
  textPosition: '0.35em',
  animationOff: false,
  strokeDasharray: '10,1',
  inverse: false,
  number: true,
  linearGradient: ['#AC87FB', '#65D0FC']
}

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const StyledChartWrapper = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: 58,
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

AppCurrentVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
  chartData: PropTypes.array,
};

export default function AppCurrentVisits({ title, subheader, chartColors, chartData, ...other }) {
  const theme = useTheme();

  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = useChart({
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {/* 
      <StyledChartWrapper dir="ltr">  
        <ReactApexChart type="pie" series={chartSeries} options={chartOptions} height={280} />
      </StyledChartWrapper> */}
      <div className='mt-10 mb-5 ml-7' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgressBar {...props} />
      </div>

      {/* <div className='mt-5 mb-5'>
        <CardHeader style={{ color: '#fff' }} title={'.'} subheader={subheader} />
      </div> */}
    </Card>
  );
}
