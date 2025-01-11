export interface Card {
    id: string | null;
    boardId: string;
    listId: string;
    position: number;
    title: string;
    description: string | null;
    dueDate: string | null;
}

export interface CollaborationResponse {
    content: Collaboration[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}

export interface Collaboration {
    id: number | undefined;
    name: string;
    city: string;
    title: string;
    details: string;
    requirements: string;
    compensation: string;
    company: CompanyCollaboration;
    serviceType: number;
    startDate: string;
    endDate: string;
    createdTime: string;
    lastUpdateTime: string;
    updater: string;
}

export interface CompanyCollaboration {
    id: number | undefined;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    address: string;
    imageUrl: string;
    note: string;
    serviceType: {
        id: number;
        name: string;
        description: string;
        category: string;
    };
    accountStatus: null;
    lastUpdateTime: string;
    createdTime: string;
    updater: string;
}
