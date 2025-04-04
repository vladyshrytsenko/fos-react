
export interface Drink {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    name: string;
    price: number;
}
