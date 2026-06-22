import { Availability } from './Availability.js';
import { Destination } from './Destination.js';
import { GroupMember } from './GroupMember.js';
import { Profile } from './Profile.js';
import { TripGroup } from './TripGroup.js';
import { Trip } from './Trip.js';
import { Vote } from './Vote.js';

export type SunchaserSchema = {
  TripGroup: TripGroup;
  GroupMember: GroupMember;
  Destination: Destination;
  Vote: Vote;
  Availability: Availability;
  Profile: Profile;
  Trip: Trip;
};

export const schema = [
  TripGroup,
  GroupMember,
  Destination,
  Vote,
  Availability,
  Profile,
  Trip,
];
