export class ApiResponse {
    statusCode: number;
    message: string;
    data: any;
    success: boolean;

    constructor(statusCode: number, message: string, data: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }

    static success(data: any, message: string = 'Success'): ApiResponse {
        return new ApiResponse(200, message, data);
    }

    static created(data: any, message: string = 'Created successfully'): ApiResponse {
        return new ApiResponse(201, message, data);
    }

    static noContent(message: string = 'No content'): ApiResponse {
        return new ApiResponse(204, message, null);
    }
}