import { User } from './User';

export interface MapUser extends User {
  latitude: number;
  longitude: number;
}