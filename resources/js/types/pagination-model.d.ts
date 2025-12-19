export interface PaginationModel<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string?;
        label: string;
        page: number?;
        active: boolean;
    }[];
    next_page_url: string?;
    path: string;
    per_page: number;
    prev_page_url: string?;
    to: number;
    total: number;
}