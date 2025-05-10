import { CookieOptions } from "express";

export const getCookieOptions = (): CookieOptions => {
    const isProd = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'lax' : 'lax',
        maxAge: 1000 * 60 * 60 * 2
    }
}