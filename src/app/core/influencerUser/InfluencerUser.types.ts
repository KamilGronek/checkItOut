import { Influencer } from "app/services/influencer/Influencer"

export interface InfluencerUser
{
    id: number;
    firebaseUserId: string;
    userType: string;
    email: string;
    firstName: string;
    lastName: string;
    accountStatus: string;
    influencer: Influencer
    createdTime: string,
    lastUpdateTime: string
}
