import { useEffect, useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Loading } from "../components/Loading";
import { Header } from "../components/Header";

import { useNavigation } from "@react-navigation/native";

import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";
import dayjs from "dayjs";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

type SummaryProps = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number
}>

export function Home() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryProps | null>(null)

  const { navigate } = useNavigation();

  async function fetchDate() {
    try {
      setLoading(true)
      const response = await api.get('/summary');

      setSummary(response.data)
    } catch(error) {
      Alert.alert('Ops', 'Não foi possível carrregar o sumário de hábitos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDate()
  }, [])

  
  if(loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row  mt-6 mb-2">
        {weekDays.map((weekDay, i) => (
          <Text
            key={`${weekDay}-${i}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView 
       showsVerticalScrollIndicator={false}
       contentContainerStyle={{ paddingBottom: 100 }}
      >

        { summary &&
            <View className="flex-row flex-wrap">
            {datesFromYearStart.map(date => {
              const dayWithHabits = summary.find(day => {
                return dayjs(date).isSame(day.date, 'day')
              })

              console.log(dayWithHabits)
  
              return (
                <HabitDay 
                  key={date.toString()} 
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  onPress={() => navigate('habit', { date: date.toISOString() })}
               />
              )
            })}
  
            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, i) => (
                <View
                  key={i}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))}
          </View>
        }
      </ScrollView>
    </View>
  );
}
