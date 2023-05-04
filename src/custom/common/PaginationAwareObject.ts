export interface PaginationAwareObject<T> {
    from: any;
    to: any;
    per_page: any;
    total: number | any;
    current_page: number;
    prev_page?: number | null;
    next_page?: number | null;
    last_page: number | null;
    data: Array<T> | any;
}
