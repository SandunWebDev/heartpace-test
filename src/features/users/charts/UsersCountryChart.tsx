import { useState, useMemo, CSSProperties, ReactNode } from 'react';
import {
	PieChart,
	Pie,
	Legend,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Payload } from 'recharts/types/component/DefaultLegendContent';
import startCase from 'lodash/startCase';
import countryList from 'country-locale-map';

import { UserWithExtraData } from '../../../services/mockServer/server';

const geenrateChartData = (
	filteredUserRows: UserWithExtraData[],
	colorMode: 'light' | 'dark',
) => {
	const colors = {
		light: [
			'#FF6F61',
			'#6EC177',
			'#4A90E2',
			'#F5A623',
			'#D96BB4',
			'#50E3C2',
			'#FFA07A',
			'#FFD700',
			'#A020F0',
		],
		dark: [
			'#C0767A',
			'#8ED1A3',
			'#5FAEE4',
			'#DA9F88',
			'#C065B3',
			'#7AE6C9',
			'#D9B86F',
			'#9C88D3',
			'#B875D1',
		],
	};

	const userListByContinet = filteredUserRows.reduce(
		(acc, user) => {
			const country = user.country;
			const countryData = countryList.getCountryByName(country, true);
			const countryContinet = countryData?.continent ?? 'Other';

			return {
				...acc,
				[countryContinet]: acc[countryContinet] ? acc[countryContinet] + 1 : 1,
			};
		},
		{} as Record<string, number>,
	);

	return Object.entries(userListByContinet).map(([key, count], index) => {
		return { name: key, value: count, color: colors[colorMode][index] };
	});
};

export interface UsersAgeGroupVsGenderChartProps {
	title?: ReactNode;
	height?: CSSProperties['height'];
	filteredUserRows: UserWithExtraData[];
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

	const [legendOpacity, setOLegendOpacity] = useState<Record<string, number>>(
		{},
	);
	const handleLegendMouseEnter = (payload: Payload) => {
		const { value } = payload;

		setOLegendOpacity((existingState) => ({
			...existingState,
			[value as string]: 0.5,
		}));
	};
	const handleLegendMouseLeave = (payload: Payload) => {
		const { value } = payload;

		setOLegendOpacity((existingState) => ({
			...existingState,
			[value as string]: 1,
		}));
	};

	return (
		<Box style={{ height: height, width: '100%' }}>
			<Typography variant='h6' gutterBottom>
				{title}
			</Typography>

			<ResponsiveContainer width='100%' height='100%'>
				<PieChart width={500} height={500}>
					<Pie
						dataKey='value'
						data={chartData}
						innerRadius={isInSmBreakpoint ? 80 : 120}
						fill='#82ca9d'
						label={true}
						paddingAngle={5}>
						{chartData.map((entry, index) => {
							return (
								<Cell
									key={`cell-${index}`}
									fill={entry.color}
									fillOpacity={legendOpacity[entry.name]}
								/>
							);
						})}
					</Pie>
					<Tooltip />
					<Legend
						onMouseEnter={handleLegendMouseEnter}
						onMouseLeave={handleLegendMouseLeave}
						formatter={(value) => {
							return startCase(String(value));
						}}
						wrapperStyle={{ paddingTop: '10px' }}
					/>
				</PieChart>
			</ResponsiveContainer>
		</Box>
	);
}
