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
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity> 
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        width: "90%",
        height: 50,
        borderRadius: 15,
        elevation: 15,
        backgroundColor: "#008739",
    },
    buttonText: {
        fontSize: 18,
        fontFamily: theme.fontFamily.primary,
        letterSpacing: 0.25,
        color: "white",
    },
});

export default Botao;