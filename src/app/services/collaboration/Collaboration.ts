export interface Card {
    id: string | null;
    boardId: string;
    listId: string;
    position: number;
    title: string;
    description: string | null;
    dueDate: string | null;
}
