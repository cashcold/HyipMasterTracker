import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { store } from '../db/store.ts';
import { IContactMessage } from '../types.ts';

export async function submitContact(req: AuthRequest, res: Response) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newMessage: IContactMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    store.contactMessages.unshift(newMessage);
    store.persist();

    return res.status(201).json({
      message: 'Your inquiry has been received. Our research team will respond within 24 hours.',
      id: newMessage.id,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to submit contact message' });
  }
}

export async function getContactMessages(req: AuthRequest, res: Response) {
  try {
    return res.json({ messages: store.contactMessages });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
}

export async function updateContactStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, replyNotes } = req.body;
    const msg = store.contactMessages.find((m) => m.id === id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });

    if (status) msg.status = status;
    if (replyNotes) msg.replyNotes = replyNotes;

    store.persist();
    return res.json({ message: 'Message updated', contactMessage: msg });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update message' });
  }
}
