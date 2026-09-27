import React from "react";
import { SafeAreaView, Text, View,TextInput,Button } from "react-native";
import { useState } from "react";

export default function LoginScreen ({ navigation }: { navigation?: any }) {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    return(
        <SafeAreaView>
            <View>
                <Text  style={{
                    fontSize:30,
                    color:"#5988ba",
                    marginLeft: 120
                }}
                >Login</Text>
                <TextInput
                placeholder="Enter your Username"
                onChangeText={updatedUsername => setusername(updatedUsername)}
                defaultValue={username}
                style={{
                    height:40,
                    padding:5,
                    marginHorizontal: 8,
                    
                }}

                />
                <TextInput 
                placeholder="Enter Password"
                onChangeText={updatedPassword => setpassword(updatedPassword)}
                defaultValue={password}
                style={{
                        height:40,
                        padding:5,
                        marginHorizontal:8,
                        marginVertical:10,
                }}  />
                <Button title="Login" onPress={()=>console.log("hello world")}/>
            </View>
        </SafeAreaView>
    );
}