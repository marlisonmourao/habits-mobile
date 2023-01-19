import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";

const avaiableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sábado",
];

export function New() {
  const [weekDays, setWeekDays] = useState<Number[]>([]);

  function handleToggleWeekDay(weekDaysIndex: number) {
    if(weekDays.includes(weekDaysIndex)) {
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDaysIndex))
    } else {
      setWeekDays(prevState => [...prevState, weekDaysIndex]);
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento?
        </Text>

        <TextInput className="h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-white focus:border-2 focus:border-green-600" />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a recorrência?
        </Text>

        {avaiableWeekDays.map((weekDay, index) => (
          <CheckBox 
            key={weekDay}
            title={weekDay}
            checked={weekDays.includes(index)}
            onPress={() => handleToggleWeekDay(index)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
