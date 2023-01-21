import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import dayjs from 'dayjs';
import { api } from '../lib/axios';
import { gerenateProgressPorcentage } from '../utils/generate-progress-porcentage';

import { BackButton } from '../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import { CheckBox } from '../components/CheckBox';
import { Loading } from '../components/Loading';

interface Params {
  date: string;
}

interface DayInfoProps {
  completedHabit: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const habitsProgress = dayInfo?.possibleHabits.length ? 
  gerenateProgressPorcentage(dayInfo.possibleHabits.length, completedHabits.length) 
  : 0

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format('dddd')
  const dayEndMonth = parsedDate.format('DD/MM')

  async function fetchHabits() {
    try {
      setLoading(true)

      const response = await api.get('/day', { params: { date } })
      setDayInfo(response.data)  
      setCompletedHabits(response.data.completedHabits)    

    } catch (error) {
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    if(completedHabits.includes(habitId)) {
      setCompletedHabits(prev => prev.filter(habit => habit !== habitId))
    } else {
      setCompletedHabits(prev => [...prev, habitId])
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if(loading) {
    return(
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayEndMonth}
        </Text>

        <ProgressBar 
          progress={habitsProgress}
        />

        <View className="mt-6">
          {
            dayInfo?.possibleHabits &&
            dayInfo?.possibleHabits.map(habit => (
              <CheckBox 
              key={habit.id}
              checked={completedHabits.includes(habit.id)}
              title={habit.title} 
              onPress={() => handleToggleHabit(habit.id)}
            />
              ))  
          }
        </View>

      </ScrollView>
    </View>
  );
}
