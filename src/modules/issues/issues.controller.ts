import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess, sendError } from '../../utils/response';
import type { AuthRequest } from '../../middleware/authenticate';
import {
  createIssue,
  getAllIssues,
  getIssueById,
  getReporterById,
  updateIssue,
  deleteIssue,
} from './issues.service';

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, type } = req.body;

    if (!title || !type || !description) {
      sendError(res, StatusCodes.BAD_REQUEST, 'Title, description and type are required');
      return;
    }

    if (!['bug', 'feature_request'].includes(type)) {
      sendError(res, StatusCodes.BAD_REQUEST, 'Type must be bug or feature_request');
      return;
    }

    if (title.length > 200) {
      sendError(res, StatusCodes.BAD_REQUEST, 'Title must be under 200 characters');
      return;
    }

    if (description.length < 10) {
      sendError(res, StatusCodes.BAD_REQUEST, 'Description must be at least 10 characters');
      return;
    }

    if (!req.user) {
    sendError(res, StatusCodes.UNAUTHORIZED, 'Unauthorized');
    return;
    }

    const issue = await createIssue(
    title,
    description,
    type,req.user.id
    );

    sendSuccess(res, StatusCodes.CREATED, 'Issue created successfully', issue);
  } catch (err) {
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong', err);
  }
};

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const { sort = 'newest', type, status } = req.query as {
      sort?: string;
      type?: string;
      status?: string;
    };

    const issues = await getAllIssues(sort, type, status);

    const issuesWithReporter = await Promise.all(
      issues.map(async (issue) => {
        const reporter = await getReporterById(issue.reporter_id);
        const { reporter_id, ...rest } = issue;
        return { ...rest, reporter };
      })
    );

    sendSuccess(res, StatusCodes.OK, 'Issues fetched successfully', issuesWithReporter);
  } catch (err) {
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong', err);
  }
};

export const getSingle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const issue = await getIssueById(Number(id));

    if (!issue) {
      sendError(res, StatusCodes.NOT_FOUND, 'Issue not found');
      return;
    }

    const reporter = await getReporterById(issue.reporter_id);
    const { reporter_id, ...rest } = issue;

    sendSuccess(res, StatusCodes.OK, 'Issue fetched successfully', { ...rest, reporter });
  } catch (err) {
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong', err);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, type } = req.body;

    const issue = await getIssueById(Number(id));

    if (!issue) {
      sendError(res, StatusCodes.NOT_FOUND, 'Issue not found');
      return;
    }

    if (!req.user) {
    sendError(res, StatusCodes.UNAUTHORIZED, 'Unauthorized');
    return;
    }
    if (req.user.role === 'contributor') {
      if (issue.reporter_id !== req.user.id) {
        sendError(res, StatusCodes.FORBIDDEN, 'You can only update your own issues');
        return;
      }
      if (issue.status !== 'open') {
        sendError(res, StatusCodes.CONFLICT, 'You can only update open issues');
        return;
      }
    }

    const updated = await updateIssue(
      Number(id),
      title || issue.title,
      description || issue.description,
      type || issue.type
    );

    sendSuccess(res, StatusCodes.OK, 'Issue updated successfully', updated);
  } catch (err) {
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong', err);
  }
};

export const dele = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const issue = await getIssueById(Number(id));

    if (!issue) {
      sendError(res, StatusCodes.NOT_FOUND, 'Issue not found');
      return;
    }

    await deleteIssue(Number(id));
    sendSuccess(res, StatusCodes.OK, 'Issue deleted successfully');
  } catch (err) {
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong', err);
  }
};