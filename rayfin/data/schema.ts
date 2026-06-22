import { Availability } from './Availability.js';
import { Destination } from './Destination.js';
import { GroupMember } from './GroupMember.js';
import { TripGroup } from './TripGroup.js';
import { Vote } from './Vote.js';

export type SunchaserSchema = {
  TripGroup: TripGroup;
  GroupMember: GroupMember;
  Destination: Destination;
  Vote: Vote;
  Availability: Availability;
};

export const schema = [TripGroup, GroupMember, Destination, Vote, Availability];
