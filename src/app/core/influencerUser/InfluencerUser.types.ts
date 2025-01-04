import { Influencer } from "app/services/influencer/Influencer"

export interface InfluencerUser
{
    id: string;
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
