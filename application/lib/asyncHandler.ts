import { NextResponse } from "next/server";
import { ApiError } from "./apiError";

export function asyncHandler<
  T extends (...args: any[]) => Promise<Response>
>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error("API Error:", err);

      if (err instanceof ApiError) {
        return NextResponse.json(
          { error: err.message },
          { status: err.statusCode }
        );
      }

      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }) as T;
}
