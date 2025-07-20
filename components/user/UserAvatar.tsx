import { Text, View } from "react-native";

interface UserAvatarProps {
  username: string;
  size?: number;
  fontSize?: number;
}

export const UserAvatar = ({
  username,
  size = 56,
  fontSize = 20,
}: UserAvatarProps) => {
  const getInitial = (name: string) => {
    return name?.trim().charAt(0).toUpperCase() || "?";
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#66B5F8",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#2260FF",
          fontWeight: "bold",
          fontSize,
        }}
      >
        {getInitial(username)}
      </Text>
    </View>
  );
};
