import Contact from '../models/Contact.model.js';

export async function createContactMessage(req, res, next) {
  try {
    const contactMessage = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Mesajınız başarıyla alındı.',
      data: contactMessage
    });
  } catch (err) {
    next(err);
  }
}
