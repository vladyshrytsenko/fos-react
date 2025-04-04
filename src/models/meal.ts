
export interface Meal {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    name: string;
    price: number;
    portionWeight: number;
    cuisineId?: number;
    cuisineName: string;
}
