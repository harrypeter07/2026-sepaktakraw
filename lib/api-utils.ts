import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from './types';

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

export function errorResponse(
  error: string,
  status: number = 400
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

export function validationError(
  errors: Record<string, string>
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      data: errors as any,
    },
    { status: 422 }
  );
}

export async function validateRequest(
  req: NextRequest,
  requiredFields: string[]
): Promise<{ valid: false; error: NextResponse<ApiResponse<null>> } | { valid: true; data: any }> {
  try {
    const body = await req.json();

    const errors: Record<string, string> = {};
    for (const field of requiredFields) {
      if (!body[field]) {
        errors[field] = `${field} is required`;
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        valid: false,
        error: validationError(errors),
      };
    }

    return { valid: true, data: body };
  } catch (error) {
    return {
      valid: false,
      error: errorResponse('Invalid request body', 400),
    };
  }
}

export function unauthorized(): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized',
    },
    { status: 401 }
  );
}

export function forbidden(): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Forbidden',
    },
    { status: 403 }
  );
}

export function notFound(): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Not found',
    },
    { status: 404 }
  );
}
