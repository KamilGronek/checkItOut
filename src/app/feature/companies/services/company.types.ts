export interface CompanyResponse {
    content: Company[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}

export interface Company {
    id: number | undefined;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    address: string;
    phoneNumber: string;
    instagramId: string;
    apiKey: string;
    imageUrl: string;
    note: string;
    serviceType: ServiceType;
    lastUpdateTime: string;
    createdTime: string;
    updater: string;
    // instagramAccountType: string;
    // accountStatus: string;
    messageToAdmin: string;
    noteFromAdmin: string;
    adminNoteTime: string;
}

interface ServiceType {
    id: number;
    description: string;
    category: string;
    name: string;
}

export interface City {
    id: number;
    name: string;
}
