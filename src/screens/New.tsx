import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BackButton } from '../components/BackButton';
import { CheckBox } from '../components/CheckBox';
import { Feather } from '@expo/vector-icons'

import colors from 'tailwindcss/colors';
import { api } from '../lib/axios';

const avaiableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function New() {
  const [weekDays, setWeekDays] = useState<Number[]>([]);
  const [title, setTitle] = useState('')

  function handleToggleWeekDay(weekDaysIndex: number) {
    if(weekDays.includes(weekDaysIndex)) {
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDaysIndex))
    } else {
      setWeekDays(prevState => [...prevState, weekDaysIndex]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if(!title.trim() || weekDays.length === 0) {
        Alert.alert('Novo Hábito', 'Informe o nome do hábito e escolha a periodicidade.')
      }

      await api.post('/habits', { title, weekDays })
      setTitle('')
      setWeekDays([])

      Alert.alert('Novo Hábito', 'Hábito criado com sucesso.')

    } catch(error) {
      Alert.alert('Ops', 'Não foi possivel criar o novo hábito')
      console.log(error)
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento?
        </Text>

        <TextInput 
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600" 
          placeholder="Exercícios, dormir bem, etc.."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

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

        <TouchableOpacity 
          activeOpacity={0.7}
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          onPress={handleCreateNewHabit}
        >
          <Feather 
            name="check"
            size={20}
            color={colors.white}
          />

          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
