import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { User } from "@/types/User";

interface Props {
  user: User;
  sessionId: string;
}

const SessionDetailsCard: React.FC<Props> = ({ user, sessionId }) => {
  return (
    <View style={{ padding: 16, backgroundColor: "#f4f4f4" }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <Image
          source={{ uri: user.profilePhotoUrl || "https://via.placeholder.com/50" }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={{ color: "gray" }}>Casa Loma, Toronto</Text>
        </View>
      </View>
      <Text>Medical Appointment, Wound Care</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            padding: 12,
            borderRadius: 8,
            flex: 1,
            marginRight: 8,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Change Time</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "black",
            padding: 12,
            borderRadius: 8,
            flex: 1,
          }}
        >
          <Text style={{ color: "black", textAlign: "center" }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SessionDetailsCard;