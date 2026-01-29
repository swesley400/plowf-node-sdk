export function toQueryString(params: object): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });

    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

export function parseDate(date: string | null | undefined): Date | null {
    if (!date) return null;
    return new Date(date);
}

export function formatDate(date: Date): string {
    return date.toISOString();
}
