export interface ApiResponse  <T, M = any> {
    Data: T;
    Message: M;
    Status: string;
    Success: boolean;
}