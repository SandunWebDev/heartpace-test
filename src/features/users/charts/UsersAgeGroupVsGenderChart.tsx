import { useState, useMemo, CSSProperties, ReactNode } from 'react';
import {
	BarChart,
	Bar,
	Rectangle,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LabelList,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Payload } from 'recharts/types/component/DefaultLegendContent';
import startCase from 'lodash/startCase';

import { UserListWithAddiData } from '../UsersTable';

const geenrateChartData = (
	filteredUserRows: UserListWithAddiData[],
	colorMode: 'light' | 'dark',
) => {
	const ageGroups = {
		'0-19': { male: 0, female: 0, other: 0 },
		'20-29': { male: 0, female: 0, other: 0 },
		'30-39': { male: 0, female: 0, other: 0 },
		'40-49': { male: 0, female: 0, other: 0 },
		'50-59': { male: 0, female: 0, other: 0 },
		'60-69': { male: 0, female: 0, other: 0 },
		'70-79': { male: 0, female: 0, other: 0 },
		'80-89': { male: 0, female: 0, other: 0 },
		'90-99': { male: 0, female: 0, other: 0 },
		'100-X': { male: 0, female: 0, other: 0 },
	};

	filteredUserRows.forEach((user) => {
		const age = user.age;

		let ageGroup: keyof typeof ageGroups;
		switch (true) {
			case age <= 19: {
				ageGroup = '0-19';
				break;
			}
			case age <= 29: {
				ageGroup = '20-29';
				break;
			}
			case age <= 39: {
				ageGroup = '30-39';
				break;
			}
			case age <= 49: {
				ageGroup = '40-49';
				break;
			}
			case age <= 59: {
				ageGroup = '50-59';
				break;
			}
			case age <= 69: {
				ageGroup = '60-69';
				break;
			}
			case age <= 79: {
				ageGroup = '70-79';
				break;
			}
			case age <= 89: {
				ageGroup = '80-89';
				break;
			}
			case age <= 99: {
				ageGroup = '90-99';
				break;
			}
			case age > 99: {
				ageGroup = '100-X';
				break;
			}
			default: {
				ageGroup = '100-X';
			}
		}

		if (user.gender === 'male') {
			ageGroups[ageGroup].male += 1;
		} else if (user.gender === 'female') {
			ageGroups[ageGroup].female += 1;
		} else {
			ageGroups[ageGroup].other += 1;
		}
	});

	return Object.entries(ageGroups).map(([key, counts], index) => {
		return {
			name: key,
			...counts,
			color: colors[colorMode][index],
		};
	});
};

// Colors for this chart.
const colors = {
	light: ['#4A90E2', '#FF6F61', '#6EC177'],
	dark: ['#5FAEE4', '#C0767A', '#8ED1A3'],
};

export interface UsersAgeGroupVsGenderChartProps {
	title?: ReactNode;
	height?: CSSProperties['height'];
	filteredUserRows: UserListWithAddiData[];
}

export default function UsersAgeGroupVsGenderChart({
	title,
	height = '500px',
	filteredUserRows,
}: UsersAgeGroupVsGenderChartProps) {
	const theme = useTheme();
	const isInSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
	const colorMode = theme.palette.mode;

	const chartData = useMemo(() => {
		return geenrateChartData(filteredUserRows, colorMode);
	}, [filteredUserRows, colorMode]);

	const [legendOpacity, setOLegendOpacity] = useState({
		male: 1,
		female: 1,
		other: 1,
	});
	const handleLegendMouseEnter = (payload: Payload) => {
		const { dataKey } = payload;

		setOLegendOpacity((existingState) => ({
			...existingState,
			[dataKey as string]: 0.5,
		}));
	};
	const handleLegendMouseLeave = (payload: Payload) => {
		const { dataKey } = payload;

		setOLegendOpacity((existingState) => ({
			...existingState,
			[dataKey as string]: 1,
		}));
	};

	return (
		<Box style={{ height: height, width: '100%' }}>
			{title && (
				<Typography variant='h6' gutterBottom sx={{ marginBottom: '25px' }}>
					{title}
				</Typography>
			)}

			<ResponsiveContainer width='100%' height='100%'>
				<BarChart
					width={500}
					height={300}
					data={chartData}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='name' />
					<YAxis
						label={{
							value: 'Number of Users',
							angle: -90,
							position: 'insideLeft',
						}}
					/>
					<Tooltip
						formatter={(value, entry) => {
							return [value, startCase(String(entry))];
						}}
					/>
					<Legend
						onMouseEnter={handleLegendMouseEnter}
						onMouseLeave={handleLegendMouseLeave}
						formatter={(value) => {
							return startCase(String(value));
						}}
						wrapperStyle={{ paddingTop: '10px' }}
					/>
					<Bar
						dataKey='male'
						fill={colors[colorMode][0]}
						activeBar={<Rectangle />}
						barSize={30}
						fillOpacity={legendOpacity.male}>
						{!isInSmBreakpoint && (
							<LabelList
								dataKey='male'
								position='top'
								formatter={(value: string) => {
									return Number(value) > 0 ? value : '';
								}}
							/>
						)}
					</Bar>
					<Bar
						dataKey='female'
						fill={colors[colorMode][1]}
						activeBar={<Rectangle />}
						barSize={30}
						fillOpacity={legendOpacity.female}>
						{!isInSmBreakpoint && (
							<LabelList
								dataKey='female'
								position='top'
								formatter={(value: string) => {
									return Number(value) > 0 ? value : '';
								}}
							/>
						)}
					</Bar>
					<Bar
						dataKey='other'
						fill={colors[colorMode][2]}
						activeBar={<Rectangle />}
						barSize={30}
						fillOpacity={legendOpacity.other}>
						{!isInSmBreakpoint && (
							<LabelList
								dataKey='other'
								position='top'
								formatter={(value: string) => {
									return Number(value) > 0 ? value : '';
								}}
							/>
						)}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
}
