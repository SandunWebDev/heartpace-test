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
import { Payload } from 'recharts/types/component/DefaultLegendContent';
import { Row } from '@tanstack/react-table';
import startCase from 'lodash/startCase';
import { differenceInYears } from 'date-fns';

import { User } from '../../services/mockServer/server';

const geenrateChartData = (filteredUserRows: Row<User>[]) => {
	const userList = filteredUserRows.map((item) => item.original);

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

	userList.forEach((user) => {
		const birthDate = new Date(user.birthDate);
		const todayDate = new Date();
		const age = differenceInYears(todayDate, birthDate);

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

	return Object.entries(ageGroups).map(([key, counts]) => {
		return {
			name: key,
			...counts,
		};
	});
};

export interface UsersAgeGroupVsGenderChartProps {
	title?: ReactNode;
	height?: CSSProperties['height'];
	filteredUserRows: Row<User>[];
}

export default function UsersAgeGroupVsGenderChart({
	title,
	height = '500px',
	filteredUserRows,
}: UsersAgeGroupVsGenderChartProps) {
	const chartData = useMemo(() => {
		return geenrateChartData(filteredUserRows);
	}, [filteredUserRows]);

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
		<div style={{ height: height, width: '100%' }}>
			{title && <h1>{title}</h1>}

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
						fill='#4285F4 '
						activeBar={<Rectangle />}
						barSize={30}
						fillOpacity={legendOpacity.male}>
						<LabelList
							dataKey='male'
							position='top'
							formatter={(value: string) => {
								return Number(value) > 0 ? value : '';
							}}
						/>
					</Bar>
					<Bar
						dataKey='female'
						fill='#EA4335'
						activeBar={<Rectangle />}
						barSize={30}
						fillOpacity={legendOpacity.female}>
						<LabelList
							dataKey='female'
							position='top'
							formatter={(value: string) => {
								return Number(value) > 0 ? value : '';
							}}
						/>
					</Bar>
					<Bar
						dataKey='other'
						fill='#FBBC05'
						activeBar={<Rectangle />}
						barSize={30}
						fillOpacity={legendOpacity.other}>
						<LabelList
							dataKey='other'
							position='top'
							formatter={(value: string) => {
								return Number(value) > 0 ? value : '';
							}}
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
