import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useRouter } from "expo-router";
import { useDate } from "@/context/DateContext";
import dayjs from "dayjs";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

const Calendario = ({ isProfessor }: { isProfessor: boolean }) => {
  const router = useRouter();
  const { selectedDate, setSelectedDate } = useDate();

  const minDate = dayjs().add(1, "day").format("YYYY-MM-DD");
  const today = dayjs().format("YYYY-MM-DD");

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    if (isProfessor) {
      router.push(`/(tabs)/${day.dateString}`);
    } else {
      router.push(`/aluno/${day.dateString}`);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        dayComponent={({ date }) => {
          const dateStr = date.dateString;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === today;
          const isDisabled = dayjs(dateStr).isBefore(minDate);

          return (
            <Pressable
              onPress={() =>
                !isDisabled && handleDayPress({ dateString: dateStr })
              }
              disabled={isDisabled}
              style={{
                backgroundColor: isSelected ? "#32A041" : "transparent",
                borderColor: isToday ? "#32A041" : "transparent",
                borderWidth: isToday ? 2 : 0,
                borderRadius: 19,
                width: 38,
                height: 38,
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 3,
                marginVertical: 6,
              }}
            >
              <Text
                style={{
                  color: isSelected ? "#fff" : isDisabled ? "#b0b0b0" : "#222",
                  fontWeight: "600",
                }}
              >
                {date.day}
              </Text>
            </Pressable>
          );
        }}
        minDate={minDate}
        disableAllTouchEventsForDisabledDays
        theme={{
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#32A041",
          arrowColor: "#000",
          monthTextColor: "#000",
          textMonthFontSize: 22,
          textMonthFontWeight: "700",
          textDayHeaderFontSize: 14,
          textDayHeaderFontWeight: "600",
          todayTextColor: "#32A041",
          "stylesheet.calendar.header": {
            week: {
              flexDirection: "row",
              justifyContent: "space-around",
              paddingTop: 6,
              backgroundColor: "transparent",
            },
          },
        }}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  calendar: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Calendario;
