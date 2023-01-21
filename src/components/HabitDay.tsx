import { TouchableOpacity, Dimensions, TouchableOpacityProps } from 'react-native';
import clsx from 'clsx';

import { gerenateProgressPorcentage } from '../utils/generate-progress-porcentage';
import dayjs from 'dayjs';

interface Props extends TouchableOpacityProps {
  amountOfHabits?: number;
  amountCompleted?: number;
  date: Date
}

const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5)

export function HabitDay({amountCompleted = 0, amountOfHabits = 0, date, ...rest}: Props) {
  const amountAccompleshedPercentage = amountOfHabits > 0 
  ? gerenateProgressPorcentage(amountOfHabits, amountCompleted) 
  : 0;
  const today = dayjs().startOf('day').toDate();
  const isCurentDay = dayjs(date).isSame(today)

  return(
    <TouchableOpacity
      className={clsx("rounded-lg border-2 m-1", {
        ["bg-zinc-900 border-zinc-800"] : amountAccompleshedPercentage === 0,
        ["bg-violet-900 border-violet-700"] : amountAccompleshedPercentage > 0 && amountAccompleshedPercentage < 20,
        ["bg-violet-800 border-violet-600"] : amountAccompleshedPercentage > 20 && amountAccompleshedPercentage < 40,
        ["bg-violet-700 border-violet-500"] : amountAccompleshedPercentage > 40 && amountAccompleshedPercentage < 60,
        ["bg-violet-600 border-violet-500"] : amountAccompleshedPercentage > 60 && amountAccompleshedPercentage < 80,
        ["bg-violet-500 border-violet-400"] : amountAccompleshedPercentage > 80,
        ["border-white border-4"]: isCurentDay
        
      })}
      style={{ width: DAY_SIZE, height: DAY_SIZE}}
      activeOpacity={0.7}
      {...rest}
    />
  )
}