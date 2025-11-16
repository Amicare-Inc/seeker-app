import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from 'react-native-maps';

type Coordinate = { latitude: number; longitude: number };

type NearbyPswMapProps = {
	users: any[] | undefined;
	markerCoords: Record<string, Coordinate>;
	initialRegion: Region;
	style?: StyleProp<ViewStyle>;
};

const NearbyPswMap: React.FC<NearbyPswMapProps> = ({ users, markerCoords, initialRegion, style }) => {
	return (
		<MapView
			provider={PROVIDER_GOOGLE}
			style={style}
			initialRegion={initialRegion}
		>
			{users?.map((u: any) => {
				const coord = markerCoords[u.id];
				if (!coord) return null;
				return (
					<Marker
						key={u.id}
						coordinate={coord}
						title={`${u.firstName} ${u.lastName}`}
					>
						<Callout>
							<View>
								<Text>{u.firstName} {u.lastName}</Text>
								{u.distanceInfo?.distance && (
									<Text>{u.distanceInfo.distance}</Text>
								)}
							</View>
						</Callout>
					</Marker>
				);
			})}
		</MapView>
	);
};

export default NearbyPswMap;


