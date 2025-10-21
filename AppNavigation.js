
import { createDrawerNavigator } from "@react-navigation/drawer";

import HelpScreen from "./frontend/src/screens/HelpScreeen";
import HomeScreen from "./frontend/src/screens/HomeScreen";
import PatientsScreen from "./frontend/src/screens/PatientsScreen";
import SettingsScreen from "./frontend/src/screens/SettingsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppointmentScreen from "./frontend/src/screens/AppointmentScreen";


const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator()

const AppDrawer = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Principal" component={HomeScreen} />
            <Drawer.Screen name="Pacientes" component={PatientsScreen} />
            <Drawer.Screen name="Configuracion" component={SettingsScreen} />
            <Drawer.Screen name="Ayuda" component={HelpScreen} />
        </Drawer.Navigator>
    );
};

const AppTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Principal" component={HomeScreen} options={
                {
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" size={size} color={color} />
                    )
                }
            } />
            <Tab.Screen name="Pacientes" component={PatientsScreen} options={
                {
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="baby-carriage" size={size} color={color} />
                    )
                }
            }
            />
            <Tab.Screen name="Citas" component={AppointmentScreen} options={
                {
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar" size={size} color={color} />
                    )
                }
            }/>
            <Tab.Screen name="Configuracion" component={SettingsScreen} options={
                {
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="cog" size={size} color={color} />
                    )
                }
            }/>
            <Tab.Screen name="Ayuda" component={HelpScreen} options={
                {
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="help" size={size} color={color} />
                    )
                }
            }/>
        </Tab.Navigator>
    );
}

export default AppTabs;