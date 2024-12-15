import { User, UserWithExtraData } from '../../../mockServer/server';
import { differenceInYears } from 'date-fns';

// Adding some additional calculated properties. (age)
export const getUserListWithAddiData = (
	userList: User[],
): UserWithExtraData[] => {
	return userList.map((item) => {
		const birthDate = new Date(item.birthDate);
		const todayDate = new Date();
		const age = differenceInYears(todayDate, birthDate);

		return { ...item, age };
	});
};
