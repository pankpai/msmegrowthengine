import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose';

interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, any>;
    errors?: any;
    path?: string;
    value?: any;
    name: string;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(err);

    if (err.code === 11000 && err.keyValue) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];

        res.status(400).json({
            status: false,
            message: `Duplicate value for field '${field}': '${value}' already exists`
        });
        return;
    }

    if (err.name === 'ValidationError' && err.errors) {
        res.status(400).json({
            status: false,
            message: 'Validation failed',
            details: err.errors
        });
        return;
    }

    if (err.name === 'CastError') {
        res.status(400).json({
            status: false,
            message: `Invalid ${err.path}: ${err.value}`
        });
        return;
    }

    res.status(err.statusCode || 500).json({
        status: false,
        message: err.message || 'Internal Server Error'
    });
};
