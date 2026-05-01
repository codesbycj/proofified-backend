import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ideaId = customAlphabet(alphabet, 12);
const secret = customAlphabet(alphabet, 24);

export const newIdeaId = () => ideaId();
export const newSecretKey = () => secret();
