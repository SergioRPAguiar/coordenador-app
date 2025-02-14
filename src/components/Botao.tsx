import { theme } from "@/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";


interface BotaoProps {
    title: string;
    onPress: () => void;
    style?: object;
    textStyle?: object;
}

const Botao: React.FC<BotaoProps> = ({ title, onPress, style, textStyle }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.9}
>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity> 
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
        width: "100%",
        height: 50,
        borderRadius: 12,
        backgroundColor: "#008739",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      },
      buttonText: {
        fontSize: 16,
        fontFamily: theme.fontFamily.medium,
        color: "white",
        letterSpacing: 0.5,
      },
});

export default Botao;