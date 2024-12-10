import { useState, useMemo, CSSProperties, ReactNode } from 'react';
import {
	PieChart,
	Pie,
	Legend,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import { Payload } from 'recharts/types/component/DefaultLegendContent';
import { Row } from '@tanstack/react-table';
import startCase from 'lodash/startCase';
import { faker } from '@faker-js/faker';
import countryList from 'country-locale-map';
// Utils
import { User } from '../../services/mockServer/server';

const geenrateChartData = (filteredUserRows: Row<User>[]) => {
	const userList = filteredUserRows.map((item) => item.original);

	const userListByContinet = userList.reduce(
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
		faker.seed(index + 402); // Just random seed to get some colors.
		return { name: key, value: count, color: faker.color.rgb() };
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
		<div style={{ height: height, width: '100%' }}>
			{title && <h1>{title}</h1>}

			<ResponsiveContainer width='100%' height='100%'>
				<PieChart width={500} height={500}>
					<Pie
						dataKey='value'
						data={chartData}
						innerRadius={120}
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
		</div>
	);
}
