import { RequestHandler } from "express";
import NoteModel from '../models/note';
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getAllNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

export const getNote: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { noteId } = req.params;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}

interface ICreateNoteBody {
    title?: string;
    text?: string;
}

export const createNote: RequestHandler<unknown, unknown, ICreateNoteBody, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { title, text } = req.body;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, 'Note must have a title');
        }

        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title,
            text
        });

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
}

interface IUpdateNoteParams {
    noteId: string;
}

interface IUpdateNoteBody {
    title?: string;
    text?: string;
}

export const updateNote: RequestHandler<IUpdateNoteParams, unknown, IUpdateNoteBody, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { noteId } = req.params;
    const { title: newTitle, text: newText } = req.body;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, 'Invalid note id');
        }

        if (!newTitle) {
            throw createHttpError(400, 'Note must have a title');
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        note.title = newTitle;
        newText && (note.text = newText);

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { noteId } = req.params;
    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, 'Invalid note id');
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        await note.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}